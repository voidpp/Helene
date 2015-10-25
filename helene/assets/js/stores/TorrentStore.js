import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class TorrentStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.data = {
            status: {
                speed: {
                    rx: 0,
                    tx: 0,
                },
                data: {
                    rx: 0,
                    tx: 0,
                },
                active_time: 0,
                free_space: 0,
            },
        };
    }

    dispatchCallback(action) {
        if (action.type !== DataActionTypes.TORRENT_LIST_FETCHED)
            return;
        this.data = action.data;
        this.emitChange();
    }
}

export default new TorrentStore(Dispatcher);
