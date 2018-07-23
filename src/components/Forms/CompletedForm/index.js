import React, { Component } from 'react';
import PropTypes from 'prop-types';
import main_bg from './../../../assets/transparent-bg-2.png';
import './modules.scss';

export default class CompletedForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="completed-form">
        <div className="row">
          <div className="col-md-12">
            <h3>Registration Complete</h3>
          </div>
        </div>
        <img
          src={main_bg}
          className="img-responsive "
          style={{ width: '100%' }}
        />
      </section>
    );
  }
}

CompletedForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  current_step: PropTypes.number.isRequired
};
