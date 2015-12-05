import subprocess
import re
import json
from service import Service
from voidpp_tools.http import HTTP

class ServerInfo(Service):
    name = 'servers'

    def __init__(self, server_list):
        self.server_list = server_list

    def ping(self, host):
        cnt = 4
        try:
            ping_raw = subprocess.check_output('ping %s -c %d -i 0.2' % (host, cnt), shell = True)
        except subprocess.CalledProcessError as exc:
            return None
        pattern = '64 bytes from %s: icmp_.eq=([0-9]{1,2}) ttl=([0-9]{1,4}) time=([0-9\.]{1,5}) ms' % re.escape(host)
        if not re.search(pattern, ping_raw):
            return None
        time_sum = 0
        for match in re.finditer(pattern, ping_raw):
            time_sum += float(match.group(3))
        return round(time_sum / cnt, 2)

    def __call__(self):
        data = []

        for server in self.server_list:
            ping = self.ping(server['ip'])
            server['ping'] = ping
            if ping is not None:
                try:
                    server['details'] = HTTP.load_json(server['details_url'])
                except Exception as e:
                    server['details'] = None
            data.append(server)

        return data
