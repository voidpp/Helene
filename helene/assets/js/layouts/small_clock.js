
import React from 'react';
import 'babelify/polyfill';
import hu from 'moment/locale/hu';

import '../html';
import DataActionTypes from '../constants/DataConstants';
import DataRequestActionCreator, {DataRequestDescriptor, ServiceDescriptor} from '../actions/DataRequestActionCreator';

import Panel from '../components/Panel';
import CurrentWeather from '../components/CurrentWeather';
import Clock from '../components/Clock';
import CurrentDate from '../components/CurrentDate';
import RoomTemperatureLine from '../components/RoomTemperatureLine';

import RectLayout from '../RectLayout';

console.debug('Config:', config);

let layout = {
    width: 1067,
    height: 592,
    margin: 10,
}
layout.roomTemperature = new RectLayout(
    layout.margin,
    layout.margin,
    layout.width - layout.margin * 2,
    48
);
layout.currentWeather = new RectLayout(
    layout.roomTemperature.bottom + layout.margin,
    layout.margin,
    200,
    layout.height - layout.roomTemperature.bottom - layout.margin * 2
);
layout.today = new RectLayout(
    layout.roomTemperature.bottom + layout.margin,
    layout.currentWeather.right + layout.margin,
    layout.width - layout.currentWeather.right - layout.margin * 2,
    layout.height - layout.roomTemperature.bottom - layout.margin * 2
);

let body = div({className: 'body', style: {width: layout.width, height: layout.height}},
    div({className: 'panel', style: layout.currentWeather.style}, CurrentWeather()),
    div({className: 'panel', style: layout.today.style}, div(Clock(), CurrentDate())),
    div({className: 'panel', style: layout.roomTemperature.style}, RoomTemperatureLine())
)

React.render(body, document.body);

let m = 1;

DataRequestActionCreator.start(
    new ServiceDescriptor(DataActionTypes.WEATHER_FETCHED, 'weather', m * 5*60, ''),
    new ServiceDescriptor(DataActionTypes.ROOM_TEMP_FETCHED, 'temperature', m * 10*60, '')
);
