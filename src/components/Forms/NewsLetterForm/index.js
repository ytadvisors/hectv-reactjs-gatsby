import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactForm from './../../../components/ReactForm';
import Validator from './../../../components/ReactForm/Validator';
import { reduxForm } from 'redux-form';
import './styles.scss';
import countries from './../../../countries.json';
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
  [
    {
      name: 'newsletter-captcha',
      component: 'captcha',
      type: 'text',
      validation: ['required']
    }
  ]
];

const validate = Validator(fields);

class NewsLetterForm extends Component {
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
      <section className="newsletter-form">
        <ReactContainer
          title=""
          fields={fields}
          onSubmit={this.onSubmit}
          buttons={{ next: 'Subscribe' }}
        />
      </section>
    );
  }
}

NewsLetterForm.propTypes = {
  callbackFunc: PropTypes.func.isRequired
};

const ReactContainer = reduxForm({
  form: 'newsletter',
  validate
})(ReactForm);

const mapStateToProps = state => ({
  values: state.form.newsletter.values
});

export default connect(mapStateToProps)(NewsLetterForm);
