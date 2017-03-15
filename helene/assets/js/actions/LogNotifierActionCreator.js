
import Dispatcher from '../Dispatcher';
import Actions from '../constants/DataConstants';

import WebSocket from 'reconnecting-websocket';
import qs from 'qs';

export class LogNotifierActionCreator {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    onMessageReceived(event) {
        let data = JSON.parse(event.data);
        console.debug(data);
        this.dispatcher.dispatch({
            type: Actions.LOG_MESSAGE_RECEIVED,
            data,
        });
    }

    listen(host, port, paths) {
        let query = {path: paths};
        let remote_url = `ws://${host}:${port}/listens/json?${qs.stringify(query)}`;
        this.client = new WebSocket(remote_url);
        this.client.addEventListener('open', () => {
            console.log(`WebSocket connected to ${remote_url}`);
        });
        this.client.addEventListener('message', this.onMessageReceived.bind(this))
    }
}

export default new LogNotifierActionCreator(Dispatcher);
