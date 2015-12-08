import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export var epStatus = {
    DEFAULT: 0,
    WATCHED: 1,
    DOWNLOADABLE: 2,
    DOWNLOADED: 3,
};

export class EpisodeTrackingStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.data = [];
        this.__lang = 'en'; // TODO
    }

    _preprocess_data(data) {
        let shows = [];

        for (let id in data) {
            let show_data = data[id];
            if (show_data.next == null) {
                console.log('No next info for ' + show_data.eng_name + ', id:', show_data.id);
                show_data.next = {
                    air_en: '2099-01-01',
                    air_hu: '2099-01-01',
                    en: 0,
                    hu: 0,
                    season: 0,
                    episode: 0,
                    real: false,
                }
            } else {
                show_data.next.real = true;
            }
            if (show_data.prev == null) {
                console.log('No prev info for ' + show_data.eng_name + ', id:', show_data.id);
                show_data.prev = {
                    air_en: '2000-01-01',
                    air_hu: '2000-01-01',
                    en: 0,
                    hu: 0,
                    season: 0,
                    episode: 0,
                    real: false,
                }
            }
            show_data.next.air_en = new Date(show_data.next.air_en);
            show_data.prev.air_en = new Date(show_data.prev.air_en);
            show_data.curr.air_en = new Date(show_data.curr.air_en);
            show_data.progress = show_data.watched_cnt / show_data.available_cnt * 100;
            shows.push(show_data);
        }

        return shows;
    }

    _sort_data(data) {
        let now = new Date().getTime();

        function watch_info(sd) {
            if ((sd.curr.en == epStatus.DOWNLOADABLE || sd.curr.en == epStatus.DOWNLOADED) && sd.prev.en == epStatus.WATCHED)
                return 4;
            if (sd.next.air_en.getTime() - now > 1000*60*60*24*30)
                return 1;
            if (sd.curr.en == epStatus.WATCHED && sd.prev.en == epStatus.WATCHED) {
                return 3;
            }
            return 2;
        }

        data.sort((a, b) => {
            let wia = watch_info(a);
            let wib = watch_info(b);
            if (wia !== wib)
                return wib - wia;
            if (a.progress !== b.progress)
                return b.progress - a.progress;
            return a.next.air_en.getTime() - b.next.air_en.getTime();
        });
    }

    dispatchCallback(action) {
        if (action.type !== DataActionTypes.EPISODE_TRACKING_FETCHED)
            return;

        let shows = this._preprocess_data(action.data);
        this._sort_data(shows);

        this.data = shows;
        this.emitChange();
    }
}

export default new EpisodeTrackingStore(Dispatcher);
