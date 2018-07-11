import * as types from '../types/scheduleTypes';

const initialState = {
  schedules: [],
  schedule: [],
  num_results: {
    schedule: 0,
    schedules: 0
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_ALL_SCHEDULES:
    case types.LOAD_SCHEDULE:
    case types.LOAD_DAILY_SCHEDULE:
      return {
        ...state,
        error: false
      };

    //Results
    case types.SET_ALL_SCHEDULES:
      return {
        ...state,
        schedules: action.load_more
          ? [...state.schedules, ...action.schedules]
          : action.schedules,
        num_results: {
          ...state.num_results,
          schedules: action.num_results
        },
        error: false
      };
    case types.SET_SCHEDULE:
      return {
        ...state,
        schedule: action.load_more
          ? [...state.schedule, ...action.schedule]
          : action.schedule,
        error: false
      };
    case types.SET_DAILY_SCHEDULE:
      return {
        ...state,
        schedule: action.load_more
          ? [...state.schedule, ...action.schedule]
          : action.schedule,
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
