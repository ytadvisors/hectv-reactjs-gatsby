import React, { Component } from 'react';
import DefaultDatePicker from './../DefaultDatePicker';
import DefaultInput from './../DefaultInput';
import { Field, Form as ReduxForm } from 'redux-form';
import { Button } from 'react-bootstrap';
import * as FontAwesome from 'react-icons/lib/fa';
import _ from 'lodash';
import './styles.scss';

export default class DateTimeAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num_rows: 1
    };
    this.addField = this.addField.bind(this);
  }

  addField() {
    const { num_rows } = this.state;
    if (num_rows < 5) {
      this.setState({ num_rows: num_rows + 1 });
    }
  }

  render() {
    const {
      labels: { date_label, time_label, label },
      display_label,
      display_errors,
      change
    } = this.props;

    return (
      <div className="date-time-adder">
        <label>{label}</label>
        <div className="date-time-list">
          {display_label ? <div className="label">{label}</div> : ''}

          {_.range(this.state.num_rows).map(key => (
            <div key={`picker-${key}`} className={`row row-num-${key}`}>
              <div className="col-md-5 no-padding">
                <div className="date-picker">
                  <Field
                    name={`date_${key + 1}`}
                    component={DefaultDatePicker}
                    type="text"
                    label={date_label}
                    change={change}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <Field
                  name={`time_${key + 1}`}
                  component={DefaultInput}
                  type="text"
                  label={time_label}
                />
              </div>
              <div className="col-md-2 no-padding">
                {key === this.state.num_rows - 1 ? (
                  <Button onClick={this.addField} className="add-btn">
                    <span> ADD </span>
                    <FontAwesome.FaPlusCircle size="20" color="green" />
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
