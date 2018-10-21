import * as types from '../types/postTypes';

const initialState = {
  selected_video: {},
  category: '',
  posts: [],
  category_posts: [],
  comments: [],
  post_list: [],
  subcategories: [],
  current_page: 1,
  post: {},
  live_videos: [],
  num_results: {
    posts: 0,
    post_list: 0,
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
        posts: action.load_more ? [...state.posts, ...action.posts]
          : action.posts,
        current_page: action.current_page,
        num_results: {
          ...state.num_results,
          posts: action.num_results
        },
        error: false
      };
    case types.SET_SUBCATEGORIES:
      return {
        ...state,
        subcategories: action.load_more
          ? [...state.subcategories, ...action.subcategories]
          : action.subcategories,
        num_results: {
          ...state.num_results,
          subcategories: action.num_results
        },
        error: false
      };
    case types.SET_POST:
      return {
        ...state,
        post: action.load_more ? [...state.post, ...action.post] : action.post,
        error: false
      };
    case types.SET_POSTS_IN_CATEGORY:
      return {
        ...state,
        category_posts: action.load_more
          ? [...state.category_posts, ...action.category_posts]
          : action.category_posts,
        num_results: {
          ...state.num_results,
          category_posts: action.num_results
        },
        error: false
      };
    case types.SET_LIVE_VIDEOS:
      return {
        ...state,
        live_videos: action.live_videos
      };

    //Errors
    case types.LOAD_ERROR:
      return {
        ...state,
        error: true
      };
    default:
      return state;
  }
}
