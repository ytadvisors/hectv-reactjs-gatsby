import querystring from 'query-string';
import _ from 'lodash';
import MainApi from './index';

export default class AccountApi extends MainApi {
  constructor({ apiUrl }) {
    super(apiUrl);
  }

  login(email, password) {
    return this.root_api.post(`/wp-json/jwt-auth/v1/token`, {
      username: email,
      password: password
    });
  }

  loadUser() {
    return this.json_api.get(`/users/me`);
  }

  updateUser(user) {
    return this.root_api.put(
      `/wp-json/hectv/v1/users/me`,
      querystring.stringify(user)
    );
  }

  createUser(user) {
    return this.root_api.post(
      `/wp-json/hectv/v1/users`,
      querystring.stringify(user)
    );
  }

  getScheduleWithSlug(slug) {
    return this.json_api.get(
      `/edschedule?slug=${slug}&status[]=draft&status[]=pending&status[]=publish`
    );
  }

  getSchedule(user_id) {
    return this.json_api.get(
      `/edschedule?status[]=draft&status[]=pending&status[]=publish&author=${user_id}`
    );
  }

  getPlayList(user_id) {
    return this.json_api.get(
      `/edplaylist?status[]=draft&status[]=pending&status[]=publish&author=${user_id}`
    );
  }

  getPlayListWithSlug(playlist_id) {
    return this.json_api.get(
      `/edplaylist?slug=${playlist_id}&status[]=draft&status[]=pending&status[]=publish`
    );
  }

  createPlayList(playlist_id, video, title) {
    let params = { slug: playlist_id, 'fields[videos]': video, title: title };

    params['status'] = 'pending';
    let query = querystring.stringify(params);
    return this.json_api.post(`/edplaylist`, query);
  }

  updatePlayList(playlist_id, videos, title) {
    let params = {};
    if (title) params = { title: title };

    let query = querystring.stringify(params);
    query += videos.map(item => `&fields[videos][]=${item}`).join('');

    return this.json_api.put(`/edplaylist/${playlist_id}`, query);
  }

  scheduleProgram(values) {
    const saved = _.keys(values).reduce((result, item) => {
      switch (item) {
        case 'slug':
        case 'title':
        case 'stripe_token':
          result[item] = values[item];
          break;
        case 'connection_type':
          break;
        default:
          //set acf values
          result[`fields[${item}]`] = values[item];
      }
      return result;
    }, {});

    saved['status'] = 'pending';
    let query = querystring.stringify(saved);
    if (values.connection_type && Array.isArray(values.connection_type)) {
      query += values.connection_type
        .map(item => `&fields[connection_type][]=${item}`)
        .join('');
    }

    console.log(values);

    return this.json_api.post(`/edschedule`, query);
  }
}
