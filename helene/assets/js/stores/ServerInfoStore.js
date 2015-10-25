import BaseStore from './BaseStore';

import Dispatcher from '../Dispatcher';
import DataActionTypes from '../constants/DataConstants';

export class ServerInfoStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.data = {};
    }

    _calcState(server) {
        if (server.ping === null)
            return 'error';
        if (server.details === null || server.details.load[0] > server.details.cpu * 2)
            return 'warning';
        return 'ok';
    }

    _initDetails(server) {
        if (server.ping !== null && server.details !== null)
            return;
        server.details = {
            cpu: null,
            uptime: null,
            memory: {
                percent: 0,
            },
            load: [null, null, null]
        }
    }

    dispatchCallback(action) {
        if (action.type !== DataActionTypes.SERVER_INFO_FETCHED)
            return;
        this.data = action.data;
        for (let server of this.data) {
            server.state = this._calcState(server);
            this._initDetails(server);
        }

        this.emitChange();
    }
}

export default new ServerInfoStore(Dispatcher);
