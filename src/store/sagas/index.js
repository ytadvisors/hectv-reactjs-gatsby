import pageSagas from './pageSagas';
import accountSagas from './accountSagas';
import eventSagas from './eventSagas';
import donateSagas from './donateSagas';
import magazineSagas from './magazineSagas';
import scheduleSagas from './scheduleSagas';
import postSagas from './postSagas';
import streamSagas from './streamSagas';
import { all } from 'redux-saga/effects';

export default function* mainSaga() {
  yield all([
    pageSagas(),
    streamSagas(),
    postSagas(),
    accountSagas(),
    eventSagas(),
    donateSagas(),
    scheduleSagas(),
    magazineSagas()
  ]);
}
