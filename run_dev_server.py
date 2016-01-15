
from helene.app import app

app.debug = True

app.run('0.0.0.0', 5010, threaded = True, use_reloader = True, use_debugger = True)