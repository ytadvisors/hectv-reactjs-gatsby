import querystring from 'query-string';
import _ from 'lodash';
import MainApi from './index';

export default class AccountApi extends MainApi {
  constructor(props = {}) {
    super(props);
  }

  login = (email, password) =>
    this.rootApi.post(`/wp-json/jwt-auth/v1/token`, {
      username: email,
      password
    });

  loadUser = () => this.jsonApi.get(`/users/me`);

  updateUser = user =>
    this.rootApi.put(`/wp-json/hectv/v1/users/me`, querystring.stringify(user));

  createUser = user =>
    this.rootApi.post(`/wp-json/hectv/v1/users`, querystring.stringify(user));

  getScheduleWithSlug = slug =>
    this.jsonApi.get(
      `/edschedule?slug=${slug}&status[]=draft&status[]=pending&status[]=publish`
    );

  getSchedule = userId =>
    this.jsonApi.get(
      `/edschedule?status[]=draft&status[]=pending&status[]=publish&author=${userId}`
    );

  getPlayList = userId =>
    this.jsonApi.get(
      `/edplaylist?status[]=draft&status[]=pending&status[]=publish&author=${userId}`
    );

  getPlayListWithSlug = playlistId =>
    this.jsonApi.get(
      `/edplaylist?slug=${playlistId}&status[]=draft&status[]=pending&status[]=publish`
    );

  createPlayList = (playlistId, video, title) => {
    const params = { slug: playlistId, 'fields[videos]': video, title };

    params.status = 'pending';
    const query = querystring.stringify(params);
    return this.jsonApi.post(`/edplaylist`, query);
  };

  updatePlayList = (playlistId, videos, title) => {
    let params = {};
    if (title) params = { title };

    let query = querystring.stringify(params);
    query += videos.map(item => `&fields[videos][]=${item}`).join('');

    return this.jsonApi.put(`/edplaylist/${playlistId}`, query);
  };

  scheduleProgram = values => {
    const saved = _.keys(values).reduce((acc, item) => {
      const result = { ...acc };
      switch (item) {
        case 'slug':
        case 'title':
        case 'stripe_token':
          result[item] = values[item];
          break;
        case 'connection_type':
          break;
        default:
          // set acf values
          result[`fields[${item}]`] = values[item];
      }
      return result;
    }, {});

    saved.status = 'pending';
    let query = querystring.stringify(saved);
    if (values.connection_type && Array.isArray(values.connection_type)) {
      query += values.connection_type
        .map(item => `&fields[connection_type][]=${item}`)
        .join('');
    }

    console.log(values);

    return this.jsonApi.post(`/edschedule`, query);
  };
}
