
import React from 'react';

import {ComponentAsFactory, bind} from '../tools'
import TrafficStore from '../stores/TrafficStore';
import Traffic from './Traffic';

class Network extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            speed: TrafficStore.speed,
            today: TrafficStore.today,
        };
        bind(this, this.onChangeTraffic)
    }

    onChangeTraffic() {
        this.setState({
            speed: TrafficStore.speed,
            today: TrafficStore.today,
        });
    }

    componentDidMount() {
        TrafficStore.addChangeListener(this.onChangeTraffic);
    }

    componentWillUnmount() {
        TrafficStore.removeChangeListener(this.onChangeTraffic);
    }

    render() {
        return div({className: 'router'},
            Traffic({
                speed: this.state.speed,
                data: this.state.today,
            })
        );
    }
}

export default ComponentAsFactory(Network);
