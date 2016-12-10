import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class LaunchesStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.launches = [];
        setInterval(this.emitChange.bind(this), 1000);
    }

    dispatchCallback(action) {
        switch (action.type) {
            case DataActionTypes.LAUNCHES_FETCHED:
                this.launches = action.data.launches;
                this.emitChange();
                break;
            default:
                break;
        }
    }
}

export default new LaunchesStore(Dispatcher);
