import React, { Component } from 'react';
import './styles.scss';

export default class DefaultInput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      input,
      label,
      type,
      disabled,
      display_label,
      display_errors,
      autofocus,
      meta: { asyncValidating, touched, error }
    } = this.props;
    return (
      <div className="default-input">
        {display_label ? <div className="label">{label}</div> : ''}
        <input
          {...input}
          placeholder={label}
          type={type}
          disabled={!!disabled}
          autoFocus={autofocus}
        />
        {display_errors && (
          <div>
            {error && touched ? (
              <div className="errors">{error}</div>
            ) : (
              <div className="no-errors">&nbsp;</div>
            )}
          </div>
        )}
      </div>
    );
  }
}
