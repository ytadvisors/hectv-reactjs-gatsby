import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import './styles.scss';

export default class DefaultDatePicker extends Component {
  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.state = {
      start_date: undefined
    };
  }

  handleDateChange(date) {
    const { input: { name }, change } = this.props;
    this.setState({
      start_date: date
    });

    change(name, date.format('MM/DD/YYYY'));
  }

  render() {
    const {
      label,
      display_label,
      display_errors,
      meta: { touched, error }
    } = this.props;
    return (
      <div className="date-picker">
        <DatePicker
          dateFormat="MM/DD/YYYY"
          name={label}
          selected={this.state.start_date}
          onChange={this.handleDateChange}
          placeholderText={label}
        />
        {display_errors && (
          <div
            className="errors"
            dangerouslySetInnerHTML={{
              __html: touched && error ? error : '&nbsp;'
            }}
          />
        )}
      </div>
    );
  }
}
