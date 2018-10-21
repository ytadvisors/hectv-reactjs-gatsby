import { put, takeLatest, all, call } from 'redux-saga/effects';
import * as types from '../types/accountTypes';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

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
      }
    }
  }
}

export default function* rootSaga() {
  yield all([
    yield takeLatest(types.LOAD_ERROR, handleErrors)
  ]);
}
