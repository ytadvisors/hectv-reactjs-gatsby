import MainApi from './index';

export default class ScheduleApi extends MainApi {
  constructor(props) {
    super(props);
  }

  getAllSchedules(page = 1, per_page) {
    return this.json_api.get(`schedules?per_page=${per_page}&page=${page}`);
  }

  getScheduleByDay(day) {
    return this.json_api.get(`schedules?day=${day}`);
  }

  getSchedule(schedule_id) {
    return this.json_api.get(`schedules/${schedule_id}`);
  }
}
