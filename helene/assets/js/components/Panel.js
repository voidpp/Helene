
import React from 'react';

import {ComponentAsFactory, normalizeArray} from '../tools';

export class Panel extends React.Component {
	constructor(props) {
        super(props);
    }

    render() {
        let className = 'panel';
        if ('className' in this.props)
            className += ' ' + this.props.className;
		return React.createElement(this.props.container, {className: className}, ...normalizeArray(this.props.children));
    }
}

Panel.propTypes = {
    container: React.PropTypes.string,
}

Panel.defaultProps = {
    container: 'div',
}

export default ComponentAsFactory(Panel)
