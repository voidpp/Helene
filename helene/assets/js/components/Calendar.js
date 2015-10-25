
import React from 'react';
import moment from 'moment';
import CalendarWidget from 'react-date-picker';

import {ComponentAsFactory, bind} from '../tools';
import DayStore from '../stores/DayStore';

import specialDays from '../special_days.json';

export class Calendar extends React.Component {
	constructor(props) {
        super(props);
        this.state = DayStore.today;
        bind(this, this.onChangeDay);
    }

    onChangeDay() {
        this.setState(DayStore.today);
    }

    componentDidMount() {
        DayStore.addChangeListener(this.onChangeDay);
    }

    componentWillUnmount() {
        DayStore.removeChangeListener(this.onChangeDay);
    }

    _getSimpleDayType(date) {
        switch (parseInt(date.format('E'))) {
            case 6: return 'fd';
            case 7: return 'nwd';
            default: return 'wd';
        }
    }

    _getSpecialDayType(date) {
        let dateStr = date.format('YYYY-MM-DD')
        if (dateStr in specialDays)
            return specialDays[dateStr].type;
        for (let sDateStr in specialDays) {
            let entry = specialDays[sDateStr];
            if (!entry.repeat)
                continue;
            let sDate = moment(sDateStr);
            if (sDate.month() === date.month() && sDate.date() === date.date())
                return entry.type;
        }
        return null;
    }

    _getDayType(date) {
        let type = this._getSpecialDayType(date);
        return type === null ? this._getSimpleDayType(date) : type;
    }

    render() {
        return div({className: 'calendar'},
            div({className: 'title'}, moment().format('MMMM')),
            React.createElement(CalendarWidget, {
                weekStartDay: 1,
                hideFooter: true,
                hideHeader: true,
                onRenderDay: (props) => {
                    props.className += ' cal_' + this._getDayType(props.date);
                    return props;
                },
                weekDayNames: ['V', 'H', 'K', 'Sz', 'Cs', 'P', 'Sz'],
            })
        );
    }
}

export default ComponentAsFactory(Calendar);
