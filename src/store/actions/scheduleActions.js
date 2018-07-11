import * as types from '../types/scheduleTypes';

export function loadScheduleAction(schedule_id) {
  return {
    type: types.LOAD_SCHEDULE,
    schedule_id
  };
}

export function loadScheduleByDayAction(day) {
  return {
    type: types.LOAD_DAILY_SCHEDULE,
    day
  };
}

export function loadAllSchedulesAction(page, load_more = false, per_page = 12) {
  return {
    type: types.LOAD_ALL_SCHEDULES,
    page,
    per_page,
    load_more
  };
}
