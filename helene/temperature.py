from contextlib import contextmanager
import sqlalchemy
import datetime

from service import Service
from models import Sensor, DataTiny

Session = sqlalchemy.orm.sessionmaker()

class Temperature(Service):
    def __init__(self, config):
        self.config = config
        self.engine = sqlalchemy.create_engine('mysql://%(user)s:%(pass)s@%(host)s/%(name)s' % config, encoding = 'latin1')

    @contextmanager
    def get_session(self):
        session = Session(bind = self.engine)
        yield session
        session.commit()

    def __call__(self):
        data = {}
        time = None
        with self.get_session() as session:

            sensors = session.query(Sensor).all()

            temps = session.query(DataTiny).filter(DataTiny.time > datetime.datetime.now() - datetime.timedelta(1)).order_by(DataTiny.time).all()

            for s in sensors:
                data[s.id] = s
                s.min = 100
                s.max = -100
                s.current = None
                s.short_diff = None
                s.temps = []

            for temp in temps:
                data[temp.sensor_id].temps.append(temp)

            now = datetime.datetime.now()
            short_time = datetime.timedelta(hours = 1)

            time = temps[-1:][0].time

            for sid in data:
                sensor = data[sid]
                sensor.current = sensor.temps[-1:][0].value
                for temp in sensor.temps:
                    if sensor.short_diff is None and temp.time > now - short_time:
                        sensor.short_diff = sensor.current - temp.value
                    if temp.value < sensor.min:
                        sensor.min = temp.value
                    if temp.value > sensor.max:
                        sensor.max = temp.value

                if sensor.short_diff is None:
                    sensor.short_diff = 0.0

        return dict(
            data = data,
            time = time.isoformat(),
        )
