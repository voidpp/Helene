
import React from 'react';
import numeral from 'numeral';

import {ComponentAsFactory, bind} from '../tools';
import HDDStore from '../stores/HDDStore';
import Lang from '../lang';

export class HDDStat extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onChange);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        HDDStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        HDDStore.removeChangeListener(this.onChange);
    }

    onChange() {
        this.setState({data: HDDStore.hdds});
    }

    render() {
        let rows = [];
        for(let disk of this.state.data) {
            let percent = div({className: 'progress'},
                div({className: 'value', style: {width: disk.percent + '%'}}, ' ')
            );
            rows = rows.concat([tr(
                td({className: 'label', rowSpan: 2}, disk.label),
                td({className: 'device'}, disk.device),
                td({className: 'free'}, numeral(disk.free).format('0.0 b')),
                td({className: 'total'}, numeral(disk.total).format('0.0 b'))
            ),tr(
                td({className: 'percent', colSpan: '100%'}, percent)
            )]);
        }
        return table({className: 'hdd_stat'},
            thead(tr(th({colSpan: '100%'}, this.props.caption))),
            tbody(...rows)
        );
    }
}

export default ComponentAsFactory(HDDStat);
