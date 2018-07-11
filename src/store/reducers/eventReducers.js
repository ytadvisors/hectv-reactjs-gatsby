import * as types from '../types/eventTypes';

const initialState = {
  events: [],
  related_events: [],
  event_list: [],
  event: {},
  event_categories: [],
  num_results: {
    events: 0,
    event_list: 0,
    related_events: 0
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_ALL_EVENTS:
    case types.LOAD_EVENT:
    case types.LOAD_RELATED_EVENTS:
    case types.LOAD_EVENT_LIST:
    case types.LOAD_EVENT_CATEGORIES:
      return {
        ...state,
        error: false
      };

    //Results
    case types.SET_EVENT_LIST:
      return {
        ...state,
        event_list: action.event_list,
        num_results: {
          ...state.num_results,
          event_list: action.num_results
        },
        error: false
      };
    case types.SET_RELATED_EVENTS:
      return {
        ...state,
        related_events: action.related_events,
        num_results: {
          ...state.num_results,
          related_events: action.num_results
        },
        error: false
      };
    case types.SET_ALL_EVENTS:
      return {
        ...state,
        events: action.load_more
          ? [...state.events, ...action.events]
          : action.events,
        num_results: {
          ...state.num_results,
          events: action.num_results
        },
        error: false
      };
    case types.SET_EVENT:
      return {
        ...state,
        event: action.load_more
          ? [...state.event, ...action.event]
          : action.event,
        error: false
      };
    case types.SET_EVENT_CATEGORIES:
      return {
        ...state,
        event_categories: action.load_more
          ? [...state.event_categories, ...action.event_categories]
          : action.event_categories,
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
