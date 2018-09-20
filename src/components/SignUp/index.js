import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SignUpForm from './../../components/Forms/SignUpForm';
import './styles.scss';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.signup = this.signup.bind(this);
  }

  signup() {
    console.log('subscribe');
  }

  render() {
    return (
      <section className="signup">
        <SignUpForm callbackFunc={this.signup} />
      </section>
    );
  }
}
