
import React from 'react';
import Highcharts from 'react-highcharts';
import equal from 'deep-equal';

import {ComponentAsFactory, bind} from '../tools';
import WeatherStore from '../stores/WeatherStore';
import Lang from '../lang';

export class LongForecast extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onWeatherChange);
        this.state = {
            forecast: [],
        };
    }

    componentDidMount() {
        WeatherStore.addChangeListener(this.onWeatherChange);
    }

    componentWillUnmount() {
        WeatherStore.removeChangeListener(this.onWeatherChange);
    }

    onWeatherChange() {
        // Well, the React call the render in setState unconditionally and the highcharts will draw in canvas,
        // so the chart will blinking even if the data was not changed without this if statement.
        if (!equal(this.state.forecast, WeatherStore.data.forecast_long))
            this.setState({forecast: WeatherStore.data.forecast_long});
    }

    render() {
        let headerHeight = 110;
        let raw_rows = [[], [], []];

        let temps = {
            max: [],
            min: [],
        };

        for (let day of this.state.forecast) {
            raw_rows[0].push(td({className: 'day_num'}, day.day.num));
            raw_rows[1].push(td({className: 'day_text'}, Lang.t(day.day.text)));
            raw_rows[2].push(td({className: 'image'}, img({src: day.icon})));
            temps.max.push(day.temp.max);
            temps.min.push(day.temp.min);
        }

        let rows = [];

        for (let row of raw_rows) {
            rows.push(tr(...row));
        }

        let hcConfig = {
            credits: {
                enabled: false,
            },
            chart: {
                type: 'spline',
                backgroundColor: 'rgba(0,0,0,0)',
                width: this.props.width,
                height: this.props.height - headerHeight,
                marginLeft: -5,
                marginRight: -5,
                marginBottom: -10,
            },
            title: {
                text: '',
                style: { display: 'none' }
            },
            subtitle: {
                text: '',
                style: { display: 'none' }
            },
            xAxis: {
                categories: Array(temps.max.length),
                lineWidth: 0,
                tickWidth: 0,
                title: { enabled: false },
                labels: { enabled: false }
            },
            yAxis: {
                title: { enabled: false },
                labels: { enabled: false },
                gridLineWidth: 0,
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    showInLegend: false,
                    lineWidth: 4,
                    marker: {
                        radius: 5,
                        symbol: 'circle'
                    },
                    dataLabels: {
                        align: 'center',
                        enabled: true,
                        style: {
                            fontSize: "17px",
                            color: '#ffffff',
                            fontFamily: 'Futura',
                        }
                    }
                }
            },
            series: [{
                color: '#AA0000',
                data: temps.max
            },{
                color: '#0000AA',
                data: temps.min,
            }]
        };

        return div({style: {width: this.props.width, height: this.props.height}},
            table({className: 'long_forecast', style: {width: this.props.width, height: headerHeight}}, tbody(...rows)),
            div({className: 'long_chart'}, React.createElement(Highcharts, {config: hcConfig}))
        )
    }
}

LongForecast.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
}

export default ComponentAsFactory(LongForecast);
