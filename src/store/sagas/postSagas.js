import { put, select, takeLatest, all, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import _ from 'lodash';

import { showLoading, hideLoading } from 'react-redux-loading-bar';
import PostApi from '../api/PostApi';
import * as types from '../types/postTypes';
import * as eventTypes from '../types/eventTypes';
import * as pageTypes from '../types/pageTypes';
import { getUserToken } from '../../utils/session';
import { getNumAPIResults } from '../../utils/helperFunctions';

function validateUser() {
  if (getUserToken() === undefined || getUserToken() === '') {
    throw new Error('You must be logged in to perform this');
  }
}

function mapSubcategories(result) {
  const response = {};
  response.name = result.name;
  response.slug = result.slug;
  response.id = result.id;
  return response;
}

function mapPost(result) {
  const response = {};
  if (result) {
    response.excerpt = '';
    response.content = '';
    response.thumbnail = '';
    response.title = '';
    response.videoUrl = '';
    response.slug = result.slug;
    response.type = 'posts';
    response.format = 'blog';
    response.postName = result.slug;

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
      if (result.acf.videoImage) {
        response.thumbnail = result.acf.videoImage.sizes.mediumLarge;
        response.smallThumbnail = result.acf.videoImage.sizes.medium;
        response.format = 'video';
      }
      if (result.acf.postHeader) {
        response.thumbnail = result.acf.postHeader.sizes.mediumLarge;
        response.smallThumbnail = result.acf.postHeader.sizes.medium;
        response.smallThumbnail = response.smallThumbnail.replace(
          /http:\/\/s3(.+amazon)/g,
          'https://s3$1'
        );
        response.thumbnail = response.thumbnail.replace(
          /http:\/\/s3(.+amazon)/g,
          'https://s3$1'
        );
        response.format = 'blog';
      }
      if (result.acf.youtubeId) {
        response.videoUrl = `https://youtu.be/${result.acf.youtubeId}`;
      }
      if (result.acf.vimeoId) {
        response.videoUrl = `https://vimeo.com/${result.acf.vimeoId}`;
      }
    }

    response.categories = result.categoryList;
  }
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
    const api = new PostApi();
    const post = yield call(api.getPostBySlug, payload.postId);
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
        const categories = data.categories.map(category => category.term_id);
        yield put({
          type: types.LOAD_POSTS_IN_CATEGORY,
          categories
        });
      } else {
        yield put({
          type: types.SET_POSTS_IN_CATEGORY,
          category_posts: [],
          loadMore: payload.loadMore,
          numResults: 0
        });
      }

      if (data.postList) {
        yield put({
          type: types.LOAD_POSTS_SLUG,
          category: `related_${payload.postId}`,
          slugs: data.postList
        });
      }
    } else {
      throw new Error(`No matching post: ${payload.postId}`);
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
    const api = new PostApi();
    const categoryInfo = yield call(api.getCategory, payload.category);
    if (
      !categoryInfo ||
      categoryInfo.data.length === 0 ||
      !categoryInfo.data[0].id
    ) {
      yield put({
        type: types.SET_SUBCATEGORIES,
        subcategories: []
      });
    } else {
      const subcategories = yield call(
        api.getSubCategories,
        categoryInfo.data[0].id
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
    const api = new PostApi();

    const posts = yield call(
      api.getCategoriesPosts,
      payload.categories,
      payload.page,
      3
    );
    const data = posts.data.map(mapPost);
    yield put({
      type: types.SET_POSTS_IN_CATEGORY,
      category_posts: data,
      loadMore: payload.loadMore,
      numResults: getNumAPIResults(posts)
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
    const api = new PostApi();
    const posts = yield call(api.getPostsBySlugs, payload.slugs);

    const data = posts.data.map(mapPost);
    const indexedPosts = _.keyBy(data, 'postName');
    const result = payload.slugs.map(slug => indexedPosts[slug]);
    yield put({
      type: types.SET_ALL_POSTS,
      posts: result,
      category: payload.category,
      loadMore: payload.loadMore,
      numResults: getNumAPIResults(posts)
    });
    yield put(hideLoading());
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
    yield put(hideLoading());
  }
}

function* loadLiveVideos() {
  try {
    const api = new PostApi();
    const liveVideos = yield call(api.getLiveVideos);
    yield put({
      type: types.SET_LIVE_VIDEOS,
      liveVideos: liveVideos.data
    });
  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
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
    const api = new PostApi();
    let pageCategory = '';
    let posts = [];
    yield put({
      type: pageTypes.SET_CATEGORY_TITLE,
      title: ''
    });
    switch (payload.category) {
      case 'articles':
        posts = yield call(api.getArticles, payload.page);
        yield put({
          type: pageTypes.SET_PAGE_TITLE,
          title: 'Articles'
        });
        break;
      default:
        if (payload.category !== '') {
          const category = yield call(api.getCategory, payload.category);
          if (category.data.length === 0) {
            yield put({
              type: types.SET_ALL_POSTS,
              posts: [],
              category: payload.category,
              loadMore: payload.loadMore,
              numResults: 0
            });

            yield put(hideLoading());
            return;
          }
          pageCategory = category.data[0].id;
          if (category.data[0].parent === 0) {
            yield put({
              type: pageTypes.SET_CATEGORY_TITLE,
              title: category.data[0].name
            });
          } else if (category.data[0].parent) {
            const tempCategory = yield call(
              api.getCategoryById,
              category.data[0].parent
            );

            yield put({
              type: pageTypes.SET_CATEGORY_TITLE,
              title: tempCategory.data.name
            });

            yield put({
              type: types.LOAD_SUBCATEGORIES,
              category: tempCategory.data.slug
            });
            yield put(hideLoading());
          }
        }

        posts = yield call(api.getAllPosts, pageCategory, payload.page);
    }

    const data = posts.data.map(mapPost);
    yield put({
      type: types.SET_ALL_POSTS,
      posts: data,
      category: payload.category,
      loadMore: payload.loadMore,
      currentPage: payload.page || 1,
      numResults: getNumAPIResults(posts)
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
    const api = new PostApi(payload);
    const currentPage = payload.page || 1;
    const terms = payload.terms.toLowerCase();
    const posts = yield call(api.findPosts, payload);

    let data = [];
    const numResults = getNumAPIResults(posts);
    if (posts && posts.data) {
      data = posts.data.map(mapPost);

      yield put({
        type: types.SET_ALL_POSTS,
        posts: data,
        category: `search_${terms}`,
        loadMore: payload.loadMore,
        currentPage,
        numResults
      });
    } else {
      yield put({
        type: types.SET_ALL_POSTS,
        posts: data,
        category: `search_${terms}`,
        loadMore: payload.loadMore,
        currentPage,
        numResults: 0
      });
    }

    if (data.length > 0 && numResults > 10) {
      const state = yield select();
      const reducer = state.postReducers;

      // automate load more.
      if (reducer.posts.length < reducer.numResults.posts) {
        yield call(delay, 300);
        yield put({
          type: types.LOAD_SEARCH_POSTS,
          terms,
          page: currentPage + 1,
          loadMore: true
        });
      }
    }

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
    const api = new PostApi();
    yield call(api.addComment, payload.comment);

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
        default:
          break;
      }
    }
  }
}

export default function* rootSaga() {
  yield all([
    yield takeLatest(types.LOAD_ALL_POSTS, loadAllPosts),
    yield takeLatest(types.LOAD_LIVE_VIDEOS, loadLiveVideos),
    yield takeLatest(types.LOAD_POSTS_IN_CATEGORY, loadCategoryPosts),
    yield takeLatest(types.LOAD_SUBCATEGORIES, loadSubcategories),
    yield takeLatest(types.LOAD_POST, loadPost),
    yield takeLatest(types.LOAD_POSTS_SLUG, loadPostsWithSlug),
    yield takeLatest(types.LOAD_SEARCH_POSTS, loadSearchPosts),
    yield takeLatest(types.ADD_COMMENT, addComment),
    yield takeLatest(types.LOAD_ERROR, handleErrors)
  ]);
}
