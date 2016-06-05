from voidpp_tools.http import HTTP
from service import Service
from datetime import datetime
from collections import namedtuple
import logging

logger = logging.getLogger(__name__)

Lease = namedtuple("Lease", ["time", "mac", "ip", "hostname", "id"])

class DHCP(Service):
    name = 'dhcp'

    def __init__(self, config):
        self.config = config

    def fetch_leases(self):
        raw_data = HTTP.load_urls(self.config['uri'])

        leases = []

        for line in raw_data.split("\n"):
            cols = line.split(' ')
            if len(cols) < 2:
                continue
            lease = Lease(*cols)
            data = dict(lease._asdict())
            if lease.mac in self.config['devices']:
                data['hostname'] = self.config['devices'][lease.mac]
            leases.append(data)

        return leases

    def __call__(self):
        return dict(
            leases = self.fetch_leases(),
        )
