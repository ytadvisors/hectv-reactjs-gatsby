import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { saveAboutInformation } from './../../../actions/accountActions';
import { loadAboutValues } from './../../../actions/formActions';
import PropTypes from 'prop-types';
import ReactForm from './../../../components/ReactForm';
import Validator from './../../../components/ReactForm/Validator';
import { SubmissionError } from 'redux-form';
import countries from './../../../countries.json';
import $ from 'jquery';
import './styles.scss';

const fields = [
  {
    name: 'role',
    component: 'select',
    type: 'text',
    placeholder: 'Choose your role',
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
  },
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

class AboutInfoForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(loadAboutValues(this.props.about));
  }

  onSubmit() {
    const { dispatch, values, callbackFunc, terms } = this.props;
    const valid_submit =
      !terms || (terms && $('.terms-and-conditions').is(':checked'));

    if (!valid_submit) {
      throw new SubmissionError({
        terms: 'You must agree to the terms and conditions',
        _error: 'You must agree to the terms and conditions'
      });
    }

    dispatch(saveAboutInformation(values));
    callbackFunc.call(this);
  }

  render() {
    return (
      <section className="about-form">
        <ReactContainer
          {...this.props}
          title="Tell us about yourself"
          fields={fields}
          onSubmit={this.onSubmit}
        />
      </section>
    );
  }
}

AboutInfoForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  prevModal: PropTypes.func.isRequired,
  callbackFunc: PropTypes.func.isRequired,
  current_step: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  values: state.form.about.values,
  about: state.accountReducers.about
});

const ReactContainer = reduxForm({
  form: 'about',
  validate
})(ReactForm);

export default connect(mapStateToProps)(AboutInfoForm);
