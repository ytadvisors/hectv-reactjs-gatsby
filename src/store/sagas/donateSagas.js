import { put, takeLatest, all, call } from 'redux-saga/effects';
import DonationApi from './../api/DonateApi';
import * as types from '../types/donateTypes';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { getUserToken } from './../../utils/session';
import { getNumAPIResults } from './../../utils/helperFunctions';
import moment from 'moment';

function validateUser() {
  if (getUserToken() === undefined || getUserToken() === '') {
    throw new Error('You must be logged in to perform this');
  }
}

function mapDonation(result) {
  let response = {};
  response.excerpt = '';
  response.content = '';
  response.thumbnail = '';
  response.date = '';
  response.title = '';
  response.redirect = '';
  response.slug = result.id;
  response.type = 'donate';

  if (result.title) {
    response.title = result.title.rendered;
  }

  if (result.content) {
    response.content = result.content.rendered;
  }

  if (result.excerpt) {
    response.excerpt = result.excerpt.rendered;
  }

  if (result.acf) {
    if (result.acf.excerpt) {
      response.excerpt = result.acf.excerpt;
    }
    if (result.acf.url) {
      response.redirect = result.acf.url;
    }
    if (result.acf.thumbnail) {
      response.thumbnail = result.acf.thumbnail.sizes.large;
      response.small_thumbnail = result.acf.thumbnail.sizes.medium_large;
      response.small_thumbnail = response.small_thumbnail.replace(
        /http:\/\/s3(.+amazon)/g,
        'https://s3$1'
      );
      response.thumbnail = response.thumbnail.replace(
        /http:\/\/s3(.+amazon)/g,
        'https://s3$1'
      );
    }
    if (result.acf.start_date && result.acf.end_date) {
      response.date =
        moment(result.acf.start_date).format('MMM D') +
        ' - ' +
        moment(result.acf.end_date).format('MMM D');
    }
  }

  response.small_thumbnail = response.thumbnail.replace(
    /(\.\w+)$/,
    '-150x150$1'
  );

  response.categories = result.categories;

  return response;
}

/*-----------------
 *
 * LOAD OPERATIONS
 *
 *------------------*/

function* loadDonation(payload) {
  try {
    yield put(showLoading());
    let api = new DonationApi();
    const donation = yield call(api.getDonation, payload.donation_id);
    const data = mapDonation(donation.data);
    yield put({
      type: types.SET_DONATION,
      donation: data
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

/**
 * Load events for featured events
 *
 * @param payload
 */
function* loadAllDonations(payload) {
  try {
    yield put(showLoading());
    let api = new DonationApi();

    let donations = yield call(
      api.getAllDonations,
      payload.page,
      payload.per_page
    );

    const data = donations.data.map(mapDonation);
    yield put({
      type: types.SET_ALL_DONATIONS,
      donations: data,
      load_more: payload.load_more,
      num_results: getNumAPIResults(donations)
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

/**
 * Load events for featured events
 *
 * @param payload
 */
/*-----------------
 *
 * UPDATE OPERATIONS
 *
 *------------------*/

/*-----------------
 *
 * ERROR HANDLING
 *
 *------------------*/

function* handleErrors(payload) {
  if (payload.error) {
    const error = payload.error.response.data;
    console.log(error);
    if (error.message) {
      switch (error.code) {
        default:
          break;
      }
    }
  }
}


export default function* rootSaga() {
  yield all([
    yield takeLatest(types.LOAD_ALL_DONATIONS, loadAllDonations),
    yield takeLatest(types.LOAD_DONATION, loadDonation)
  ]);
}
