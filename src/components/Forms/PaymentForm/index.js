import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { loadAboutValues } from './../../../store/actions/formActions';
import { saveUserInformation } from './../../../store/actions/accountActions';
import { injectStripe } from 'react-stripe-elements';
import { SubmissionError } from 'redux-form';
import ReactForm from './../../../components/ReactForm';
import Validator from './../../../components/ReactForm/Validator';
import $ from 'jquery';

const fields = [
  {
    name: 'plan_id',
    component: 'select',
    placeholder: 'Payment Plan',
    options: [],
    validation: ['required']
  }
];
const validate = Validator(fields);

class PaymentForm extends Component {
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
    const { user: { plan_id, stripe_customer_id } } = this.props;
    this.props.dispatch(
      loadAboutValues({
        plan_id: plan_id,
        stripe_customer_id: stripe_customer_id
      })
    );
  }

  onSubmit() {
    const { dispatch, user, values, stripe, callbackFunc, terms } = this.props;
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
      values.plan_id !== 'basic_yearly' &&
      !!user.stripe_customer_id === false
    ) {
      return stripe.createToken({ name: values.email }).then(({ token }) => {
        if (!token) {
          throw new SubmissionError({
            stripe_card: 'Invalid credit card',
            _error: 'Registration failed!'
          });
        } else {
          values.stripe_token = token.id;
          console.log('TOKEN IS: ', token);
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
      <section className="payment-form">
        <ReactContainer
          {...this.props}
          title="Change your plan"
          fields={updated_fields}
          onSubmit={this.onSubmit}
        />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  values: state.form.about.values,
  user: state.accountReducers.user
});

const ReactContainer = reduxForm({
  form: 'about',
  validate
})(ReactForm);

export default connect(mapStateToProps)(injectStripe(PaymentForm));
