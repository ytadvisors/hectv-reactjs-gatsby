import { put, takeLatest, all, call } from 'redux-saga/effects';
import ScheduleApi from './../api/ScheduleApi';
import * as types from '../types/scheduleTypes';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { getUserToken } from './../../utils/session';
import { getNumAPIResults } from './../../utils/helperFunctions';

function validateUser() {
  if (getUserToken() === undefined || getUserToken() === '') {
    throw new Error('You must be logged in to perform this');
  }
}

function mapSchedule(result) {
  let response = {};
  if (result.acf && result.acf.schedule_programs)
    response = result.acf.schedule_programs;

  return response;
}

/*-----------------
 *
 * LOAD OPERATIONS
 *
 *------------------*/

function* loadDailySchedule(payload) {
  try {
    //yield put(showLoading());
    let api = new ScheduleApi();
    const schedule = yield call(api.getScheduleByDay, payload.day);
    if (schedule.data && schedule.data.length > 0) {
      const data = mapSchedule(schedule.data[0]);
      yield put({
        type: types.SET_DAILY_SCHEDULE,
        schedule: data
      });
    } else {
      yield put({
        type: types.SET_DAILY_SCHEDULE,
        schedule: []
      });
    }

    //yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    //yield put(hideLoading());
  }
}

function* loadSchedule(payload) {
  try {
    yield put(showLoading());
    let api = new ScheduleApi();
    const schedule = yield call(api.getSchedule, payload.schedule_id);
    const data = mapSchedule(schedule.data);
    yield put({
      type: types.SET_SCHEDULE,
      schedule: data
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
function* loadAllSchedules(payload) {
  try {
    yield put(showLoading());
    let api = new ScheduleApi();

    let schedules = yield call(
      api.getAllSchedules,
      payload.page,
      payload.per_page
    );

    const data = schedules.data.map(mapSchedule);
    yield put({
      type: types.SET_ALL_SCHEDULES,
      schedules: data,
      load_more: payload.load_more,
      num_results: getNumAPIResults(schedules)
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
    yield takeLatest(types.LOAD_DAILY_SCHEDULE, loadDailySchedule),
    yield takeLatest(types.LOAD_ALL_SCHEDULES, loadAllSchedules),
    yield takeLatest(types.LOAD_SCHEDULE, loadSchedule)
  ]);
}
