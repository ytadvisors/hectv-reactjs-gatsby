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
    name: 'search',
    component: 'input',
    type: 'text',
    placeholder: 'Search*',
    validation: ['required'],
    autofocus: true
  }
];

const validate = Validator(fields);

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { callbackFunc } = this.props;
    callbackFunc.call(this);
  }
  render() {
    return (
      <section className="search-form">
        <ReactContainer
          title=""
          fields={fields}
          onSubmit={this.onSubmit}
          display_errors={false}
          buttons={{}}
        />
      </section>
    );
  }
}

SearchForm.propTypes = {
  callbackFunc: PropTypes.func.isRequired
};

const ReactContainer = reduxForm({
  form: 'search',
  validate
})(ReactForm);

const mapStateToProps = state => ({
  values: state.form.search.values
});

export default connect(mapStateToProps)(SearchForm);
