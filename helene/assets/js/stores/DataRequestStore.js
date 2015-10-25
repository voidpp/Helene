
import Actions from '../constants/DataConstants';
import BaseStore from './BaseStore';
import Dispatcher from '../Dispatcher';

export class DataRequestStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.descriptors = [];
        this._types = [];
        setInterval(this._tick.bind(this), 1000);
    }

    _tick() {
        let now = new Date();
        for (let desc of this.descriptors) {
            if (desc.last_fetch)
                desc.untill_next_fetch = parseInt((desc.interval * 1000 - (now.getTime() - desc.last_fetch.getTime()))/1000);
        }
        this.emitChange();
    }

    dispatchCallback(action) {
        if (action.type == Actions.DATA_REQUEST_DESCRIPTORS_STARTED) {
            this.descriptors = action.descriptors;
            for (let desc of action.descriptors)
                this._types.push(desc.type);
            this.emitChange();
        } else if(this._types.indexOf(action.type) !== -1) {
            for (let desc of this.descriptors) {
                if (action.type == desc.type) {
                    desc.last_fetch = new Date();
                    this.emitChange();
                    break;
                }
            }
        }
    }
}

export default new DataRequestStore(Dispatcher);
