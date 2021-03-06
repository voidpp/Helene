
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

import {ComponentAsFactory, bind} from '../tools'
import DataRequestStore from '../stores/DataRequestStore';
import Lang from '../lang';

class DataStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptors: DataRequestStore.descriptors
        };
        bind(this, this.onChangeData);
    }

    onChangeData() {
        this.setState({descriptors: DataRequestStore.descriptors});
    }

    componentDidMount() {
        DataRequestStore.addChangeListener(this.onChangeData);
    }

    componentWillUnmount() {
        DataRequestStore.removeChangeListener(this.onChangeData);
    }

    render() {
        let rows = [];
        for (let desc of this.state.descriptors) {
            rows.push(tr(
                td(desc.title),
                td(moment(desc.last_fetch).format('HH:mm:ss')),
                td(numeral(desc.untill_next_fetch).format('00:00:00'))
            ));
        }
        return div({className: 'data_status'},
            table(
                thead(tr(
                    th(),
                    th(Lang.t('Last')),
                    th(Lang.t('Next'))
                )),
                tbody(...rows)
            )
        );
    }
}

export default ComponentAsFactory(DataStatus);
