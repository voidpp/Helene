
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

import {ComponentAsFactory, bind} from '../tools';
import TemperatureStore from '../stores/TemperatureStore';

import {RoomTemperature} from './RoomTemperature';

export class RoomTemperatureLine extends RoomTemperature {
    render() {
        let cols = [];
        for (let id in this.state.rooms) {
            let room = this.state.rooms[id];
            cols.push(
                span({className: 'desc'}, room.desc),
                span({className: 'value'}, numeral(room.current).format('0.0')  + '°C')
            );
        }
        return div({className: 'room_temp'}, div(...cols));
    }
}

export default ComponentAsFactory(RoomTemperatureLine);
