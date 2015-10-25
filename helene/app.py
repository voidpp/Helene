import json
from flask import Flask, render_template
from functools import partial

app = Flask('helene')

from helene.weather import Weather
from helene.server_info import ServerInfo
from helene.torrent import Torrent
from helene.temperature import Temperature

from helene.config import config

from helene.tools import AlchemyEncoder

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
]

@app.route('/')
@app.route('/<layout>')
def index(layout = 'desktop'):
    return render_template('index.html', layout = layout, config = config)

def handle_service_request(service):
    response = service['handler']()
    return json.dumps(response, cls = AlchemyEncoder)

for service in services:
    app.add_url_rule('/service/%s' % service['url'],
                     view_func = partial(handle_service_request, service),
                     endpoint = 'service_%s' % service['url']
                    )
