
import React from 'react';
import moment from 'moment';

import {ComponentAsFactory} from '../tools'

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: this.getTimeString(),
        };
    }

    componentDidMount() {
        this.timerId = setInterval(() => {
            this.setState({time: this.getTimeString()});
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    getTimeString() {
        return moment().format("HH:mm");
    }

    render() {
        return div({className: 'clock'}, this.state.time);
    }
}

export default ComponentAsFactory(Clock);
