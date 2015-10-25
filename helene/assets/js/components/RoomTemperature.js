
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

import {ComponentAsFactory, bind} from '../tools';
import TemperatureStore from '../stores/TemperatureStore';

export class RoomTemperature extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onTempChange);
        this.state = {
            rooms: {},
            timestamp: null,
        };
    }

    componentDidMount() {
        TemperatureStore.addChangeListener(this.onTempChange);
    }

    componentWillUnmount() {
        TemperatureStore.removeChangeListener(this.onTempChange);
    }

    onTempChange() {
        this.setState({
            rooms: TemperatureStore.data.data,
            timestamp: TemperatureStore.data.time,
        });
    }

    render() {
        let rows = [];
        for (let id in this.state.rooms) {
            let room = this.state.rooms[id];
            rows.push(tr(
                td(room.desc),
                td({className: 'current'}, numeral(room.current).format('0.0')  + '°C'),
                td(numeral(room.short_diff).format('0.0')  + '°C'),
                td(numeral(room.min).format('0.0')  + '°C'),
                td(numeral(room.max).format('0.0')  + '°C')
            ))
        }

        return div({className: 'room_temp'},
            table(
                thead(tr(
                    th(moment(this.state.timestamp).format('HH:mm:ss')),
                    th('Most'),
                    th('1h diff'),
                    th('24h min'),
                    th('24h max')
                )),
                tbody(...rows)
            )
        );
    }
}

export default ComponentAsFactory(RoomTemperature);
