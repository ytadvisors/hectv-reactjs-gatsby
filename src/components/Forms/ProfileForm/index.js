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
  [
    {
      name: 'name',
      component: 'input',
      type: 'text',
      placeholder: 'Full Name*',
      validation: ['required']
    },
    {
      name: 'role',
      component: 'select',
      type: 'text',
      placeholder: 'Role',
      options: [
        { text: 'Choose your role', value: '', disabled: true },
        { text: 'Teacher', value: 'Teacher' },
        {
          text: 'Instructional Specialist',
          value: 'Instructional Specialist'
        },
        { text: 'School Administrator', value: 'School Administrator' },
        { text: 'District Administrator', value: 'District Administrator' },
        {
          text: 'Library Media Specialist',
          value: 'Library Media Specialist'
        },
        { text: 'Other School Employee', value: 'Other School Employee' },
        { text: 'Parent', value: 'Parent' }
      ],
      validation: ['required']
    }
  ],
  {
    name: 'school',
    component: 'input',
    type: 'text',
    placeholder: 'School',
    validation: ['required']
  },
  [
    {
      name: 'state',
      component: 'input',
      type: 'text',
      placeholder: 'State',
      validation: ['required']
    },
    {
      name: 'zip',
      component: 'input',
      type: 'text',
      placeholder: 'Zip Code',
      validation: ['required']
    }
  ],
  {
    name: 'country',
    component: 'select',
    type: 'text',
    placeholder: 'Country',
    options: countries,
    validation: ['required']
  }
];

const validate = Validator(fields);

class ProfileForm extends Component {
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
      <section className="profile-details">
        <ReactContainer
          title="Tell us about yourself"
          fields={fields}
          onSubmit={this.onSubmit}
          buttons={{ next: 'Update' }}
          display_label
        />
        <div className="row" />
      </section>
    );
  }
}

ProfileForm.propTypes = {
  callbackFunc: PropTypes.func.isRequired
};

const ReactContainer = reduxForm({
  form: 'user',
  validate
})(ReactForm);

const mapStateToProps = state => ({
  values: state.form.user.values
});

export default connect(mapStateToProps)(ProfileForm);
