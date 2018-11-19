import * as types from '../types/accountTypes';

// LOAD

// CREATE

export const sendContactEmail = values => ({
  type: types.SEND_CONTACT_EMAIL,
  values
});

export const sendEmail = (email, values) => ({
  type: types.SEND_EMAIL,
  email,
  values
});

// UPDATE

// DELETE
