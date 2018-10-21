import * as types from '../types/scheduleTypes';

export const loadScheduleAction = (schedule_id) => {
  return {
    type: types.LOAD_SCHEDULE,
    schedule_id
  };
};

export const loadScheduleByDayAction = (day) => {
  return {
    type: types.LOAD_DAILY_SCHEDULE,
    day
  };
};

export const loadAllSchedulesAction = (page, load_more = false, per_page = 12) => {
  return {
    type: types.LOAD_ALL_SCHEDULES,
    page,
    per_page,
    load_more
  };
};
