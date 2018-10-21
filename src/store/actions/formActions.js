import * as types from '../types/formTypes';

export const loadUserValues = (values) => {
  return {
    type: types.LOAD_USER_VALUES,
    values
  };
};

export const loadAboutValues = (values) => {
  return {
    type: types.LOAD_ABOUT_VALUES,
    values
  };
};

export const loadScheduleValues = (values) => {
  return {
    type: types.LOAD_SCHEDULE_VALUES,
    values
  };
};
