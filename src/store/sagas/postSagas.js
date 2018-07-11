import { put, takeLatest, all, call } from 'redux-saga/effects';
import _ from 'lodash';

import PostApi from './../api/PostApi';
import * as types from '../types/postTypes';
import * as eventTypes from '../types/eventTypes';
import * as pageTypes from '../types/pageTypes';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { getUserToken } from './../../utils/token';
import { getNumAPIResults } from './../../utils/helperFunctions';

function validateUser() {
  if (getUserToken() === undefined || getUserToken() === '') {
    throw new Error('You must be logged in to perform this');
  }
}

function mapSubcategories(result) {
  let response = {};
  response.name = result.name;
  response.slug = result.slug;
  response.id = result.id;
  return response;
}

function mapComments(result) {
  let response = {};
  response.title = '';
  if (result.content) {
    response.title = result.content.rendered;
  }

  response.parent = result.parent;
  response.comment_id = result.id;
  response.author = result.author_name;
  response.thumbnail = result.author_avatar_urls
    ? result.author_avatar_urls['48']
    : '';

  return response;
}

function mapPost(result) {
  let response = {};
  response.excerpt = '';
  response.content = '';
  response.thumbnail = '';
  response.title = '';
  response.video_url = '';
  response.slug = result.slug;
  response.type = 'posts';
  response.format = 'blog';
  response.post_name = result.slug;

  if (result.title) {
    response.title = result.title.rendered;
  }

  if (result.excerpt) {
    response.excerpt = result.excerpt.rendered;
    response.excerpt = response.excerpt.replace('[&hellip;]', '');
  }

  if (result.content) {
    response.content = result.content.rendered;
    response.content = response.content
      .replace(/http:\/\/s3(.+amazon)/g, 'https://s3$1')
      .replace(/srcset="[^"]+/g, '');
  }

  if (result.acf) {
    if (result.acf.video_image) {
      response.thumbnail = result.acf.video_image.sizes.medium_large;
      response.small_thumbnail = result.acf.video_image.sizes.medium;
      response.format = 'video';
    }
    if (result.acf.post_header) {
      response.thumbnail = result.acf.post_header.sizes.medium_large;
      response.small_thumbnail = result.acf.post_header.sizes.medium;
      response.small_thumbnail = response.small_thumbnail.replace(
        /http:\/\/s3(.+amazon)/g,
        'https://s3$1'
      );
      response.thumbnail = response.thumbnail.replace(
        /http:\/\/s3(.+amazon)/g,
        'https://s3$1'
      );
      response.format = 'blog';
    }
    if (result.acf.youtube_id) {
      response.video_url = `https://youtu.be/${result.acf.youtube_id}`;
    }
    if (result.acf.vimeo_id) {
      response.video_url = `https://vimeo.com/${result.acf.vimeo_id}`;
    }
    if (result.acf.post_events) {
      response.events = result.acf.post_events.map(
        event => event.event.post_name
      );
    }
    if (result.acf.related_posts) {
      response.post_list = result.acf.related_posts.map(
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

function* loadPost(payload) {
  try {
    yield put(showLoading());
    let api = new PostApi();
    const post = yield call(api.getPostBySlug.bind(api), payload.post_id);
    if (post.data.length > 0) {
      const data = mapPost(post.data[0]);
      yield put({
        type: types.SET_POST,
        post: data
      });
      if (data.events) {
        yield put({
          type: eventTypes.LOAD_RELATED_EVENTS,
          slugs: data.events
        });
      }

      if (data.categories.length > 0) {
        let categories = data.categories.map(category => category.term_id);
        yield put({
          type: types.LOAD_POSTS_IN_CATEGORY,
          categories: categories
        });
      } else {
        yield put({
          type: types.SET_POSTS_IN_CATEGORY,
          category_posts: [],
          load_more: payload.load_more,
          num_results: 0
        });
      }

      if (data.post_list) {
        yield put({
          type: types.LOAD_POSTS_SLUG,
          category: 'related_' + payload.post_id,
          slugs: data.post_list
        });
      }
    } else {
      throw new Error('No matching post: ' + payload.post_id);
    }

    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

function* loadSubcategories(payload) {
  try {
    yield put(showLoading());
    let api = new PostApi();
    const category_info = yield call(
      api.getCategory.bind(api),
      payload.category
    );
    if (
      !category_info ||
      category_info.data.length === 0 ||
      !category_info.data[0].id
    ) {
      yield put({
        type: types.SET_SUBCATEGORIES,
        subcategories: []
      });
    } else {
      const subcategories = yield call(
        api.getSubCategories.bind(api),
        category_info.data[0].id
      );
      if (subcategories && subcategories.data.length > 0) {
        const data = subcategories.data.map(mapSubcategories);
        yield put({
          type: types.SET_SUBCATEGORIES,
          subcategories: data
        });
      } else {
        yield put({
          type: types.SET_SUBCATEGORIES,
          subcategories: []
        });
      }
    }
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

/**
 * Load posts for featured posts
 *
 * @param payload
 */
function* loadCategoryPosts(payload) {
  try {
    yield put(showLoading());
    let api = new PostApi();

    let posts = yield call(
      api.getCategoriesPosts.bind(api),
      payload.categories,
      payload.page,
      3
    );
    const data = posts.data.map(mapPost);
    yield put({
      type: types.SET_POSTS_IN_CATEGORY,
      category_posts: data,
      load_more: payload.load_more,
      num_results: getNumAPIResults(posts)
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

function* loadPostsWithSlug(payload) {
  try {
    yield put(showLoading());
    let api = new PostApi();
    let posts = yield call(api.getPostsBySlugs.bind(api), payload.slugs);

    const data = posts.data.map(mapPost);
    let indexed_posts = _.keyBy(data, 'post_name');
    let result = payload.slugs.map(slug => indexed_posts[slug]);
    yield put({
      type: types.SET_ALL_POSTS,
      posts: result,
      category: payload.category,
      load_more: payload.load_more,
      num_results: getNumAPIResults(posts)
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

/**
 * Load posts for featured posts
 *
 * @param payload
 */
function* loadAllPosts(payload) {
  try {
    yield put(showLoading());
    let api = new PostApi();
    let page_category = '';
    let posts = [];
    yield put({
      type: pageTypes.SET_CATEGORY_TITLE,
      title: ''
    });
    switch (payload.category) {
      case 'articles':
        posts = yield call(api.getArticles.bind(api), payload.page);
        yield put({
          type: pageTypes.SET_PAGE_TITLE,
          title: 'Articles'
        });
        break;
      default:
        if (payload.category !== '') {
          const category = yield call(
            api.getCategory.bind(api),
            payload.category
          );
          if (category.data.length === 0) {
            yield put({
              type: types.SET_ALL_POSTS,
              posts: [],
              category: payload.category,
              load_more: payload.load_more,
              num_results: 0
            });

            yield put(hideLoading());
            return;
          } else {
            page_category = category.data[0].id;
            if (category.data[0].parent === 0) {
              yield put({
                type: pageTypes.SET_CATEGORY_TITLE,
                title: category.data[0].name
              });
            } else if (category.data[0].parent) {
              const temp_category = yield call(
                api.getCategoryById.bind(api),
                category.data[0].parent
              );

              yield put({
                type: pageTypes.SET_CATEGORY_TITLE,
                title: temp_category.data.name
              });

              yield put({
                type: types.LOAD_SUBCATEGORIES,
                category: temp_category.data.slug
              });
              yield put(hideLoading());
            }
          }
        }

        posts = yield call(
          api.getAllPosts.bind(api),
          page_category,
          payload.page
        );
    }

    const data = posts.data.map(mapPost);
    yield put({
      type: types.SET_ALL_POSTS,
      posts: data,
      category: payload.category,
      load_more: payload.load_more,
      current_page: payload.page || 1,
      num_results: getNumAPIResults(posts)
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

function* loadSearchPosts(payload) {
  try {
    yield put(showLoading());
    let api = new PostApi();
    let terms = payload.terms.toLowerCase();
    let posts = yield call(api.findPosts.bind(api), terms, payload.page);

    const data = posts.data.map(mapPost);
    yield put({
      type: types.SET_ALL_POSTS,
      posts: data,
      category: `search_${terms}`,
      load_more: payload.load_more,
      current_page: payload.page || 1,
      num_results: getNumAPIResults(posts)
    });

    yield put({
      type: pageTypes.SET_PAGE_TITLE,
      title: `RESULTS: <span class="sub-title">${terms}</span>`
    });

    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}
/*-----------------
 *
 * CREATE OPERATIONS
 *
 *------------------*/

/**
 * Add a comment
 *
 * @param payload
 */

function* addComment(payload) {
  try {
    yield put(showLoading());
    validateUser();
    let api = new PostApi();
    yield call(api.addComment.bind(api), payload.comment);

    yield put({
      type: types.LOAD_COMMENTS,
      slug: payload.comment.post,
      page: 1,
      block_load: true
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
        case 'comment_duplicate':
          yield put({
            type: '@@redux-form/STOP_SUBMIT',
            payload: {
              message: 'Duplicate Comment. You just said that',
              _error: 'Cannot duplicate your comment'
            },
            meta: {
              form: 'comment'
            },
            error: true
          });
          break;
        case 'rest_invalid_param':
          yield put({
            type: '@@redux-form/STOP_SUBMIT',
            payload: {
              message: 'Cannot comment on this post',
              _error: 'Invalid Post'
            },
            meta: {
              form: 'comment'
            },
            error: true
          });
          break;
      }
    }
  }
}

//LOAD
function* watchLoadPostsAsync() {
  yield takeLatest(types.LOAD_ALL_POSTS, loadAllPosts);
}

function* watchLoadRelatedPostsAsync() {
  yield takeLatest(types.LOAD_POSTS_IN_CATEGORY, loadCategoryPosts);
}

function* watchLoadSubcategoriesAsync() {
  yield takeLatest(types.LOAD_SUBCATEGORIES, loadSubcategories);
}
function* watchLoadPostAsync() {
  yield takeLatest(types.LOAD_POST, loadPost);
}

function* watchLoadPostsWithSlugAsync() {
  yield takeLatest(types.LOAD_POSTS_SLUG, loadPostsWithSlug);
}

function* watchLoadSearchPostsWithSlugAsync() {
  yield takeLatest(types.LOAD_SEARCH_POSTS, loadSearchPosts);
}

//

//CREATE
function* watchAddCommentAsync() {
  yield takeLatest(types.ADD_COMMENT, addComment);
}

//UPDATE

//SUCCESS

//ERROR
function* watchHandleCommentErrorAsync() {
  //TODO: Error handling
  yield takeLatest(types.LOAD_ERROR, handleErrors);
}

export default function* rootSaga() {
  yield all([
    watchLoadPostsAsync(),
    watchLoadRelatedPostsAsync(),
    watchAddCommentAsync(),
    watchLoadPostAsync(),
    watchLoadSubcategoriesAsync(),
    watchLoadPostsWithSlugAsync(),
    watchHandleCommentErrorAsync(),
    watchLoadSearchPostsWithSlugAsync()
  ]);
}
