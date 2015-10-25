import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class TrafficStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.speed = {};
        this.today = {};
    }

    dispatchCallback(action) {
        switch (action.type) {
            case DataActionTypes.TRAFFIC_SPEED_FETCHED:
                this.speed = action.data;
                this.emitChange();
                break;
            case DataActionTypes.TRAFFIC_TODAY_FETCHED:
                this.today = action.data;
                this.emitChange();
                break;
            default:
                break;
        }
    }
}

export default new TrafficStore(Dispatcher);
