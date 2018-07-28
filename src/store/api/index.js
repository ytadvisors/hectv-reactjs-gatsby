import axios from 'axios';

export default class MainApi {
  constructor({ apiUrl }) {
    apiUrl = apiUrl || process.env.WP_HOST;
    const prefix = '/wp-json/wp/v2/';

    this.root_api = axios.create({
      baseURL: apiUrl,
      timeout: 100000
    });

    this.json_api = axios.create({
      baseURL: apiUrl + prefix,
      timeout: 100000
    });
    const user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : {};

    if (user.token && user.token !== '') {
      this.root_api.defaults.headers.common['Authorization'] =
        'Bearer ' + user.token;
      this.json_api.defaults.headers.common['Authorization'] =
        'Bearer ' + user.token;
    }
  }
}