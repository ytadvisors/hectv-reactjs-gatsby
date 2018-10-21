import { put, takeLatest, all, call } from 'redux-saga/effects';
import EventApi from './../api/EventApi';
import * as types from '../types/eventTypes';
import * as postTypes from '../types/postTypes';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { getUserToken } from './../../utils/session';
import { getNumAPIResults } from './../../utils/helperFunctions';
import _ from 'lodash';
import moment from 'moment';

function validateUser() {
  if (getUserToken() === undefined || getUserToken() === '') {
    throw new Error('You must be logged in to perform this');
  }
}
function mapEventCategories(result) {
  let response = {};
  response.name = result.name;
  response.slug = result.slug;
  return response;
}

function getDateArrayHelper(start_time, end_time, res, collator) {
  let start_date = start_time ? moment(start_time).format('MMM D Y') : '';
  let end_date = end_time ? moment(end_time).format('MMM D Y') : '';
  const [st_month, st_day, st_year] = start_date.split(' ');
  const [end_month, end_day, end_year] = end_date.split(' ');
  let index = '';
  if (st_year === end_year) {
    index =
      st_month === end_month
        ? st_day === end_day
          ? ` ${st_month} ${st_day}`
          : ` ${st_month} ${st_day} - ${end_day}`
        : ` ${st_month} ${st_day} - ${end_month} ${end_day}`;
  } else {
    if (st_year && end_year)
      index = ` ${st_month} ${st_day} ${st_year} - ${end_month} ${end_day}, ${end_year}`;
    else if (st_year) index = ` ${st_month} ${st_day}`;
    else if (end_year) index = ` ${end_month} ${end_day}`;
  }
  res['months'][st_month] = 1;
  res['months'][end_month] = 1;

  res['values'][index] = start_time ? start_time : end_time;

  return res;
}

function mapEvent(result) {
  let response = {};
  response.excerpt = '';
  response.content = '';
  response.thumbnail = '';
  response.date = '';
  response.title = '';
  response.video_url = '';
  response.slug = result.slug;
  response.type = 'events';
  response.format = 'events';

  if (result.title) {
    response.title = result.title.rendered;
  }

  if (result.content) {
    response.content = result.content.rendered;
  }

  if (result.acf) {
    if (result.acf.venue) {
      response.excerpt = result.acf.venue;
      response.venue = result.acf.venue;
    }
    if (result.acf.web_address) {
      response.link = result.acf.web_address;
    }
    if (result.acf.event_price) {
      response.price = result.acf.event_price;
    }
    if (result.acf.event_image) {
      response.thumbnail = result.acf.event_image.sizes.medium_large;
      response.small_thumbnail = result.acf.event_image.sizes.medium;
    }
    if (result.acf.event_dates) {
      let collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      let date_array = result.acf.event_dates.reduce(
        (res, item) => {
          if (item.start_time)
            return getDateArrayHelper(
              item.start_time,
              item.end_time,
              res,
              collator
            );
          return res;
        },
        { values: {}, months: {} }
      );

      let date_keys = _.keys(date_array['values']);
      let month_keys = _.keys(date_array['months']);

      response.date =
        month_keys.length > 1 ? date_keys : date_keys.sort(collator.compare);
    }
    if (result.acf.related_posts && result.acf.related_posts.length > 0) {
      response.related_posts = result.acf.related_posts.map(
        post => post.post.post_name
      );
    }
  }

  response.categories = result.categories;

  return response;
}

/*-----------------
 *
 * LOAD OPERATIONS
 *
 *------------------*/

function* loadEvent(payload) {
  try {
    yield put(showLoading());
    let api = new EventApi();
    const event = yield call(api.getEventBySlug, payload.event_id);
    if (event.data.length > 0) {
      const data = mapEvent(event.data[0]);
      yield put({
        type: types.SET_EVENT,
        event: data
      });
      if (data.related_posts) {
        yield put({
          type: postTypes.LOAD_POSTS_SLUG,
          category: 'related_' + payload.event_id,
          slugs: data.related_posts
        });
      }
    } else {
      throw new Error('No matching event: ' + payload.event_id);
    }
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

function* loadEventCategories(payload) {
  try {
    yield put(showLoading());
    let api = new EventApi();
    let data = [{ name: 'All Events', slug: 'all' }];
    let event_categories = [];
    let x = 0;
    do {
      event_categories = yield call(api.getEventCategories, ++x);
      data = [...data, ...event_categories.data.map(mapEventCategories)];
    } while (event_categories.data.length > 0);

    yield put({
      type: types.SET_EVENT_CATEGORIES,
      event_categories: data
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
function* loadAllEvents(payload) {
  try {
    yield put(showLoading());
    let api = new EventApi();
    let event_types = [];
    if (payload.event_types.length > 0) {
      const ev_types = yield call(
        api.getEventType,
        payload.event_types
      );
      if (ev_types.data.length > 0) {
        event_types = ev_types.data.map(ev_type => ev_type.id);
      }
    }

    let events = yield call(
      api.getAllEvents,
      event_types,
      payload.event_day,
      payload.page,
      payload.per_page
    );

    const data = events.data.map(mapEvent);
    yield put({
      type: types.SET_ALL_EVENTS,
      events: data,
      load_more: payload.load_more,
      num_results: getNumAPIResults(events)
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
function* loadEventList(payload) {
  try {
    yield put(showLoading());
    let api = new EventApi();
    let events = yield call(
      api.getAllEvents,
      [],
      payload.event_day,
      1,
      5
    );

    const data = events.data.map(mapEvent);
    yield put({
      type: types.SET_EVENT_LIST,
      event_list: data,
      num_results: getNumAPIResults(events)
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

function* loadRelatedEvents(payload) {
  try {
    yield put(showLoading());
    let api = new EventApi();
    let events = yield call(api.getEventsBySlugs, payload.slugs);

    const data = events.data.map(mapEvent);
    yield put({
      type: types.SET_RELATED_EVENTS,
      related_events: data,
      num_results: getNumAPIResults(events)
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

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
    yield takeLatest(types.LOAD_ALL_EVENTS, loadAllEvents),
    yield takeLatest(types.LOAD_RELATED_EVENTS, loadRelatedEvents),
    yield takeLatest(types.LOAD_EVENT_LIST, loadEventList),
    yield takeLatest(types.LOAD_EVENT, loadEvent),
    yield takeLatest(types.LOAD_EVENT_CATEGORIES, loadEventCategories)
  ]);
}
