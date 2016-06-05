
import React from 'react';
import moment from 'moment';

import {ComponentAsFactory, bind} from '../tools';
import DHCPStore from '../stores/DHCPStore';

export class DHCP extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onChange);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        DHCPStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        DHCPStore.removeChangeListener(this.onChange);
    }

    onChange() {
        this.setState({data: DHCPStore.leases});
    }

    render() {
        let rows = [];
        let now = moment();
        for(let lease of this.state.data) {
            let diff = moment.duration(moment.unix(lease.time).diff(now));
            rows.push(tr(
               td(lease.hostname),
               td(lease.ip),
               td(diff.humanize())
            ));
        }
        return table({className: 'dhcp'},
            thead(tr(th({colSpan: '100%'}, 'DHCP'))),
            tbody(...rows)
        );
    }
}

export default ComponentAsFactory(DHCP);

