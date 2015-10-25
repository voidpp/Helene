
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

import {ComponentAsFactory, bind} from '../tools'
import DataRequestStore from '../stores/DataRequestStore';

class DataStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptors: DataRequestStore.descriptors
        };
        bind(this, this.onChangeData);
        this.active = false;
        setTimeout(() => { this.active = true; }, 60 * 1000);
    }

    onChangeData() {
        if(this.active)
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
                    th('Utolsó'),
                    th('Következő')
                )),
                tbody(...rows)
            )
        );
    }
}

export default ComponentAsFactory(DataStatus);
