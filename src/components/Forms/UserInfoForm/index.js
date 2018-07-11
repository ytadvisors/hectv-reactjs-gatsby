import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { loadUserValues } from './../../../actions/formActions';
import { saveUserInformation } from './../../../actions/accountActions';
import { injectStripe } from 'react-stripe-elements';
import { SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
import ReactForm from './../../../components/ReactForm';
import Validator from './../../../components/ReactForm/Validator';
import $ from 'jquery';

const fields = [
  [
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
    }
  ],
  [
    {
      name: 'password',
      component: 'input',
      type: 'password',
      placeholder: 'Password*',
      validation: ['required', 'match_password']
    },
    {
      name: 'confirm_password',
      component: 'input',
      type: 'password',
      placeholder: 'Confirm Password*',
      validation: ['required', 'match_password']
    }
  ],
  {
    name: 'plan_id',
    component: 'select',
    placeholder: 'Payment Plan',
    options: [],
    validation: ['required']
  }
];
const validate = Validator(fields);

class UserInfoSlide extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.setupPricing = this.setupPricing.bind(this);
  }

  setupPricing(plan) {
    const { user } = this.props;
    return {
      text: plan.name,
      value: plan.id,
      price: plan.price,
      info: `$${plan.price} / month`,
      show_card: !!user.stripe_customer_id === false
    };
  }

  componentDidMount() {
    this.props.dispatch(loadUserValues(this.props.user));
  }

  onSubmit() {
    const { dispatch, values, stripe, callbackFunc, terms } = this.props;
    const valid_submit =
      !terms || (terms && $('.terms-and-conditions').is(':checked'));

    if (!valid_submit) {
      throw new SubmissionError({
        terms: 'You must agree to the terms and conditions',
        _error: 'You must agree to the terms and conditions'
      });
    }

    if (
      values.plan_id !== 'basic_monthly' &&
      values.plan_id !== 'basic_yearly'
    ) {
      return stripe.createToken({ name: values.email }).then(({ token }) => {
        if (!token) {
          throw new SubmissionError({
            stripe_card: 'Invalid credit card',
            _error: 'Registration failed!'
          });
        } else {
          values.stripe_token = token.id;
          dispatch(saveUserInformation(values));
          callbackFunc.call(this);
        }
      });
    } else {
      dispatch(saveUserInformation(values));
      return callbackFunc.call(this);
    }
  }

  render() {
    const { pricing_plans } = this.props;
    let updated_fields = fields;
    if (pricing_plans) {
      updated_fields = fields.map(field => {
        if (field.name === 'plan_id') {
          field.options = [
            { text: 'Choose your plan', value: '', disabled: true }
          ];
          field.options = [
            ...field.options,
            ...pricing_plans.map(plan => this.setupPricing(plan))
          ];
        }
        return field;
      });
    }

    return (
      <section className="user-info">
        <ReactContainer
          {...this.props}
          title="Account Information"
          fields={updated_fields}
          onSubmit={this.onSubmit}
        />
      </section>
    );
  }
}

UserInfoSlide.propTypes = {
  closeModal: PropTypes.func.isRequired,
  prevModal: PropTypes.func.isRequired,
  pricing_plans: PropTypes.array.isRequired,
  callbackFunc: PropTypes.func.isRequired,
  current_step: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  values: state.form.user.values,
  user: state.accountReducers.user
});

const ReactContainer = reduxForm({
  form: 'user',
  validate
})(ReactForm);

export default connect(mapStateToProps)(injectStripe(UserInfoSlide));
