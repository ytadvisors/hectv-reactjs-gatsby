import MainApi from './index';

export default class MagazineApi extends MainApi {
  constructor({ apiUrl }) {
    super(apiUrl);
  }

  getType(slug) {
    return this.json_api.get(`type?slug=${slug}`);
  }

  getAllMagazines(type_list = [], page = 1, per_page = 5) {
    if (type_list.length === 0)
      return this.json_api.get(`magazine?per_page=${per_page}&page=${page}`);
    else {
      const query = type_list.join('&type[]=');
      return this.json_api.get(
        `magazine?per_page=${per_page}&page=${page}&type[]=${query}`
      );
    }
  }

  getMagazineBySlug(slug) {
    return this.json_api.get(`magazine?slug=${slug}`);
  }

  getMagazine(magazine_id) {
    return this.json_api.get(`magazine/${magazine_id}`);
  }
}
