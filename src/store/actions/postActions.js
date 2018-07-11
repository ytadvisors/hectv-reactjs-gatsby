import * as types from '../types/postTypes';

export function loadPostAction(post_id) {
  return {
    type: types.LOAD_POST,
    post_id
  };
}

export function loadSearchPostsAction(terms, page, load_more = false) {
  return {
    type: types.LOAD_SEARCH_POSTS,
    terms,
    page,
    load_more
  };
}
export function loadSubCategoriesAction(category) {
  return {
    type: types.LOAD_SUBCATEGORIES,
    category
  };
}

export function loadAllPostsAction(category = '', page, load_more = false) {
  return {
    type: types.LOAD_ALL_POSTS,
    category,
    page,
    load_more
  };
}
