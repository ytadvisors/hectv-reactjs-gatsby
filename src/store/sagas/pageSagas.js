import { delay } from 'redux-saga';
import { put, takeLatest, all, call } from 'redux-saga/effects';
import PageApi from './../api/PageApi';
import * as types from '../types/pageTypes';
import * as postTypes from '../types/postTypes';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

function mapPlan(result) {
  let response = {};
  response.id = result.acf.plan_id;
  response.name = result.acf.plan_name;
  response.price = result.acf.plan_price;
  response.background_color = result.acf.background_color;
  response.font_color = result.acf.font_color;
  response.slug = result.slug;
  response.features = {};

  //map features
  for (let x in result.acf) {
    if (Array.isArray(result.acf[x])) {
      response.features[x] = result.acf[x];
    }
  }

  return response;
}

function mapLiveVideo(result) {
  let response = {};

  if (result.title) {
    response.title = result.title.rendered;
  }

  if (result.content) {
    response.content = result.content.rendered;
  }
  if (result.acf) {
    if (result.acf.url) {
      response.url = result.acf.url;
    }
    if (result.acf.start_date) {
      response.start_date = result.acf.start_date;
    }
    if (result.acf.end_date) {
      response.end_date = result.acf.end_date;
    }
    if (result.acf.end_date) {
      response.end_date = result.acf.end_date;
    }
  }
  return response;
}

/*-----------------
 *
 * LOAD OPERATIONS
 *
 *------------------*/

/**
 * Load function for all wordpress pages
 *
 * @param payload
 */
function* loadPage(payload) {
  try {
    yield put(showLoading());
    let api = new PageApi();
    const result = yield call(api.getPage, payload.page_name);
    let response = {
      content: '',
      video_url: '',
      thumbnail: ''
    };
    if (result.data && result.data.length > 0) {
      let acf = result.data[0].acf;
      let post_list = [];
      response = acf;
      response.content = result.data[0].content.rendered;
      response.template = result.data[0].template;
      if (acf.post_list) {
        post_list = acf.post_list.map(post => post.post.post_name);
        yield put({
          type: postTypes.LOAD_POSTS_SLUG,
          category: 'related_' + payload.page_name,
          slugs: post_list
        });
      }
      const title = result.data[0].title.rendered.toLowerCase();
      yield put({
        type: types.SET_PAGE_TITLE,
        title: title
      });
    }
    let data = {};
    data[payload.page_name.toLowerCase()] = response;

    yield put({ type: types.SET_PAGE, page_data: data });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

/**
 * Load pricing plan information
 *
 * @param payload
 */
function* loadPricingPlans(payload) {
  try {
    yield put(showLoading());
    let api = new PageApi();
    const plans = yield call(api.getPricingPlans, payload.page);
    const pricing_plans = plans.data.map(mapPlan);

    yield put({
      type: types.SET_PRICING,
      pricing_plans: pricing_plans
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

function* loadMenu(payload) {
  try {
    yield put(showLoading());
    let api = new PageApi();
    const menus = yield call(api.getMenus);
    const menu_id = menus.data.reduce((result, item) => {
      if (item.slug === payload.menu_slug) result = item.term_id;
      return result;
    }, '');

    const menu_details = yield call(api.getMenus, menu_id);

    const menu = {};
    menu[payload.menu_slug] = menu_details.data.items;

    yield put({
      type: types.SET_MENU,
      menus: menu
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

/**
 * Function live updates the video
 *
 * @param payload
 */
function* loadLiveVideos(payload) {
  try {
    let api = new PageApi();
    const live_videos = yield call(api.getLiveVideo);
    let data = {};
    if (live_videos && live_videos.data.length > 0) {
      data = mapLiveVideo(live_videos.data[0]);
    }
    yield put({
      type: types.SET_LIVE_VIDEO,
      live_video: data
    });

    yield call(delay, 30000);
    yield put({
      type: types.LOAD_LIVE_VIDEO
    });
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
  }
}

function* openOverlay(payload) {
  try {
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
  }
}


export default function* rootSaga() {
  yield all([
    yield takeLatest(types.LOAD_PRICING, loadPricingPlans),
    yield takeLatest(types.LOAD_PAGE, loadPage),
    yield takeLatest(types.LOAD_HEADER_MENU, loadMenu),
    yield takeLatest(types.LOAD_BOTTOM_NAV_MENU, loadMenu),
    yield takeLatest(types.LOAD_FOOTER_MENU, loadMenu),
    yield takeLatest(types.LOAD_SOCIAL_MENU, loadMenu),
    yield takeLatest(types.LOAD_LIVE_VIDEO, loadLiveVideos),
    yield takeLatest(types.OPEN_OVERLAY, openOverlay)
  ]);
}
