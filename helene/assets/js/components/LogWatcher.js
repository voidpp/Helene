
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

    _implodeMessages(messages) {
        console.debug("Number of messages:", messages.length);
        let res = [];
        let lastMessage = null;
        let lastMessageCnt = 1;
        for (let msg of messages) {
            if(lastMessage && lastMessage.data.orig_message == msg.data.msg) {
                lastMessageCnt++;
                lastMessage.data.msg = span(lastMessage.data.orig_message, span({className: 'multiple-counter'}, lastMessageCnt));
                continue;
            }
            lastMessageCnt = 1;
            res.push(msg);
            lastMessage = msg;
        }
        return res;
    }

    render() {
        let msgs = this._implodeMessages(this.state.messages);
        msgs.reverse();
        msgs = msgs.slice(0, 17);
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
