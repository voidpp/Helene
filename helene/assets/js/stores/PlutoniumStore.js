import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class PlutoniumStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.feeds = [];
    }

    dispatchCallback(action) {
        switch (action.type) {
            case DataActionTypes.PLUTONIUM_FEEDS_FETCHED:
                this.feeds = action.data.data.rows;
                this.emitChange();
                break;
            default:
                break;
        }
    }
}

export default new PlutoniumStore(Dispatcher);
