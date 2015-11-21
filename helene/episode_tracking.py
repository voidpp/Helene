import tools
import json
import logging

from datetime import datetime, timedelta
from service import Service
from copy import copy

logger = logging.getLogger(__name__)

class EpisodeTracking(Service):
    def __init__(self, config):
        self.config = config
        self.remove_fields = ['episodes', 'epnums', 'imdb_link', 'porthu_link', 'tvrage_link', 'loaded', 'ended', 'group', 'tvcom_link']

    def get_categs(self):
        # TODO: python tvs API wrapper...
        url = 'https://tvstore.me/api/%s/episode/tracking?action=getgroups' % self.config['tvstore_api_key']
        logger.debug('Fetch tracking groups: %s from %s' % (', '.join([str(x) for x in self.config['group_id_list']]), url))
        content = json.load(tools.load_url(url))
        categs = []
        for grp_id in content:
            if int(grp_id) in self.config['group_id_list']:
                categs += content[grp_id]['categs']
        return categs

    def get_categ_data(self, categs):
        cats = ','.join([str(x) for x in categs])
        url = 'https://tvstore.me/api/%s/episode/tracking?action=getalldata&c=%s' % (self.config['tvstore_api_key'], cats)
        logger.debug('Fetch categories: %s' % url)
        return json.load(tools.load_url(url))

    def get_episodes_status(self, all_episodes, data):
        now = datetime.now()
        curr = None
        prev = None
        progress_cnt = 0
        progress_all = 0
        for season in sorted([int(x) for x in all_episodes.keys()]):
            ep_int_list = sorted([int(x) for x in all_episodes[str(season)].keys()])
            progress_all += len(ep_int_list)
            for episode in ep_int_list:
                ep_data = all_episodes[str(season)][str(episode)]
                ep_data['episode'] = episode
                ep_data['season'] = season
                if ep_data['en'] == 1 or ep_data['hu'] == 1:
                    progress_cnt += 100
                if 'air_en' not in ep_data or ep_data['air_en'][0] == '0':
                    continue
                date = datetime.strptime(ep_data['air_en'], "%Y-%m-%d %H:%M:%S") + timedelta(days = 1)
                ep_data['air_en'] = date.strftime('%Y-%m-%d')
                if date > now:
                    return dict(prev = prev, curr = curr, next = ep_data, progress = progress_cnt / progress_all)
                prev = curr
                curr = ep_data

        return dict(prev = prev, curr = curr, next = None, progress = progress_cnt / progress_all)

    def check_subtitles(self, categ):
        subtitle_status_data = {}
        with open('/mnt/manfred/.autosubs.cache.json') as f:
            subtitle_status_data = json.load(f)
        title = categ['eng_name']
        season = str(categ['curr']['season']) # only strings can be key in JSON
        episode = categ['curr']['episode']
        if title not in subtitle_status_data:
            return False
        if season not in subtitle_status_data[title]:
            return False
        return episode in subtitle_status_data[title][season]

    def get_imdb_airs(self, categs):
        data = dict()
        for categ in categs:
            data[categ['id']] = dict(
                title = categ['eng_name'],
                imdb_id = categ['imdb_link'],
                after = [categ['curr']['season'], categ['curr']['episode']],
            )

        url = '%s/airdates' % self.config['air_imdb_server']
        logger.debug("Fetch airdate from imdb: %s from url %s" % (', '.join([str(x) for x in data.keys()]), url))
        return json.load(tools.load_url(url, json.dumps(data)))

    def __call__(self):
        categ_data = self.get_categ_data(self.get_categs())
        for id in categ_data:
            data = categ_data[id]
            data.update(self.get_episodes_status(data['episodes'], data))
            data['lastseen'] = [int(x) for x in data['lastseen'].split('x')]
            data['curr']['subtitles'] = self.check_subtitles(data)

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
