import { Alert } from 'react-native';

import { call, put, select } from 'redux-saga/effects';

import {
  request_fetchSchedules,
  request_fetchProvinces,
  request_fetchCities,
} from '../requests/application';

import {
  setFetchingSchedules,
  setSchedules,
  setFetchingProvinces,
  setProvinces,
  setFetchingCities,
  setCities,
} from '../../reducers/application/actions';

import getSession from './_session';

export function* handle_fetchSchedules(action: any) {
  try {
    yield put(setFetchingSchedules(true));

    let session = yield select(getSession);
    let res = yield call(request_fetchSchedules, {session, ...action});
    if (res?.data) yield put(setSchedules(res?.data));

    yield put(setFetchingSchedules(false));

  }
  catch(err) {
    yield put(setFetchingSchedules(false));
    Alert.alert('Alert', err?.message);
  }
};

export function* handle_fetchProvinces(action: any) {
  try {
    yield put(setFetchingProvinces(true));

    let session = yield select(getSession);
    let res = yield call(request_fetchProvinces, {session, ...action});
    if (res?.data) yield put(setProvinces(res?.data));

    yield put(setFetchingProvinces(false));

  }
  catch(err) {
    yield put(setFetchingProvinces(false));
    Alert.alert('Alert', err?.message);
  }
};

export function* handle_fetchCities(action: any) {
  try {
    yield put(setFetchingCities(true));

    let session = yield select(getSession);
    let res = yield call(request_fetchCities, {session, ...action});
    if (res?.data) yield put(setCities(res?.data));

    yield put(setFetchingCities(false));

  }
  catch(err) {
    yield put(setFetchingCities(false));
    Alert.alert('Alert', err?.message);
  }
};
