import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactForm from './../../../components/ReactForm';
import Validator from './../../../components/ReactForm/Validator';
import { reduxForm } from 'redux-form';
import './modules.scss';
import { SubmissionError } from 'redux-form';
import $ from 'jquery';

const fields = [
  {
    name: 'name',
    component: 'input',
    type: 'text',
    placeholder: 'Full Name*',
    validation: ['required']
  },
  {
    name: 'email',
    component: 'input',
    type: 'email',
    placeholder: 'Email*',
    validation: ['required', 'email']
  },
  {
    name: 'password',
    component: 'input',
    type: 'password',
    placeholder: 'Password*',
    validation: ['required']
  },
  [
    {
      name: 'captcha',
      component: 'captcha',
      type: 'text',
      validation: ['required']
    }
  ]
];

const validate = Validator(fields);

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { callbackFunc, terms } = this.props;
    const valid_submit =
      !terms || (terms && $('.terms-and-conditions').is(':checked'));

    if (!valid_submit) {
      throw new SubmissionError({
        terms: 'You must agree to the terms and conditions',
        _error: 'You must agree to the terms and conditions'
      });
    }

    callbackFunc.call(this);
  }
  render() {
    return (
      <section className="signup-form">
        <ReactContainer
          title=""
          fields={fields}
          onSubmit={this.onSubmit}
          buttons={{ next: 'Sign Up' }}
        />
      </section>
    );
  }
}

SignUpForm.propTypes = {
  callbackFunc: PropTypes.func.isRequired
};

const ReactContainer = reduxForm({
  form: 'user',
  validate
})(ReactForm);

const mapStateToProps = state => ({
  values: state.form.user.values
});

export default connect(mapStateToProps)(SignUpForm);
