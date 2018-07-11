import React, { Component } from 'react';
import _ from 'lodash';
import './styles.scss';

export default class CheckBoxInput extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event, itemValue) {
    const { input } = this.props;

    let oldValues = input.value || [];
    let newValues = _.without(oldValues, itemValue); // remove value

    if (event.target.checked) {
      // was checked
      newValues = oldValues.concat(itemValue);
    }
    console.log(newValues);
    input.onChange(newValues);
  }

  render() {
    const {
      input,
      display_errors,
      meta: { touched, error },
      options
    } = this.props;
    return (
      <div className="checkbox-input">
        {options.map((option, i) => (
          <div className="form-checkbox" key={`checkbox-${option.text}`}>
            <div>
              <input
                type="checkbox"
                checked={input.value.indexOf(option.value) >= 0}
                onChange={e => this.onChange(e, option.value)}
              />
              <label htmlFor={option.text}>{option.text}</label>
            </div>
          </div>
        ))}
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
