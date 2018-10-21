import * as types from '../types/streamTypes';

const initialState = {
  stream : {},
  time : "",
  error : false
};


export default (state = initialState, action) => {

  switch (action.type) {
    case types.START_STREAMING:
      return {
        ...state
      };
    case types.SET_STREAM:
      return {
        ...state,
        stream: action.data,
        time : action.time
      };
    case types.LOAD_ERROR:
      return {
        ...state,
        error: true
      };
    default:
      return state;
  }

}