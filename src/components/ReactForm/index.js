import React, { Component } from 'react';
import { Field, Form as ReduxForm } from 'redux-form';
import { Button } from 'react-bootstrap';
import { CardElement } from 'react-stripe-elements';
import Captcha from './Captcha';
import DefaultTextArea from './DefaultTextArea';
import DefaultInput from './DefaultInput';
import DefaultSelect from './DefaultSelect';
import DefaultDatePicker from './DefaultDatePicker';
import CheckBoxInput from './CheckBoxInput';
import DateTimeAdder from './DateTimeAdder';
import { Link } from 'react-router-dom';

import './modules.scss';

export default class ReactForm extends Component {
  constructor(props) {
    super(props);
    this.getFieldComponent = this.getFieldComponent.bind(this);
    this.getFields = this.getFields.bind(this);
    this.selectTerms = this.selectTerms.bind(this);
    this.state = {
      terms_agreed: undefined
    };
  }

  selectTerms(event) {
    this.setState({ terms_agreed: event.target.checked });
  }

  getFieldComponent(field) {
    const { display_label, display_errors } = this.props;
    switch (field.component) {
      case 'input':
        return (
          <Field
            name={field.name}
            autofocus={field.autofocus}
            component={DefaultInput}
            type={field.type}
            label={field.placeholder}
            disabled={field.disabled}
            display_label={display_label}
            display_errors={display_errors !== false}
          />
        );
      case 'textarea':
        return (
          <Field
            name={field.name}
            autofocus={field.autofocus}
            component={DefaultTextArea}
            type={field.type}
            label={field.placeholder}
            rows={field.rows}
            disabled={field.disabled}
            display_label={display_label}
            display_errors={display_errors !== false}
          />
        );
      case 'captcha':
        return (
          <Field
            name={field.name}
            component={Captcha}
            change={this.props.change}
            type={field.type}
            label={field.placeholder}
            disabled={field.disabled}
            display_errors={display_errors !== false}
          />
        );
        break;
      case 'checkbox':
        return (
          <div className="checkbox-container">
            <div className="title-header">
              <span>{field.placeholder}</span>
            </div>
            <Field
              name={field.name}
              type={field.type}
              component={CheckBoxInput}
              options={field.options}
              display_label={display_label}
              display_errors={display_errors !== false}
            />
          </div>
        );
      case 'select':
        return (
          <div>
            <Field
              name={field.name}
              component={DefaultSelect}
              label={field.placeholder}
              options={field.options}
              disabled={field.disabled}
              display_label={display_label}
              display_errors={display_errors !== false}
            >
              {field.options.map((option, i) => (
                <option
                  key={`field-options-${i}`}
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
            <label>{field.placeholder}</label>
            <CardElement
              className={field.type}
              display_errors={display_errors !== false}
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
              name={field.name}
              component={DateTimeAdder}
              type={field.type}
              labels={field.labels}
              disabled={field.disabled}
              change={this.props.change}
              display_label={display_label}
              display_errors={display_errors !== false}
            />
          </div>
        );
      case 'date-picker':
        return (
          <div className="date-picker">
            <Field
              name={field.name}
              component={DefaultDatePicker}
              type={field.type}
              label={field.placeholder}
              disabled={field.disabled}
              change={this.props.change}
              display_label={display_label}
              display_errors={display_errors !== false}
            />
          </div>
        );
    }
  }

  getFields(field) {
    if (Array.isArray(field)) {
      const num_cols = 12 / field.length;
      return field.map((field_entry, i) => (
        <div className={`col-md-${num_cols}`} key={`field-map-${i}`}>
          {this.getFieldComponent(field_entry)}
        </div>
      ));
    } else {
      return <div className="col-md-12">{this.getFieldComponent(field)}</div>;
    }
  }

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

    return (
      <ReduxForm onSubmit={handleSubmit(onSubmit)} className="react-form">
        {terms && !this.state.terms_agreed ? (
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
          {fields.map((field, i) => (
            <div className="row" key={`prop-field-${i}`}>
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
                  <label>
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
