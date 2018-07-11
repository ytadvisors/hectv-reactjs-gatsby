import * as types from '../types/donateTypes';

export function loadDonationAction(donation_id) {
  return {
    type: types.LOAD_DONATION,
    donation_id
  };
}

export function loadAllDonationsAction(page, load_more = false, per_page = 12) {
  return {
    type: types.LOAD_ALL_DONATIONS,
    page,
    per_page,
    load_more
  };
}
