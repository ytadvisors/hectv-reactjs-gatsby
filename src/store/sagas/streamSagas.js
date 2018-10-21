import { put, takeLatest, all, call, take } from 'redux-saga/effects';
import StreamApi from './../api/StreamApi';
import * as types from '../types/streamTypes';
import _ from 'lodash';
import { eventChannel, END } from "redux-saga";
import {
  getUser
} from './../../utils/session';

/*-----------------
 *
 * LOAD OPERATIONS
 *
 *------------------*/

function setStream(){

  return eventChannel( emitter => {
    const wsUrl = process.env.GATSBY_WS_URL;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('opening...');
      ws.send('hello server')
    };

    ws.onerror = (error) => {
      console.log('WebSocket error ' + error);
      console.dir(error)
    };

    ws.onmessage = event => {
      let data = {};
      try {
        data = JSON.parse(event.data);
        debugger;
        emitter({
          type: types.SET_STREAM,
          data :data,
          time : new Date()
        });

      } catch (e) {

        // Discard "incomplete" json
        // console.log(e.name + ": " + e.message);
      }
    };

    // unsubscribe function
    return () => {
      console.log('Socket off')
    }
  })
}

function* startStreaming(){
  try {
    let api = new StreamApi();
    let user = getUser();
    yield call(api.startStreaming, {token : user.token || "" });

    const channel = yield call(setStream);
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }

  } catch (error) {
    yield put({ type: types.LOAD_ERROR, error });
  }
}

export default function* rootSaga() {
  yield all([
    yield takeLatest(types.START_STREAMING, startStreaming),
  ]);
}