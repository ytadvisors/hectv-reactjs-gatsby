import MainApi from './index';

export default class EventApi extends MainApi {
  constructor({ apiUrl }) {
    super(apiUrl);
  }

  getEventType(event_categories = []) {
    const query = event_categories.join('&slug[]=');
    return this.json_api.get(`event_category?slug[]=${query}`);
  }

  getAllEvents(type_list = [], day = '', page = 1, per_page) {
    let day_query = day === '' ? '' : `&day=${day}`;
    if (type_list.length === 0)
      return this.json_api.get(
        `event?per_page=${per_page}&page=${page}${day_query}`
      );
    else {
      const query = type_list.join('&event_category[]=');
      return this.json_api.get(
        `event?per_page=${per_page}&page=${page}&event_category[]=${query}${day_query}`
      );
    }
  }

  getEventsBySlugs(slugs) {
    const query = slugs.join('&slug[]=');
    return this.json_api.get(`event?slug[]=${query}`);
  }

  getEventBySlug(slug) {
    return this.json_api.get(`event?slug=${slug}`);
  }

  getEvent(event_id) {
    return this.json_api.get(`event/${event_id}`);
  }

  getEventCategories(page = 1) {
    return this.json_api.get(`event_category?page=${page}`);
  }
}
