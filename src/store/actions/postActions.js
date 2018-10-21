import * as types from '../types/postTypes';

export const loadPostAction = (post_id) => {
  return {
    type: types.LOAD_POST,
    post_id
  };
};

export const loadLiveVideosAction = () => {
  return {
    type: types.LOAD_LIVE_VIDEOS
  };
};

export const loadSearchPostsAction = (apiUrl, terms, page, load_more = false) => {
  return {
    type: types.LOAD_SEARCH_POSTS,
    apiUrl,
    terms,
    page,
    load_more
  };
};

export const loadSubCategoriesAction = (category) => {
  return {
    type: types.LOAD_SUBCATEGORIES,
    category
  };
};

export const loadAllPostsAction = (category = '', page, load_more = false) => {
  return {
    type: types.LOAD_ALL_POSTS,
    category,
    page,
    load_more
  };
};
