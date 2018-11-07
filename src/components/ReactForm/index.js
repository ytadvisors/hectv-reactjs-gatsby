import React, { Component } from 'react';
import { Field, Form as ReduxForm } from 'redux-form';
import { Button } from 'react-bootstrap';
import { CardElement } from 'react-stripe-elements';
import { Link } from 'gatsby';
import Captcha from './Captcha';
import DefaultTextArea from './DefaultTextArea';
import DefaultInput from './DefaultInput';
import DefaultSelect from './DefaultSelect';
import DefaultDatePicker from './DefaultDatePicker';
import CheckBoxInput from './CheckBoxInput';
import DateTimeAdder from './DateTimeAdder';

import './styles.scss';

export default class ReactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      termsAgreed: undefined
    };
  }

  selectTerms = event => {
    this.setState({ termsAgreed: event.target.checked });
  };

  getFieldComponent = field => {
    const { displayLabel, displayErrors, change } = this.props;
    const {
      name,
      type,
      disabled,
      placeholder,
      autofocus,
      rows,
      labels,
      options
    } = field;
    switch (field.component) {
      case 'input':
        return (
          <Field
            name={name}
            autofocus={autofocus}
            component={DefaultInput}
            type={type}
            label={placeholder}
            disabled={disabled}
            displayLabel={displayLabel}
            displayErrors={displayErrors !== false}
          />
        );
      case 'textarea':
        return (
          <Field
            name={name}
            autofocus={autofocus}
            component={DefaultTextArea}
            type={type}
            label={placeholder}
            rows={rows}
            disabled={disabled}
            displayLabel={displayLabel}
            displayErrors={displayErrors !== false}
          />
        );
      case 'captcha':
        return (
          <Field
            name={name}
            component={Captcha}
            change={change}
            type={type}
            label={placeholder}
            disabled={disabled}
            displayErrors={displayErrors !== false}
          />
        );
      case 'checkbox':
        return (
          <div className="checkbox-container">
            <div className="title-header">
              <span>{placeholder}</span>
            </div>
            <Field
              name={name}
              type={type}
              component={CheckBoxInput}
              options={options}
              displayLabel={displayLabel}
              displayErrors={displayErrors !== false}
            />
          </div>
        );
      case 'select':
        return (
          <div>
            <Field
              name={name}
              component={DefaultSelect}
              label={placeholder}
              options={options}
              disabled={disabled}
              displayLabel={displayLabel}
              displayErrors={displayErrors !== false}
            >
              {options.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.text}
                </option>
              ))}
            </Field>
          </div>
        );
      case 'stripe-card':
        return (
          <div className="stripe-card">
            <label htmlFor={placeholder}>{placeholder}</label>
            <CardElement
              className={type}
              displayErrors={displayErrors !== false}
              style={{
                base: {
                  fontSize: '14px'
                }
              }}
            />
          </div>
        );
      case 'date-time-adder':
        return (
          <div className="date-time-adder">
            <Field
              name={name}
              component={DateTimeAdder}
              type={type}
              labels={labels}
              disabled={disabled}
              change={change}
              displayLabel={displayLabel}
              displayErrors={displayErrors !== false}
            />
          </div>
        );
      case 'date-picker':
        return (
          <div className="date-picker">
            <Field
              name={name}
              component={DefaultDatePicker}
              type={type}
              label={placeholder}
              disabled={disabled}
              change={change}
              displayLabel={displayLabel}
              displayErrors={displayErrors !== false}
            />
          </div>
        );
      default:
        return '';
    }
  };

  getFields = fields => {
    if (Array.isArray(fields)) {
      const numCols = 12 / fields.length;
      return fields.map(field => (
        <div className={`col-md-${numCols}`} key={field.name}>
          {this.getFieldComponent(field)}
        </div>
      ));
    }
    return <div className="col-md-12">{this.getFieldComponent(fields)}</div>;
  };

  render() {
    const {
      onSubmit,
      handleSubmit,
      submitting,
      title,
      fields,
      buttons: { next, prev, close },
      terms,
      prevModal,
      closeModal
    } = this.props;

    const { termsAgreed } = this.state;

    return (
      <ReduxForm onSubmit={handleSubmit(onSubmit)} className="react-form">
        {terms && !termsAgreed ? (
          <div className="row">
            <div className="col-md-12">
              <div className="errors">
                You must agree to the terms and conditions
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {title ? (
          <div className="row">
            <div className="col-md-12">
              <h3>{title}</h3>
            </div>
          </div>
        ) : (
          ''
        )}
        <div className="form-fields">
          {fields.map(field => (
            <div className="row" key={field.name}>
              {this.getFields(field)}
            </div>
          ))}
          <div className="row step-btn-row">
            {terms ? (
              <div className="col-xs-6 terms">
                <div>
                  <input
                    type="checkbox"
                    name="terms"
                    className="terms-and-conditions"
                    onChange={this.selectTerms}
                  />
                  <label htmlFor="Terms">
                    I agree to the{' '}
                    <Link to="/terms-and-conditions"> Terms and Services </Link>
                  </label>
                </div>
              </div>
            ) : (
              ''
            )}
            <div className={terms ? 'col-xs-6' : 'col-xs-12'}>
              {next ? (
                <Button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary pull-right next-btn"
                >
                  {next}
                </Button>
              ) : (
                <div />
              )}
              {close ? (
                <Button
                  className="btn btn-primary pull-right close-btn"
                  onClick={closeModal}
                >
                  {close}
                </Button>
              ) : (
                <div />
              )}
              {prev ? (
                <Button
                  className="btn btn-secondary pull-right prev-btn"
                  onClick={prevModal}
                >
                  {prev}
                </Button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </ReduxForm>
    );
  }
}
