
import React from 'react';
import moment from 'moment';

import {ComponentAsFactory, bind} from '../tools';
import EpisodeTrackingStore, {epStatus} from '../stores/EpisodeTrackingStore';

function pad(num) {
    return num < 10 ? '0'+num : num;
}

export class EpisodeTracking extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onTrackingChange);
        this.state = {shows: []};
    }

    componentDidMount() {
        EpisodeTrackingStore.addChangeListener(this.onTrackingChange);
    }

    componentWillUnmount() {
        EpisodeTrackingStore.removeChangeListener(this.onTrackingChange);
    }

    onTrackingChange() {
        this.setState({shows: EpisodeTrackingStore.data});
    }

    render() {
        let rows = [];
        let now = new Date().getTime();
        for (let show of this.state.shows) {
            rows.push(tr(
                td({className: 'thumb', rowSpan: 2}, img({src: 'https://tvstore.me/pic/categs/' + show.pic})),
                td({className: 'ep'}, show.curr.season + 'x' + pad(show.curr.episode)),
                td({className: 'status'}, this._getStatus(show.curr, show))
            ), tr(
                td({className: 'ep'}, show.next.season + 'x' + pad(show.next.episode)),
                td({className: 'airtime'}, moment.duration(show.next.air_en.getTime() - now).humanize())
            ));
        }
        return table(tbody(...rows));
    }

    _getStatus(ep, show) {
        let downloadedStyle = ep.en == epStatus.DOWNLOADED || ep.en == epStatus.WATCHED ? 'active' : 'inactive';
        let subtitleStyle = ep.subtitles ? 'active' : 'inactive';
        let unwatched_cnt = show.available_cnt - show.watched_cnt;
        return div(
            span({className: downloadedStyle + ' glyphicon glyphicon-cloud-download'}),
            span({className: subtitleStyle + ' glyphicon glyphicon-subtitles'}),
            unwatched_cnt > 1 ?
                    span({className: 'inactive'}, unwatched_cnt) :
                    span({className: (unwatched_cnt ? 'inactive' : 'active') + ' glyphicon glyphicon-eye-open'})
        );
    }
}

export default ComponentAsFactory(EpisodeTracking);
