import querystring from 'query-string';
import MainApi from './index';

export default class PostApi extends MainApi {
  constructor({ apiUrl }) {
    super(apiUrl);
  }

  getComments(slug, page = 1) {
    return this.json_api.get(`comments?post=${slug}&page=${page}&order=desc`);
  }

  addComment(params) {
    let query = querystring.stringify(params);
    return this.json_api.post(`comments`, query);
  }

  getSubCategories(parent) {
    return this.json_api.get(`category_list?parent=${parent}`);
  }

  getCategory(slug) {
    return this.json_api.get(`category_list?slug=${slug}`);
  }

  getCategoryById(id) {
    return this.json_api.get(`category_list/${id}`);
  }

  getAllPosts(page_category = '', page = 1) {
    if (page_category === '')
      return this.json_api.get(`posts?per_page=10&page=${page}`);
    else {
      return this.json_api.get(
        `posts?per_page=10&page=${page}&category_list=${page_category}`
      );
    }
  }

  findPosts({terms, page, per_page}) {
    page = page || 1;
    per_page = per_page || 10;

    if (terms === '')
      return this.json_api.get(`posts?per_page=${per_page}&page=${page}`);
    else {
      return this.json_api.get(
        `posts?per_page=${per_page}&page=${page}&search=${terms}`
      );
    }
  }

  getPostList(posts) {
    return this.json_api.get(`posts?slug[]=${posts.join('&slug[]=')}`);
  }

  getPost(post_id) {
    return this.json_api.get(`posts/${post_id}`);
  }

  getCategoriesPosts(category_list = [], page = 1, per_page = 3) {
    return this.json_api.get(
      `posts?per_page=${per_page}&page=${page}&category_list[]=${category_list.join(
        '&category_list[]='
      )}`
    );
  }

  getPostsBySlugs(slugs) {
    const query = slugs.join('&slug[]=');
    return this.json_api.get(`posts?slug[]=${query}`);
  }

  getPostBySlug(slug) {
    return this.json_api.get(`posts?slug=${slug}`);
  }

  getArticles(page = 1) {
    return this.json_api.get(`posts?articles=1&page=${page}`);
  }
}
