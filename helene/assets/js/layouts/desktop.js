
import React from 'react';
import 'babelify/polyfill';
import moment from 'moment';
import 'moment/locale/hu';
import 'moment/locale/en-gb';
moment.locale(config.language);

import '../html';
import DataActionTypes from '../constants/DataConstants';
import DataRequestActionCreator, {DataRequestDescriptor, ServiceDescriptor} from '../actions/DataRequestActionCreator';

import Lang from '../lang';
// Only static import allowed with browserify...
import lang_hu from '../langs/hu.json';
import lang_en_gb from '../langs/en-gb.json';
Lang.setData('hu', lang_hu);
Lang.setData('en-gb', lang_en_gb);
Lang.lang = config.language;

import Panel from '../components/Panel';
import CurrentWeather from '../components/CurrentWeather';
import Clock from '../components/Clock';
import CurrentDate from '../components/CurrentDate';
import ShortForecast from '../components/ShortForecast';
import LongForecast from '../components/LongForecast';
import ServerInfo from '../components/ServerInfo';
import RoomTemperature from '../components/RoomTemperature';
import TorrentStatus from '../components/TorrentStatus';
import TorrentList from '../components/TorrentList';
import Calendar from '../components/Calendar';
import Network from '../components/Network';
import Plutonium from '../components/Plutonium';
import DataStatus from '../components/DataStatus';
import EpisodeTracking from '../components/EpisodeTracking';
import HDDStat from '../components/HDDStat';

import RectLayout from '../RectLayout';

let layout = {
    width: 1280,
    height: 1024,
    margin: 10,
    firstLineHeight: 250,
    secondLineHeight: 310,
    secondLineHeight2: 240,
}
layout.secondLine = layout.margin * 2 + layout.firstLineHeight;
layout.currentWeather = new RectLayout(layout.margin, layout.margin, 190, layout.firstLineHeight);
layout.shortForecast = new RectLayout(layout.margin, null, 190, layout.firstLineHeight);
layout.today = new RectLayout(
    layout.margin,
    layout.margin * 2 + layout.currentWeather.width,
    layout.width - layout.margin * 4 - layout.currentWeather.width - layout.shortForecast.width,
    layout.firstLineHeight
);
layout.shortForecast.left = layout.today.right + layout.margin;
layout.longForecast = new RectLayout(layout.secondLine, layout.margin, 400, layout.secondLineHeight)
layout.episodeTracking = new RectLayout(
    layout.secondLine,
    layout.longForecast.right  + layout.margin,
    270,
    layout.height - layout.firstLineHeight - layout.margin * 3
);
layout.server = new RectLayout(
    layout.secondLine,
    layout.episodeTracking.right + layout.margin,
    layout.width - layout.episodeTracking.right - 2 * layout.margin,
    layout.secondLineHeight2
);
layout.roomTemperature = new RectLayout(
    layout.longForecast.bottom + layout.margin,
    layout.margin,
    layout.longForecast.width,
    130
);
layout.calendar = new RectLayout(
    layout.server.bottom + layout.margin,
    layout.episodeTracking.right + layout.margin,
    230,
    250
);
layout.hdd = new RectLayout(
    layout.server.bottom + layout.margin,
    layout.calendar.right + layout.margin,
    layout.width - layout.calendar.right - layout.margin * 2,
    layout.calendar.height
);
layout.torrentList = new RectLayout(
    layout.calendar.bottom + layout.margin,
    layout.episodeTracking.right + layout.margin,
    layout.width - layout.episodeTracking.right - layout.margin * 2,
    layout.height - layout.calendar.bottom - layout.margin * 2
);
layout.data_status = new RectLayout(
    layout.roomTemperature.bottom + layout.margin,
    layout.margin,
    layout.longForecast.width,
    200
);
layout.network = new RectLayout(
    layout.data_status.bottom + layout.margin,
    layout.margin,
    layout.longForecast.width,
    layout.height - layout.data_status.bottom - layout.margin * 2
);

let body = div({className: 'body', style: {width: layout.width, height: layout.height}},
    div({className: 'panel', style: layout.currentWeather.style}, CurrentWeather()),
    div({className: 'panel', style: layout.today.style}, div(Clock(), CurrentDate())),
    div({className: 'panel', style: layout.shortForecast.style}, ShortForecast()),
    div({className: 'panel', style: layout.longForecast.style}, LongForecast(layout.longForecast)),
    div({className: 'panel server', style: layout.server.style}, ServerInfo()),
    div({className: 'panel', style: layout.roomTemperature.style}, RoomTemperature()),
    div({className: 'panel', style: layout.data_status.style}, DataStatus()),
    div({className: 'panel transmission', style: layout.torrentList.style}, Plutonium(), TorrentStatus(), TorrentList()),
    div({className: 'panel episode_tracking', style: layout.episodeTracking.style}, EpisodeTracking()),
    div({className: 'panel network', style: layout.network.style}, Network()),
    div({className: 'panel', style: layout.calendar.style}, Calendar()),
    div({className: 'panel', style: layout.hdd.style}, HDDStat({caption: config.hdd_stat.caption}))
)

console.debug('Config:', config);

React.render(body, document.body);

let m = 1;

let plutonium_url = `http://${config.plutonium.host}:${config.plutonium.port}/api/feeds/list`;

DataRequestActionCreator.start(
    new ServiceDescriptor(DataActionTypes.WEATHER_FETCHED, 'weather', m * 5*60, 'Időjárás'),
    new ServiceDescriptor(DataActionTypes.SERVER_INFO_FETCHED, 'servers', m * 60, 'Szerverek'),
    new ServiceDescriptor(DataActionTypes.ROOM_TEMP_FETCHED, 'temperature', m * 10*60, 'Szoba hőmérséklet'),
    new ServiceDescriptor(DataActionTypes.TORRENT_LIST_FETCHED, 'torrent', m * 5, 'Torrent'),
    new ServiceDescriptor(DataActionTypes.EPISODE_TRACKING_FETCHED, 'episode_tracking', m * 60 * 10, 'Követő'),
    new DataRequestDescriptor(DataActionTypes.TRAFFIC_TODAY_FETCHED, config.traffic_server + '/today', m * 60*60, 'Hálózat napi adat'),
    new DataRequestDescriptor(DataActionTypes.TRAFFIC_SPEED_FETCHED, config.traffic_server + '/speed', m * 10, 'Hálózati forgalom'),
    new DataRequestDescriptor(DataActionTypes.HDD_STAT_FETCHED, config.hdd_stat.server, m * 30 * 60, 'NAS háttértárai'),
    new DataRequestDescriptor(DataActionTypes.PLUTONIUM_FEEDS_FETCHED, plutonium_url, m * 60, 'Plutonium')
);
