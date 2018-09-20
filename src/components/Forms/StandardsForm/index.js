import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { loadAboutValues } from './../../../store/actions/formActions';
import { saveUserInformation } from './../../../store/actions/accountActions';
import { SubmissionError } from 'redux-form';
import ReactForm from './../../../components/ReactForm';
import Validator from './../../../components/ReactForm/Validator';
import $ from 'jquery';

const fields = [
  {
    name: 'state',
    component: 'select',
    type: 'text',
    placeholder: 'State / Standard',
    options: [{ text: 'Select your State or Standard', value: 'default' }],
    validation: ['required']
  },
  {
    name: 'subject',
    component: 'select',
    type: 'text',
    placeholder: 'Subject',
    options: [],
    validation: ['required']
  },
  {
    name: 'grade',
    component: 'select',
    type: 'text',
    placeholder: 'Grade',
    options: [],
    validation: ['required']
  },
  {
    name: 'standards',
    component: 'select',
    type: 'text',
    placeholder: 'Standard Number',
    options: [],
    validation: ['required']
  }
];
const validate = Validator(fields);

class StandardsForm extends Component {
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
    const {
      standards,
      standards_profile: { grades, standards_sets, subjects }
    } = this.props;
    let updated_fields = fields;
    if (standards_sets) {
      updated_fields = fields.map(field => {
        switch (field.name) {
          case 'state':
            field.options = [
              { text: 'Choose a state or standard', value: '', disabled: true }
            ];
            field.options = [
              ...field.options,
              ...standards_sets.map(set => ({
                text: set.name,
                value: set.set_id
              }))
            ];
            break;
          case 'subject':
            field.options = [
              { text: 'Select a subject', value: '', disabled: true }
            ];
            field.options = [
              ...field.options,
              ...subjects.map(subject => ({
                text: subject,
                value: subject
              }))
            ];
            break;
          case 'grade':
            field.options = [
              { text: 'Choose a grade', value: '', disabled: true }
            ];
            field.options = [
              ...field.options,
              ...grades.map(grade => ({
                text: grade,
                value: grade
              }))
            ];
            break;
          case 'standards':
            if (standards.length > 0) {
              field.options = [
                { text: 'Choose a standard number', value: '', disabled: true }
              ];
              field.options = [...field.options, ...standards];
            }
        }
        return field;
      });
    }
    return (
      <section className="standards-form">
        <ReactContainer
          {...this.props}
          fields={updated_fields}
          onSubmit={this.onSubmit}
          display_label={true}
        />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  values: state.form.standards.values,
  user: state.accountReducers.user,
  standards_profile: state.postReducers.standards_profile,
  standards: state.postReducers.standards
});

const ReactContainer = reduxForm({
  form: 'standards',
  validate
})(ReactForm);

export default connect(mapStateToProps)(StandardsForm);
