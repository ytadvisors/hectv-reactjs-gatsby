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
  [
    {
      name: 'message',
      component: 'textarea',
      type: 'text',
      rows: 8,
      placeholder: 'Write a live comment',
      validation: ['required']
    }
  ]
];

const validate = Validator(fields);

class CommentForm extends Component {
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
      <section className="comment-form">
        <ReactContainer
          title=""
          fields={fields}
          onSubmit={this.onSubmit}
          buttons={{ next: 'Comment' }}
        />
        <div className="row" />
      </section>
    );
  }
}

CommentForm.propTypes = {
  callbackFunc: PropTypes.func.isRequired
};

const ReactContainer = reduxForm({
  form: 'comment',
  validate
})(ReactForm);

const mapStateToProps = state => ({
  values: state.form.comment.values
});

export default connect(mapStateToProps)(CommentForm);
