import * as types from '../types/eventTypes';

export const loadEventAction = (event_id) =>{
  return {
    type: types.LOAD_EVENT,
    event_id
  };
};

export const loadEventListAction = (event_day = '') =>{
  return {
    type: types.LOAD_EVENT_LIST,
    event_day
  };
};

export const loadAllEventsAction = (
  event_types = [],
  event_day = '',
  page,
  load_more = false,
  per_page = 12
) => {
  return {
    type: types.LOAD_ALL_EVENTS,
    event_types,
    event_day,
    page,
    per_page,
    load_more
  };
};

export const loadEventCategoriesAction = (page = 1, per_page = 12) => {
  return {
    type: types.LOAD_EVENT_CATEGORIES,
    page,
    per_page
  };
};
