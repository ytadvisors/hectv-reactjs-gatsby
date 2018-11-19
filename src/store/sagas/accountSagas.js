import { put, takeLatest, all } from 'redux-saga/effects';
import _ from 'lodash';
import * as types from '../types/accountTypes';
import * as formTypes from '../types/formTypes';
import sendUserEmail from '../../utils/emailer';

/*-----------------
 *
 * LOAD OPERATIONS
 *
 *------------------*/

/*-----------------
 *
 * CREATE OPERATIONS
 *
 *------------------*/

function* sendContactEmail({ email, values }) {
  try {
    let message = '';
    _.keys(values).forEach(key => {
      message += `${key}: ${values[key]} <br/>`;
    });

    sendUserEmail({
      to: email || process.env.GATSBY_CONTACT_EMAIL || 'test@ytadvisors.com',
      subject: `New contact email from ${values.email}`,
      message
    });

    yield put({
      type: formTypes.RESET_CONTACT_VALUES,
      message
    });
  } catch (error) {
    yield put({ type: types.EMAIL_ERROR, error });
  }
}

/*-----------------
*
* UPDATE OPERATIONS
*
*------------------*/

function* handleErrors(payload) {
  if (payload.error) {
    const error = payload.error.response.data;
    console.log(error);
    if (error.message) {
      switch (error.code) {
        case '[jwt_auth] invalid_email':
        case '[jwt_auth] incorrect_password':
          yield put({
            type: '@@redux-form/STOP_SUBMIT',
            payload: {
              email: 'Invalid email or password',
              _error: 'Sign in failed!'
            },
            meta: {
              form: 'user'
            },
            error: true
          });
          break;
        case 'payment_error':
          yield put({
            type: '@@redux-form/STOP_SUBMIT',
            payload: {
              stripe_card: 'Invalid Credit Card',
              _error: 'Payment Failure'
            },
            meta: {
              form: 'user'
            },
            error: true
          });
          break;
        case 'existing_user':
          yield put({
            type: '@@redux-form/STOP_SUBMIT',
            payload: {
              email: 'Email already exists',
              _error: 'Registration failed!'
            },
            meta: {
              form: 'user'
            },
            error: true
          });
          break;
        case 'jwt_auth_invalid_token':
          yield put({
            type: types.LOGOUT,
            operation: 'reload_page'
          });
          break;
        default:
          break;
      }
    }
  }
}

export default function* rootSaga() {
  yield all([
    yield takeLatest(types.LOAD_ERROR, handleErrors),
    yield takeLatest(types.SEND_CONTACT_EMAIL, sendContactEmail)
  ]);
}
