import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class WeatherStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.data = {};
    }

    dispatchCallback(action) {
        if (action.type !== DataActionTypes.WEATHER_FETCHED)
            return;
        this.data = action.data;
        this.emitChange();
    }
}

export default new WeatherStore(Dispatcher);
