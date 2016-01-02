
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

import {ComponentAsFactory, bind} from '../tools';
import TorrentStore from '../stores/TorrentStore';
import Traffic from './Traffic';
import Lang from '../lang';

export class TorrentStatus extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onTorrentChange);
        this.state = TorrentStore.data.status;
    }

    componentDidMount() {
        TorrentStore.addChangeListener(this.onTorrentChange);
    }

    componentWillUnmount() {
        TorrentStore.removeChangeListener(this.onTorrentChange);
    }

    onTorrentChange() {
        this.setState(TorrentStore.data.status);
    }

    render() {
        return div({className: 'torrent_status'},
            div(Lang.t('Free') + ': ' + numeral(this.state.free_space).format('0.0 b') + ', '
                + Lang.t('Active') + ': ' + moment.duration(this.state.active_time, 'seconds').humanize()),
            Traffic(this.state)
        );
    }
}

export default ComponentAsFactory(TorrentStatus);
