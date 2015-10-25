
import os
import json

sources = [
    os.path.dirname(os.path.abspath(__file__)),
    os.path.expanduser('~'),
    '/etc',
]

config_file = None

for source in sources:
    fn = os.path.join(source, 'helene.json')
    if os.path.isfile(fn):
        config_file = fn
        break

if config_file is None:
    raise Exception('Not found any config file in ' + ' or '.join(sources))

config = json.load(open(config_file))
