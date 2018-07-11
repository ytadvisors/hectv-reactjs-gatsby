import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { saveScheduleInformation } from './../../../actions/accountActions';
import PropTypes from 'prop-types';
import ReactForm from './../../../components/ReactForm';
import Validator from './../../../components/ReactForm/Validator';
import { SubmissionError } from 'redux-form';
import $ from 'jquery';

const fields = [
  [
    {
      name: 'teacher_name',
      component: 'input',
      type: 'text',
      placeholder: "Teacher's Name*",
      validation: ['required']
    },
    {
      name: 'number_of_participants]',
      component: 'input',
      type: 'text',
      placeholder: 'Number of participants*',
      validation: ['required', 'number']
    }
  ],
  [
    {
      name: 'email',
      component: 'input',
      type: 'email',
      placeholder: 'Email*',
      validation: ['required', 'email']
    },
    {
      name: 'grade_level',
      component: 'input',
      type: 'text',
      placeholder: 'Grade Level*',
      validation: ['required']
    }
  ],
  [
    {
      name: 'school_or_location',
      component: 'input',
      type: 'text',
      placeholder: 'School / Location*',
      validation: ['required']
    },
    {
      name: 'connection_type',
      component: 'checkbox',
      type: 'checkbox',
      placeholder:
        'Please identify how you prefer to connect with this program',
      options: [
        { text: 'h323 VC', value: 'h323 VC' },
        { text: 'Skype', value: 'Skype' },
        { text: 'Zoom', value: 'Zoom' },
        { text: 'Internet Stream', value: 'Internet Stream' },
        { text: 'Other', value: 'Other' }
      ],
      validation: ['required', 'not_empty_array']
    }
  ],
  [
    {
      name: 'date',
      component: 'date-picker',
      type: 'text',
      placeholder: 'MM/DD/YYYY',
      validation: ['required']
    },
    {
      name: 'time',
      component: 'input',
      type: 'text',
      placeholder: 'Time of event (CST)*',
      options: [],
      validation: ['required']
    }
  ]
];

const validate = Validator(fields);

class ScheduleProgramForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.setOptions = this.setOptions.bind(this);
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

  setOptions(field, event_times) {
    switch (field.name) {
      case 'time':
        if (event_times && event_times.length > 0) {
          field.options = [
            { text: 'Choose your time', value: '', disabled: true }
          ];
          field.options = [
            ...field.options,
            ...event_times.map(time => ({
              text: time,
              value: time
            }))
          ];
          field.component = 'select';
        } else {
          field.component = 'input';
        }
        break;
      case 'date':
        if (event_times && event_times.length > 0) {
          field.disabled = true;
          field.component = 'input';
        } else {
          field.disabled = false;
          field.component = 'date-picker';
        }
        break;
    }
    return field;
  }

  render() {
    const { overlay_settings: { event_times } } = this.props;
    const updated_fields = fields.map(field => {
      if (Array.isArray(field)) {
        return field.map(sub_field => this.setOptions(sub_field, event_times));
      } else if (field.name === 'time') {
        return this.setOptions(field, event_times);
      }
    });

    return (
      <section className="schedule-program">
        <ReactContainer
          {...this.props}
          title="Schedule your program"
          fields={updated_fields}
          onSubmit={this.onSubmit}
        />
      </section>
    );
  }
}

ScheduleProgramForm.propTypes = {
  prevModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  callbackFunc: PropTypes.func.isRequired,
  current_step: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  values: state.form.schedule.values,
  overlay_settings: state.pageReducers.overlay_settings,
  schedule: state.accountReducers.schedule
});

const form_name = 'schedule';
const ReactContainer = reduxForm({
  form: form_name,
  validate
})(ReactForm);

export default connect(mapStateToProps)(ScheduleProgramForm);
