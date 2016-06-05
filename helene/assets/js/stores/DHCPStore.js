
import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class DHCPStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.leases = [];
    }

    dispatchCallback(action) {
        switch (action.type) {
            case DataActionTypes.DCHP_FETCHED:
                let leases = [];
                for(let lease of action.data.leases) {
                    lease.time = parseInt(lease.time);
                    leases.push(lease);
                }
                this.leases = leases;
                this.leases.sort((a, b) => b.time - a.time);
                this.emitChange();
                break;
            default:
                break;
        }
    }
}

export default new DHCPStore(Dispatcher);

