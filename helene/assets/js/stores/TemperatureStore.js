import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class TemperatureStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.data = {};
    }

    dispatchCallback(action) {
        if (action.type !== DataActionTypes.ROOM_TEMP_FETCHED)
            return;
        this.data = action.data;
        this.emitChange();
    }
}

export default new TemperatureStore(Dispatcher);
