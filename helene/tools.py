from sqlalchemy.ext.declarative import DeclarativeMeta
import json
import urllib2

def load_url(url, data = None):
    req = urllib2.Request(url, data)
    response = urllib2.urlopen(req)
    return response

def load_urls(url, data = None):
	return load_url(url, data).read()

class JsonEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__

class AlchemyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}
            for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                try:
                    json.dumps(data) # this will fail on non-encodable values, like other classes
                    fields[field] = data
                except TypeError:
                    fields[field] = None
            # a json-encodable dict
            return fields

        return json.JSONEncoder.default(self, obj)