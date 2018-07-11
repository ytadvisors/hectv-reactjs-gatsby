import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import VERTICAL_ORIENTATION from 'react-dates/constants';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './styles.scss';

export default class CalendarSelector extends Component {
  constructor(props, context) {
    super(props, context);
    this.changeDefaultDate = this.changeDefaultDate.bind(this);
    this.state = {
      date: moment()
    };
  }

  componentDidMount() {
    this.smallDevice = window.matchMedia('(max-width: 400px)').matches;
  }

  changeDefaultDate(date) {
    this.setState({ date: date });
  }

  componentDidUpdate(prevProps, prevState) {
    const { callback } = this.props;
    if (prevState.date !== this.state.date && prevState.date !== '') {
      if (this.state.date) callback(this.state.date.format('MM/DD/YYYY'));
      else callback(moment().format('MM/DD/YYYY'));
    }
  }

  render() {
    return (
      <div className="calendar-selector">
        <SingleDatePicker
          date={this.state.date} // momentPropTypes.momentObj or null
          onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
          focused={this.state.focused} // PropTypes.bool
          isOutsideRange={() => false}
          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
          withFullScreenPortal={this.smallDevice}
          orientation={VERTICAL_ORIENTATION}
          displayFormat="MMM DD"
        />
      </div>
    );
  }
}

CalendarSelector.propTypes = {
  callback: PropTypes.func.isRequired
};
