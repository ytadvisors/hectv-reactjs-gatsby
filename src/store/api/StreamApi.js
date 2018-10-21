import MainApi from './index';

export default class StreamApi extends MainApi {
  constructor(props = {}) {
    super(props);
  }

  startStreaming = () => {
    return this.root_api.get(`/wp-json/hectv/v1/startstream`);
  };
}