
import React from 'react';
import numeral from 'numeral';
import moment from 'moment';

import {ComponentAsFactory, bind} from '../tools';
import ServerInfoStore from '../stores/ServerInfoStore';

export class ServerInfo extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onServerChange);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        ServerInfoStore.addChangeListener(this.onServerChange);
    }

    componentWillUnmount() {
        ServerInfoStore.removeChangeListener(this.onServerChange);
    }

    onServerChange() {
        this.setState({data: ServerInfoStore.data});
    }

    render() {
        let rows = [];
        for (let server of this.state.data) {
            let isDetails = server.ping && server.details.uptime;
            rows.push(tr(
                td({className: 'status'}, img({src: `/static/pic/status-${server.state}.png`})),
                td(server.name),
                td(img({src: `/static/pic/flags/${server.location}.png`})),
                td({className: 'ping'}, server.ping ? numeral(server.ping).format('0.00') + ' ms' : null),
                td(isDetails ? numeral(server.details.load[0]).format('0.00') : null),
                td(isDetails ? numeral(server.details.load[1]).format('0.00') : null),
                td(isDetails ? numeral(server.details.load[2]).format('0.00') : null),
                td({className: 'memory'}, isDetails ? div({className: 'progress'}, div({className: 'value', style: {width: server.details.memory.percent + '%'}}, ' ')) : null),
                td(isDetails ? moment.duration(server.details.uptime*1000).humanize() : null)
            ));
        }
        return div({className: 'server_info'}, table(
            thead(
                tr(
                    th({colSpan: 3, className: 'timestamp'}, moment().format('HH:mm:ss')),
                    th('Ping'),
                    th({colSpan: 3}, 'Load'),
                    th('Memory'),
                    th('Uptime')
                )
            ),
            tbody(...rows)
        ));
    }
}

export default ComponentAsFactory(ServerInfo);
