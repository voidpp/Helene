
import React from 'react';
import moment from 'moment';

import {ComponentAsFactory, bind} from '../tools'
import DayStore from '../stores/DayStore';

class CurrentDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = DayStore.today;
        bind(this, this.onChangeDay)
    }

    onChangeDay() {
        this.setState(DayStore.today);
    }

    componentDidMount() {
        DayStore.addChangeListener(this.onChangeDay);
    }

    componentWillUnmount() {
        DayStore.removeChangeListener(this.onChangeDay);
    }

    render() {
        return div({className: 'date'}, moment(this.state).format("YYYY. MMMM D. dddd"));
    }
}

export default ComponentAsFactory(CurrentDate);
