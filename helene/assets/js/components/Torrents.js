
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

import {ComponentAsFactory, bind} from '../tools';
import TorrentList from './TorrentList';
import TorrentStore from '../stores/TorrentStore';

export class Torrents extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onTorrentChange);
        this.state = {
            downloading: {},
            status: {}
        };
    }

    componentDidMount() {
        TorrentStore.addChangeListener(this.onTorrentChange);
    }

    componentWillUnmount() {
        TorrentStore.removeChangeListener(this.onTorrentChange);
    }

    onTorrentChange() {
        this.setState(TorrentStore.data);
    }

    render() {
        return TorrentList({list: this.state.downloading});
    }
}

export default ComponentAsFactory(Torrents);
