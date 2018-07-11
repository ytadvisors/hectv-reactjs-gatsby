import * as types from '../types/magazineTypes';

const initialState = {
  magazines: [],
  magazine: {},
  magazine_list: [],
  num_results: {
    magazines: 0
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_ALL_MAGAZINES:
    case types.LOAD_MAGAZINE_LIST:
    case types.LOAD_MAGAZINE:
      return {
        ...state,
        error: false
      };

    case types.SET_ALL_MAGAZINES:
      return {
        ...state,
        magazines: action.load_more
          ? [...state.magazines, ...action.magazines]
          : action.magazines,
        num_results: {
          ...state.num_results,
          magazines: action.num_results
        },
        error: false
      };
    case types.SET_MAGAZINE_LIST:
      return {
        ...state,
        magazine_list: action.load_more
          ? [...state.magazine_list, ...action.magazine_list]
          : action.magazine_list,
        error: false
      };
    case types.SET_MAGAZINE:
      return {
        ...state,
        magazine: action.load_more
          ? [...state.magazine, ...action.magazine]
          : action.magazine,
        error: false
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
