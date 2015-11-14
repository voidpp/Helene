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

    dispatchCallback(action) {
        if (action.type !== DataActionTypes.EPISODE_TRACKING_FETCHED)
            return;

        let shows = [];
        let now = new Date().getTime();

        for (let id in action.data) {
            let show_data = action.data[id];
            if (show_data.next == null) {
                console.log('No next info for ' + show_data.eng_name + ', id:', show_data.id);
                continue;
            }
            show_data.next.air_en = new Date(show_data.next.air_en);
            show_data.prev.air_en = new Date(show_data.prev.air_en);
            show_data.curr.air_en = new Date(show_data.curr.air_en);
            shows.push(show_data);
        }

        function watch_info(sd) {
            if (sd.next.air_en.getTime() - now > 1000*60*60*24*30)
                return 1;
            if ((sd.curr.en == epStatus.DOWNLOADABLE || sd.curr.en == epStatus.DOWNLOADED) && sd.prev.en == epStatus.WATCHED)
                return 4;
            if (sd.curr.en == epStatus.WATCHED && sd.prev.en == epStatus.WATCHED) {
                return 3;
            }
            return 2;
        }

        shows.sort((a, b) => {
            let wia = watch_info(a);
            let wib = watch_info(b);
            if (wia !== wib)
                return wib - wia;
            if (a.progress !== b.progress)
                return b.progress - a.progress;
            return a.next.air_en.getTime() - b.next.air_en.getTime();
        });

        this.data = shows;
        this.emitChange();
    }
}

export default new EpisodeTrackingStore(Dispatcher);
