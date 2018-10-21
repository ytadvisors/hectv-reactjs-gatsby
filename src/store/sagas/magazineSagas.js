import { put, takeLatest, all, call } from 'redux-saga/effects';
import MagazineApi from './../api/MagazineApi';
import * as types from '../types/magazineTypes';
import * as postTypes from '../types/postTypes';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { getUserToken } from './../../utils/session';
import { getNumAPIResults } from './../../utils/helperFunctions';

function validateUser() {
  if (getUserToken() === undefined || getUserToken() === '') {
    throw new Error('You must be logged in to perform this');
  }
}

function mapMagazine(result) {
  let response = {};
  response.excerpt = '';
  response.content = '';
  response.thumbnail = '';
  response.title = '';
  response.video_url = '';
  response.slug = result.slug;
  response.type = 'magazines';

  if (result.title) {
    response.title = result.title.rendered;
  }

  if (result.content) {
    response.content = result.content.rendered;
    response.excerpt = result.content.rendered;
  }

  if (result.acf) {
    if (result.acf.cover_image) {
      response.thumbnail = result.acf.cover_image;
      response.small_thumbnail = result.acf.cover_image;
    }
    if (result.acf.magazine_post) {
      response.post_list = result.acf.magazine_post.map(
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

function* loadMagazine(payload) {
  try {
    yield put(showLoading());
    let api = new MagazineApi();
    const magazine = yield call(
      api.getMagazineBySlug,
      payload.magazine_id
    );
    if (magazine.data.length > 0) {
      const data = mapMagazine(magazine.data[0]);
      yield put({
        type: types.SET_MAGAZINE,
        magazine: data
      });
      if (data.post_list && data.post_list.length > 0) {
        yield put({
          type: postTypes.LOAD_POSTS_SLUG,
          category: `magazine_${payload.magazine_id}`,
          slugs: data.post_list,
          magazine: data
        });
      } else {
        yield put({
          type: types.SET_ALL_MAGAZINES,
          magazines: [],
          load_more: false,
          num_results: 0
        });
      }
    } else {
      throw new Error('No matching magazine: ' + payload.magazine_id);
    }
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

/**
 * Load magazines for featured magazines
 *
 * @param payload
 */
function* loadAllMagazines(payload) {
  try {
    yield put(showLoading());
    let api = new MagazineApi();
    let magazines = yield call(
      api.getAllMagazines,
      payload.magazine_types,
      payload.page,
      12
    );

    const data = magazines.data.map(mapMagazine);
    yield put({
      type: types.SET_ALL_MAGAZINES,
      magazines: data,
      load_more: payload.load_more,
      num_results: getNumAPIResults(magazines)
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
function* loadMagazineList(payload) {
  try {
    yield put(showLoading());
    let api = new MagazineApi();
    let magazines = yield call(
      api.getAllMagazines,
      [],
      payload.page,
      5
    );

    const data = magazines.data.map(mapMagazine);
    yield put({
      type: types.SET_MAGAZINE_LIST,
      magazine_list: data,
      load_more: payload.load_more
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
    yield takeLatest(types.LOAD_ALL_MAGAZINES, loadAllMagazines),
    yield takeLatest(types.LOAD_MAGAZINE_LIST, loadMagazineList),
    yield takeLatest(types.LOAD_MAGAZINE, loadMagazine)
  ]);
}
