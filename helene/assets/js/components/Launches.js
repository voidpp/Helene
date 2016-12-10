
import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

import {ComponentAsFactory, bind} from '../tools';
import LaunchesStore from '../stores/LaunchesStore';
import Lang from '../lang';

export class Launches extends React.Component {
	constructor(props) {
        super(props);
        bind(this, this.onChange);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        LaunchesStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        LaunchesStore.removeChangeListener(this.onChange);
    }

    onChange() {
        this.setState({data: LaunchesStore.launches});
    }

    render() {
        let rows = [div({className: 'title'}, Lang.t('Upcoming Launches'))];
        let now = moment();
        for (let launch of this.state.data) {
            let time = moment(launch.net);
            let location = launch.location.name + ' (' + launch.location.countryCode + ') - ' + launch.missions.map(m => m.name).join(', ');
            let countdown = span({className: 'countdown'}, 'T-' + numeral(time.diff(now)/1000).format('00:00:00'));
            let video = img({src: '/static/pic/video-32.png', className: 'video' + (launch.vidURLs.length ? '' : ' off')})
            rows.push(div({className: 'row'},
                table({className: 'location'},
                    tr(
                        td({rowSpan: 2, className: 'iso'}, time.format('YYYY-MM-DD')),
                        td({className: 'indaytime'}, time.format('HH:mm'), video),
                        td(countdown)
                    ),
                    tr(td({colSpan: 2}, location))
                ),
                div(launch.rocket.name + ' - ' + launch.rocket.agencies.map(a => (a.name + ' (' + a.countryCode + ')')).join(', '),
                    {className: 'rocket'}
                )
            ));
        }
        return div({className: 'launches'}, ...rows);
    }
}

export default ComponentAsFactory(Launches);
