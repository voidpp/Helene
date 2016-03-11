import transmissionrpc

from service import Service

class Torrent(Service):
    name = 'torrent'

    def __init__(self, config):
        self.config = config

    def get_client(self):
        return transmissionrpc.Client(self.config['host'], port = self.config['port'])

    def get_status(self):
        session = self.get_client().session_stats()
        return dict(
            speed = dict(
                tx = session.uploadSpeed,
                rx = session.downloadSpeed,
            ),
            data = dict(
                tx = session.cumulative_stats['uploadedBytes'],
                rx = session.cumulative_stats['downloadedBytes'],
            ),
            free_space = session.download_dir_free_space,
            active_time = session.cumulative_stats['secondsActive'],
        )

    def get_downloading_torrents(self):
        data = {}
        for torrent in self.get_client().get_torrents():
            if torrent.percentDone == 1.0:
                continue
            data[torrent.hashString] = dict(
                download_speed = torrent.rateDownload,
                size = torrent.sizeWhenDone,
                name = torrent.name,
                downloaded = int(torrent.sizeWhenDone * torrent.percentDone),
                percentDone = torrent.percentDone,
                eta = None,
            )
            try:
                data[torrent.hashString]['eta'] = torrent.eta.seconds
            except ValueError as e:
                pass
        return data

    def __call__(self):
        return dict(
            downloading = self.get_downloading_torrents(),
            status = self.get_status(),
        )
