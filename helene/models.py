import datetime

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship

Base = declarative_base()

class Sensor(Base):
    __tablename__ = 'sensors'

    id = Column(Integer, primary_key = True)
    name = Column(String)
    desc = Column(String)

class DataTiny(Base):
    __tablename__ = 'data_tiny'

    id = Column(Integer, primary_key = True)
    time = Column(DateTime, default=datetime.datetime.now)
    sensor_id = Column(Integer, ForeignKey("sensors.id"), nullable = False)
    value = Column(Float)

    sensor = relationship("Sensor")
