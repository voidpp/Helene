
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

import {ComponentAsFactory, bind} from '../tools';
import TorrentStore from '../stores/TorrentStore';

export class TorrentList extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onTorrentChange);
        this.state = {
            list: {}
        };
    }

    componentDidMount() {
        TorrentStore.addChangeListener(this.onTorrentChange);
    }

    componentWillUnmount() {
        TorrentStore.removeChangeListener(this.onTorrentChange);
    }

    onTorrentChange() {
        this.setState({list: TorrentStore.data.downloading});
    }

    render() {
        let rows = [];
        for (let hash in this.state.list) {
            let torrent = this.state.list[hash];
            let percent = torrent.percentDone * 100;
            rows.push(tr(
                td({className: 'name'}, torrent.name),
                td(numeral(torrent.size).format('0.0 b')),
                td(div({className: 'progress'}, div({className: 'value', style: {width: `${percent}%`}}))),
                td(numeral(torrent.download_speed).format('0.0 b') + '/s'),
                td({className: 'eta'}, torrent.eta ? moment.duration(torrent.eta, 'seconds').humanize() : '')
            ));
        }
        return rows.length ? table({className: 'torrent_list'}, tbody(...rows)) : div({className: 'empty'}, 'Nincs aktív letöltés');
    }
}

export default ComponentAsFactory(TorrentList);
