import React, { Component } from 'react';
import './modules.scss';

export default class DefaultTextArea extends Component {
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
      rows,
      meta: { asyncValidating, touched, error }
    } = this.props;
    return (
      <div className="default-text-area">
        <div className={asyncValidating ? 'async-validating' : ''}>
          {display_label ? <div className="label">{label}</div> : ''}
          <textarea
            {...input}
            placeholder={label}
            type={type}
            rows={rows}
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
      </div>
    );
  }
}
