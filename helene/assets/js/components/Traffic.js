
import React from 'react';
import numeral from 'numeral';

import {ComponentAsFactory} from '../tools'

class Traffic extends React.Component {
    constructor(props) {
        super(props);
    }

    _formatBytes(bytes) {
        return bytes ? numeral(bytes).format('0.0 b') : '0 B';
    }

    render() {
        return div({className: 'traffic'},
            div({className: 'down'},
                div(this._formatBytes(this.props.data.rx)),
                div(this._formatBytes(this.props.speed.rx) + '/s')
            ),
            div({className: 'up'},
                div(this._formatBytes(this.props.data.tx)),
                div(this._formatBytes(this.props.speed.tx) + '/s')
            )
        );
    }
}

Traffic.propTypes = {
    speed: React.PropTypes.shape({
        rx: React.PropTypes.number,
        tx: React.PropTypes.number,
    }),
    data: React.PropTypes.shape({
        rx: React.PropTypes.number,
        tx: React.PropTypes.number,
    }),
}

export default ComponentAsFactory(Traffic);
