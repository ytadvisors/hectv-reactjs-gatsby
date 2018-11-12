import * as types from '../types/postTypes';

const initialState = {
  selected_video: {},
  category: '',
  posts: [],
  category_posts: [],
  comments: [],
  postList: [],
  subcategories: [],
  currentPage: 1,
  post: {},
  liveVideos: [],
  numResults: {
    posts: 0,
    postList: 0,
    category_posts: 0,
    subcategories: 0
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_COMMENTS:
    case types.LOAD_ALL_POSTS:
    case types.LOAD_POST:
    case types.LOAD_POSTS_IN_CATEGORY:
    case types.LOAD_SUBCATEGORIES:
    case types.LOAD_LIVE_VIDEOS:
      return {
        ...state,
        error: false
      };

    case types.SET_ALL_POSTS:
      return {
        ...state,
        posts: action.loadMore
          ? [...state.posts, ...action.posts]
          : action.posts,
        currentPage: action.currentPage,
        numResults: {
          ...state.numResults,
          posts: action.numResults
        },
        error: false
      };
    case types.SET_SUBCATEGORIES:
      return {
        ...state,
        subcategories: action.loadMore
          ? [...state.subcategories, ...action.subcategories]
          : action.subcategories,
        numResults: {
          ...state.numResults,
          subcategories: action.numResults
        },
        error: false
      };
    case types.SET_POST:
      return {
        ...state,
        post: action.loadMore ? [...state.post, ...action.post] : action.post,
        error: false
      };
    case types.SET_POSTS_IN_CATEGORY:
      return {
        ...state,
        category_posts: action.loadMore
          ? [...state.category_posts, ...action.category_posts]
          : action.category_posts,
        numResults: {
          ...state.numResults,
          category_posts: action.numResults
        },
        error: false
      };
    case types.SET_LIVE_VIDEOS:
      return {
        ...state,
        liveVideos: action.liveVideos
      };

    // Errors
    case types.LOAD_ERROR:
      return {
        ...state,
        error: true
      };
    default:
      return state;
  }
};
