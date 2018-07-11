import * as types from '../types/donateTypes';

const initialState = {
  donations: [],
  donation: {},
  num_results: {
    donation: 0,
    donations: 0
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_ALL_DONATIONS:
    case types.LOAD_DONATION:
      return {
        ...state,
        error: false
      };

    //Results
    case types.SET_ALL_DONATIONS:
      return {
        ...state,
        donations: action.load_more
          ? [...state.donations, ...action.donations]
          : action.donations,
        num_results: {
          ...state.num_results,
          donations: action.num_results
        },
        error: false
      };
    case types.SET_DONATION:
      return {
        ...state,
        donation: action.load_more
          ? [...state.donation, ...action.donation]
          : action.donation,
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
