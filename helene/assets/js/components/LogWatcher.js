
import React from 'react';
import moment from 'moment';

import {ComponentAsFactory, bind} from '../tools';
import LoggerStore from '../stores/LoggerStore';

export class LogWatcher extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onMessageReceived);
        this.state = {
            messages: LoggerStore.data,
        };
        this._levelNames = {
            warning: "warn",
        }
    }

    componentDidMount() {
        LoggerStore.addChangeListener(this.onMessageReceived);
    }

    componentWillUnmount() {
        LoggerStore.removeChangeListener(this.onMessageReceived);
    }

    onMessageReceived() {
        this.setState({messages: LoggerStore.data});
    }

    onIgnoreMessage(time) {
        console.log(time);
        // TODO: store this info on server side
    }

    render() {
        let msgs = this.state.messages.slice(-18);
        let rows = [];
        for(let msg of msgs) {
            let time = moment(msg.time);
            let levelName = msg.data.levelname.toLowerCase();
            let levelCaption = levelName in this._levelNames ? this._levelNames[levelName] : levelName;
            let ignore = this.onIgnoreMessage.bind(this, msg.time);
            rows.push(tr(
                td(div({onClick: ignore, className: `level_${levelName}`}, levelCaption)),
                td({className: "path"}, msg.path),
                td({className: "time"}, time.format("YYYY-MM-DD HH:mm")),
                td({className: "message"}, msg.data.msg)
            ));
        }
        return table(tbody(...rows));
    }
}

export default ComponentAsFactory(LogWatcher);
