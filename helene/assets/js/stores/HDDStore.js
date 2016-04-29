import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class HDDStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.hdds = [];
    }

    dispatchCallback(action) {
        switch (action.type) {
            case DataActionTypes.HDD_STAT_FETCHED:
                this.hdds = action.data;
                this.hdds.sort((a, b) => a.percent - b.percent);
                this.emitChange();
                break;
            default:
                break;
        }
    }
}

export default new HDDStore(Dispatcher);

