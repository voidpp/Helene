import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class LoggerStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.data = [];
    }

    dispatchCallback(action) {
        if (action.type !== DataActionTypes.LOG_MESSAGE_RECEIVED)
            return;
        this.data.push(action.data);
        if(this.data.length > 1000)
            this.data.shift();
        this.emitChange();
    }
}

export default new LoggerStore(Dispatcher);
