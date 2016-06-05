
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
import DHCP from '../components/DHCP';

let body = div({className: 'body'}, DHCP())

console.debug('Config:', config);

React.render(body, document.body);

let m = 1;

DataRequestActionCreator.start(
    new ServiceDescriptor(DataActionTypes.DCHP_FETCHED, 'dhcp', m * 1 * 60, 'DHCP')
);
