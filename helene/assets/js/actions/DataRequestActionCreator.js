
import reqwest from 'reqwest';
import Dispatcher from '../Dispatcher';

import Actions from '../constants/DataConstants';

export class DataRequestDescriptor {
    constructor(type, url, interval, title) {
        this.type = type;
        this.url = url;
        this.interval = interval;
        this.title = title;
        this.last_fetch = null;
        this.untill_next_fetch = null;
    }
}

export class ServiceDescriptor extends DataRequestDescriptor {
    constructor(type, service, interval, title) {
        super(type, '/service/' + service, interval, title);
    }
}

export class DataRequestActionCreator {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    _startRequest(desc) {
        let start = new Date().getTime();
        reqwest({
            url: desc.url,
            method: 'get',
            type: 'json',
            crossOrigin: true,
            success: (resp) => {
                let time = new Date().getTime() - start;
                if (process.env.debug)
                    console.debug(`Data received from url '${desc.url}' in ${time} ms`, resp);
                this.dispatcher.dispatch({
                    type: desc.type,
                    data: resp,
                });
            },
        });
    }

    start(...descriptors) {
        for (let desc of descriptors) {
            this._startRequest(desc);
            desc.intervalId = setInterval(this._startRequest.bind(this, desc), desc.interval * 1000);
        }
        this.dispatcher.dispatch({
            type: Actions.DATA_REQUEST_DESCRIPTORS_STARTED,
            descriptors,
        });
    }
}

export default new DataRequestActionCreator(Dispatcher);
