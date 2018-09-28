import React from 'react';
import PropTypes from 'prop-types';

import NewsLetterForm from './../../components/Forms/NewsLetterForm';
import './styles.scss';

export default (props) => {
  const {
    subscribe
  } = props;

  return <section className="newsletter">
    <NewsLetterForm callbackFunc={subscribe}/>
  </section>
};
