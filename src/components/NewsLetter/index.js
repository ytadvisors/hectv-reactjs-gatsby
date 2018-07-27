import React, { Component } from 'react';
import PropTypes from 'prop-types';
import addToMailchimp from 'gatsby-plugin-mailchimp'
import NewsLetterForm from './../../components/Forms/NewsLetterForm';
import './modules.scss';

const subscribe = async (values) => {
  try {
    if (values["newsletter-captcha"])
      delete(values["newsletter-captcha"]);
    await addToMailchimp(values["EMAIL"], values);

  } catch(err){

  }

};

export default (props) => (
  <section className="newsletter">
    <NewsLetterForm callbackFunc={subscribe} />
  </section>
);
