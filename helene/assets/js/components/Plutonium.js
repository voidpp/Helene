
import React from 'react';
import moment from 'moment';

import {ComponentAsFactory, bind} from '../tools'
import PlutoniumStore from '../stores/PlutoniumStore';

class Plutonium extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feeds: PlutoniumStore.feeds,
        };
        bind(this, this.onChangePlutonium)
    }

    onChangePlutonium() {
        this.setState({
            feeds: PlutoniumStore.feeds,
        });
    }

    componentDidMount() {
        PlutoniumStore.addChangeListener(this.onChangePlutonium);
    }

    componentWillUnmount() {
        PlutoniumStore.removeChangeListener(this.onChangePlutonium);
    }

    render() {
        let rows = [];
        for (let feed of this.state.feeds) {
            let nu = moment(feed.last_update).add(feed.update_interval, 's');
            rows.push(tr(
                td(feed.name),
                td(moment(feed.last_update).format("HH:mm:ss")),
                td(moment.duration(moment().diff(nu)).humanize())
            ));
        }
        return table({className: 'plutonium'},
            thead(tr(
                th('Név'),
                th('Utolsó'),
                th('Következő')
            )),
            tbody(...rows)
        );
    }
}

export default ComponentAsFactory(Plutonium);
