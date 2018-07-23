import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NewsLetterForm from './../../components/Forms/NewsLetterForm';
import './modules.scss';

const subscribe = () => {
  console.log('subscribe');
};

export default (props) => (
  <section className="newsletter">
    <NewsLetterForm callbackFunc={subscribe} />
  </section>
);
