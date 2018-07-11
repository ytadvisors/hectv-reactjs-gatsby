import * as types from '../types/formTypes';

export function loadUserValues(values) {
  return {
    type: types.LOAD_USER_VALUES,
    values
  };
}

export function loadAboutValues(values) {
  return {
    type: types.LOAD_ABOUT_VALUES,
    values
  };
}

export function loadScheduleValues(values) {
  return {
    type: types.LOAD_SCHEDULE_VALUES,
    values
  };
}
