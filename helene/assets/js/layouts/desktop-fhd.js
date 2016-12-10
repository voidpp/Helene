
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
import Launches from '../components/Launches';

import RectLayout from '../RectLayout';

let layout = {
    width: 1920,
    height: 1080,
    margin: 10,
    firstLineHeight: 250,
    secondLineHeight: 310,
    secondLineHeight2: 240,
}

layout.secondLine = layout.margin * 2 + layout.firstLineHeight;

layout.episodeTracking = new RectLayout(
    layout.margin,
    layout.margin,
    270,
    layout.height - layout.margin * 2
);

layout.currentWeather = new RectLayout(
    layout.margin,
    layout.episodeTracking.right + layout.margin,
    190,
    layout.firstLineHeight
);

layout.shortForecast = new RectLayout(
    layout.margin,
    layout.currentWeather.right + layout.margin,
    190,
    layout.firstLineHeight
);

layout.hdd = new RectLayout(
    layout.margin,
    layout.width - 330 - layout.margin,
    330,
    layout.firstLineHeight
);

layout.calendar = new RectLayout(
    layout.margin,
    layout.hdd.left - 230 - layout.margin,
    230,
    layout.firstLineHeight
);

layout.today = new RectLayout(
    layout.margin,
    layout.shortForecast.right + layout.margin,
    layout.calendar.left - layout.margin * 2 - layout.shortForecast.right,
    layout.firstLineHeight
);

layout.longForecast = new RectLayout(
    layout.secondLine,
    layout.episodeTracking.right + layout.margin,
    400,
    layout.secondLineHeight
)

layout.server = new RectLayout(
    layout.secondLine,
    layout.longForecast.right + layout.margin,
    600,
    layout.secondLineHeight
);

layout.roomTemperature = new RectLayout(
    layout.longForecast.bottom + layout.margin,
    layout.episodeTracking.right + layout.margin,
    layout.longForecast.width,
    130
);

layout.torrentList = new RectLayout(
    layout.secondLine,
    layout.server.right + layout.margin,
    layout.width - layout.server.right - layout.margin * 2,
    layout.secondLineHeight
);

layout.data_status = new RectLayout(
    layout.roomTemperature.bottom + layout.margin,
    layout.episodeTracking.right + layout.margin,
    layout.longForecast.width,
    layout.firstLineHeight
);

layout.network = new RectLayout(
    layout.data_status.bottom + layout.margin,
    layout.episodeTracking.right + layout.margin,
    layout.longForecast.width,
    layout.height - layout.data_status.bottom - layout.margin * 2
);

layout.launches = new RectLayout(
    layout.server.bottom + layout.margin,
    layout.longForecast.right + layout.margin,
    600,
    layout.height - layout.server.bottom - layout.margin * 2
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
    div({className: 'panel', style: layout.hdd.style}, HDDStat({caption: config.hdd_stat.caption})),
    div({className: 'panel launches_panel', style: layout.launches.style}, Launches())
)

console.debug('Config:', config);

React.render(body, document.body);

let m = 1;

let plutonium_url = `http://${config.plutonium.host}:${config.plutonium.port}/api/feeds/list`;
let launches_url = 'https://launchlibrary.net/1.2/launch/next/10';

DataRequestActionCreator.start(
    new ServiceDescriptor(DataActionTypes.WEATHER_FETCHED, 'weather', m * 5*60, 'Időjárás'),
    new ServiceDescriptor(DataActionTypes.SERVER_INFO_FETCHED, 'servers', m * 60, 'Szerverek'),
    new ServiceDescriptor(DataActionTypes.ROOM_TEMP_FETCHED, 'temperature', m * 10*60, 'Szoba hőmérséklet'),
    new ServiceDescriptor(DataActionTypes.TORRENT_LIST_FETCHED, 'torrent', m * 5, 'Torrent'),
    new ServiceDescriptor(DataActionTypes.EPISODE_TRACKING_FETCHED, 'episode_tracking', m * 60 * 10, 'Követő'),
    new DataRequestDescriptor(DataActionTypes.TRAFFIC_TODAY_FETCHED, config.traffic_server + '/today', m * 60*60, 'Hálózat napi adat'),
    new DataRequestDescriptor(DataActionTypes.TRAFFIC_SPEED_FETCHED, config.traffic_server + '/speed', m * 10, 'Hálózati forgalom'),
    new DataRequestDescriptor(DataActionTypes.HDD_STAT_FETCHED, config.hdd_stat.server, m * 30 * 60, 'NAS háttértárai'),
    new DataRequestDescriptor(DataActionTypes.PLUTONIUM_FEEDS_FETCHED, plutonium_url, m * 60, 'Plutonium'),
    new DataRequestDescriptor(DataActionTypes.LAUNCHES_FETCHED, launches_url, m * 60 * 60, 'Rakéta kilövések')
);
