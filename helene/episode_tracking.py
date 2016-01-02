import json
import logging
import HTMLParser
from voidpp_tools.http import HTTP

from datetime import datetime, timedelta
from service import Service
from copy import copy

logger = logging.getLogger(__name__)

class EpisodeTracking(Service):
    def __init__(self, config):
        self.config = config
        self.remove_fields = ['episodes', 'epnums', 'imdb_link', 'porthu_link', 'tvrage_link', 'loaded', 'ended', 'group', 'tvcom_link']
        self.html_parser = HTMLParser.HTMLParser()

    def get_categs(self):
        # TODO: python tvs API wrapper...
        url = 'https://tvstore.me/api/%s/episode/tracking?action=getgroups' % self.config['tvstore_api_key']
        logger.debug('Fetch tracking groups: %s from %s' % (', '.join([str(x) for x in self.config['group_id_list']]), url))
        content = HTTP.load_json(url)
        categs = []
        for grp_id in content:
            if int(grp_id) in self.config['group_id_list']:
                categs += content[grp_id]['categs']
        return categs

    def get_categ_data(self, categs):
        cats = ','.join([str(x) for x in categs])
        url = 'https://tvstore.me/api/%s/episode/tracking?action=getalldata&c=%s' % (self.config['tvstore_api_key'], cats)
        logger.debug('Fetch categories: %s' % url)
        return HTTP.load_json(url)

    def get_episodes_status(self, all_episodes, data):
        now = datetime.now()
        curr = None
        prev = None
        watched_cnt = 0
        available_cnt = 0
        result = None
        def generate_result(next):
            return dict(prev = prev,
                        curr = curr,
                        next = next,
                        watched_cnt = watched_cnt,
                        available_cnt = available_cnt)

        for season in sorted([int(x) for x in all_episodes.keys()]):
            for episode in sorted([int(x) for x in all_episodes[str(season)].keys()]):
                ep_data = all_episodes[str(season)][str(episode)]
                ep_data['episode'] = episode
                ep_data['season'] = season
                if 'en' not in ep_data:
                    logger.warning("Tracking data not found in episode data in %s - %sx%s" % (data['eng_name'], season, episode))
                    ep_data['en'] = 0
                    ep_data['hu'] = 0
                if ep_data['en'] == 1 or ep_data['hu'] == 1:
                    watched_cnt += 1
                if ep_data['en'] > 0 or ep_data['hu'] > 0:
                    available_cnt += 1
                if 'air_en' not in ep_data or ep_data['air_en'][0] == '0':
                    continue
                date = datetime.strptime(ep_data['air_en'], "%Y-%m-%d %H:%M:%S") + timedelta(days = 1)
                ep_data['air_en'] = date.strftime('%Y-%m-%d')
                # generate result, but need to continue the iteration due counting available episodes
                if date > now and result is None:
                    result = generate_result(ep_data)
                prev = curr
                curr = ep_data

        if result is None:
            result = generate_result(None)

        return result

    def check_subtitles(self, categ, cache):
        title = self.html_parser.unescape(categ['eng_name'])
        season = str(categ['curr']['season']) # only strings can be key in JSON
        episode = categ['curr']['episode']
        if title not in cache:
            return False
        if season not in cache[title]:
            return False
        return episode in cache[title][season]

    def get_imdb_airs(self, categs):
        if self.config['air_imdb_server'] is None:
            return {}
        data = dict()
        for categ in categs:
            data[categ['id']] = dict(
                title = categ['eng_name'],
                imdb_id = categ['imdb_link'],
                after = [categ['curr']['season'], categ['curr']['episode']],
            )

        url = '%s/airdates' % self.config['air_imdb_server']
        logger.debug("Fetch airdate from imdb: %s from url %s" % (', '.join([str(x) for x in data.keys()]), url))
        return HTTP.load_json(url, json.dumps(data))

    def load_subtitle_cache(self):
        subtitle_status_data = {}
        if self.config['autosubs_cache_file'] is None:
            return subtitle_status_data
        with open(self.config['autosubs_cache_file']) as f:
            subtitle_status_data = json.load(f)
        logger.debug("Subtitle cache loaded. Tvshows: %s" % subtitle_status_data.keys())
        return subtitle_status_data

    def __call__(self):
        sub_cache = self.load_subtitle_cache()
        categ_data = self.get_categ_data(self.get_categs())
        for id in categ_data:
            data = categ_data[id]
            data.update(self.get_episodes_status(data['episodes'], data))
            if data['lastseen'] == 0:
                data['lastseen'] = [0, 0]
            else:
                data['lastseen'] = [int(x) for x in data['lastseen'].split('x')]
            data['curr']['subtitles'] = self.check_subtitles(data, sub_cache)

        remote_airs = []
        for id in categ_data:
            data = categ_data[id]
            if data['next'] is None:
               remote_airs.append(data)

        imdb_airs = self.get_imdb_airs(remote_airs)
        for id in imdb_airs:
            data = imdb_airs[id]
            if data is not None:
                data.update(en = 0, hu = 0)
                categ_data[id]['next'] = data

        for id in categ_data:
            data = categ_data[id]
            for name in self.remove_fields:
                del categ_data[id][name]

        return categ_data
