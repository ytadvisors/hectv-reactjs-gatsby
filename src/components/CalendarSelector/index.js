import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './modules.scss';

export default class CalendarSelector extends Component {
  constructor (props) {
    super(props);
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    const {callback} = this.props;
    this.setState({
      startDate: date
    });

    callback(date);
  }

  render() {
    return <DatePicker
      selected={this.state.startDate}
      dateFormat="MMMM DD"
      onChange={this.handleChange}
    />;
  }
}

CalendarSelector.propTypes = {
  callback: PropTypes.func.isRequired
};
