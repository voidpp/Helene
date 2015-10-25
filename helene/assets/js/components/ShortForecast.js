
import React from 'react';

import {ComponentAsFactory, bind} from '../tools';
import WeatherStore from '../stores/WeatherStore';

export class ShortForecast extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onWeatherChange);
        this.state = {
            forecast: []
        };
    }

    componentDidMount() {
        WeatherStore.addChangeListener(this.onWeatherChange);
    }

    componentWillUnmount() {
        WeatherStore.removeChangeListener(this.onWeatherChange);
    }

    onWeatherChange() {
        this.setState({forecast: WeatherStore.data.forecast.slice(0,2)});
    }

    render() {
        let rows = [];
        for (let part of this.state.forecast) {
            rows.push(
                tr(
                    td({colSpan: 2, className: 'time'}, part.time)
                ),
                tr(
                    td({className: 'temp'}, part.temp + '°C'),
                    td({className: 'image'}, img({src: part.svg}))
                )
            )
        }

        return table({className: 'short_forecast'}, ...rows);
    }
}

export default ComponentAsFactory(ShortForecast);
