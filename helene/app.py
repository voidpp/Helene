import json
from flask import Flask, render_template
from functools import partial
import logging
import logging.config

app = Flask('helene')

from helene.weather import Weather
from helene.server_info import ServerInfo
from helene.torrent import Torrent
from helene.temperature import Temperature
from helene.episode_tracking import EpisodeTracking

from helene.config import config, config_file

from voidpp_tools.alchemy_encoder import AlchemyEncoder

if 'logger' in config:
    logging.config.dictConfig(config['logger'])

logger = logging.getLogger(__name__)

logger.info("Config loaded from '%s'" % config_file)

services = [
    dict(
        url = 'weather',
        handler = Weather(),
    ),
    dict(
        url = 'servers',
        handler = ServerInfo(config['servers']),
    ),
    dict(
        url = 'torrent',
        handler = Torrent(config['torrent']),
    ),
    dict(
        url = 'temperature',
        handler = Temperature(config['temperature_database']),
    ),
    dict(
        url = 'episode_tracking',
        handler = EpisodeTracking(config['episode_tracking']),
    ),
]

@app.route('/')
@app.route('/<layout>')
def index(layout = 'desktop'):
    return render_template('index.html', layout = layout, config = config)

def handle_service_request(service):
    logger.debug("Handle service request: '%s'" % service['url'])
    try:
        response = service['handler']()
    except Exception as e:
        logger.exception("Unhandled exception")
        raise

    return json.dumps(response, cls = AlchemyEncoder)

for service in services:
    app.add_url_rule('/service/%s' % service['url'],
                     view_func = partial(handle_service_request, service),
                     endpoint = 'service_%s' % service['url']
                    )
