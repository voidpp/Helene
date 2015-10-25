
import React from 'react';
import SunCalc from 'suncalc';
import moment from 'moment';

import {ComponentAsFactory, bind} from '../tools';
import WeatherStore from '../stores/WeatherStore';

export class CurrentWeather extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onWeatherChange);
        this.state = {
            icon: '',
            svg: '',
            temp: 0,
        };
    }

    componentDidMount() {
        WeatherStore.addChangeListener(this.onWeatherChange);
    }

    componentWillUnmount() {
        WeatherStore.removeChangeListener(this.onWeatherChange);
    }

    onWeatherChange() {
        this.setState(WeatherStore.data.current);
    }

    render() {
        var times = SunCalc.getTimes(new Date(), 47.489137, 19.061272);
        return div({className: 'current_weather'},
            div({className: 'temp'}, this.state.temp + '°C'),
            div({className: 'visible'}, img({src: this.state.svg})),
            div({className: 'suntimes'},
                span({className: 'sunrise'}, moment(times.sunrise).format("HH:mm")),
                span({className: 'sunset'}, moment(times.sunset).format("HH:mm"))
            )
        );
    }
}

export default ComponentAsFactory(CurrentWeather);
