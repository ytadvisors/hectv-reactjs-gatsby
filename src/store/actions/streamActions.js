import * as types from '../types/streamTypes';

//LOAD
export const startStreamingAction = (payload = {}) => {
  return {
    type: types.START_STREAMING,
    payload
  };
};

//UPDATE
export const stopStreamAction = (payload = {}) => {
  return {
    type: types.STOP_STREAMING,
    payload
  };
};
