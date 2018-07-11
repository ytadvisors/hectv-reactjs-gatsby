import React, { Component } from 'react';
import _ from 'lodash';
import { CardElement } from 'react-stripe-elements';
import './styles.scss';

export default class DefaultSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      input,
      label,
      options,
      meta: { touched, error },
      children,
      display_errors,
      display_label
    } = this.props;

    let selected_option = _.find(options, { value: input.value });

    return (
      <div className="default-select">
        {display_label ? <div className="label">{label}</div> : ''}
        <select {...input}>{children}</select>
        {display_errors && (
          <div
            className="errors"
            dangerouslySetInnerHTML={{
              __html: touched && error ? error : '&nbsp;'
            }}
          />
        )}
        {selected_option && selected_option.info ? (
          <div className="info">{selected_option.info}</div>
        ) : (
          ''
        )}
        {selected_option &&
        selected_option.price &&
        selected_option.show_card &&
        selected_option.price !== '0' ? (
          <div className="stripe-card">
            <label>Card details</label>
            <CardElement
              className="stripe-card"
              style={{
                base: {
                  fontSize: '14px'
                }
              }}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
