import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactForm from './../../../components/ReactForm';
import Validator from './../../../components/ReactForm/Validator';
import { SubmissionError } from 'redux-form';
import $ from 'jquery';

const fields = [
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
  }
];

const validate = Validator(fields);

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {}

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
      <section className="login-form">
        <ReactContainer
          {...this.props}
          title=""
          fields={fields}
          onSubmit={this.onSubmit}
        />
      </section>
    );
  }
}

LoginForm.propTypes = {
  prevModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  callbackFunc: PropTypes.func.isRequired,
  current_step: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  values: state.form.user.values
});

const form_name = 'user';
const ReactContainer = reduxForm({
  form: form_name,
  validate
})(ReactForm);

export default connect(mapStateToProps)(LoginForm);
