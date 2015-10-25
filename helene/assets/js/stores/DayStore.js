
import equal from 'deep-equal';

import BaseStore from './BaseStore';
import Dispatcher from '../Dispatcher';

export class DayStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.today = this._getToday();
        setInterval(this._updateData.bind(this), 1000);
    }

    _updateData() {
        let today = this._getToday();
        if (equal(today, this.today))
            return;
        this.today = today;
        this.emitChange();
    }

    _getToday() {
        let now = new Date();
        return {
            years: now.getFullYear(),
            months: now.getMonth(),
            date: now.getDate(),
        }
    }

    dispatchCallback(action) {
    }
}

export default new DayStore(Dispatcher);
