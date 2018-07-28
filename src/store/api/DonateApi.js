import MainApi from './index';

export default class DonateApi extends MainApi {
  constructor({ apiUrl }) {
    super(apiUrl);
  }

  getAllDonations(page = 1, per_page) {
    return this.json_api.get(`donations?per_page=${per_page}&page=${page}`);
  }

  getDonation(donation_id) {
    return this.json_api.get(`donations/${donation_id}`);
  }
}
