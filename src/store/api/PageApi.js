import MainApi from './index';

export default class PageApi extends MainApi {
  constructor(props) {
    super(props);
  }

  getAboutUs() {
    return this.json_api.get('pages?slug=about-us');
  }

  getMenus(id = '') {
    return this.root_api.get(`/wp-json/wp-api-menus/v2/menus/${id}`);
  }

  getPage(pageName) {
    return this.json_api.get(`pages?slug=${pageName}`);
  }

  getTestimonials(page = 1) {
    return this.json_api.get(`testimonial?page=${page}`);
  }

  getPricingPlans() {
    return this.json_api.get(`edplans?order_by=plan_price&order=asc`);
  }

  getLiveVideo() {
    return this.json_api.get(`livevideos`);
  }
}
