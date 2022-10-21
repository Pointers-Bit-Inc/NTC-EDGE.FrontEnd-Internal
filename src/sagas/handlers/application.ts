import { Alert } from 'react-native';

import { call, put, select } from 'redux-saga/effects';

import {
  request_fetchSchedules,
  request_fetchProvinces,
  request_fetchCities, request_uploadRequirement, request_fetchRegions, request_fetchSOA,
} from '../requests/application';

import {
  setFetchingSchedules,
  setSchedules,
  setFetchingProvinces,
  setProvinces,
  setFetchingCities,
  setCities,
  setUploadingRequirement,
  setApplicationItem,
  setFetchingRegions,
  setRegions,
  setFetchingSOA,
  setSOA,
  setFetchSOASuccess, setFetchSOAError,
} from '../../reducers/application/actions';

import getSession from './_session';
export function* handle_uploadRequirement(action: any) {
  try {
    const requirements = action?.payload?.requirements;
    action.payload = action?.payload?.formData;
    const application = yield select(state => state?.application?.applicationItem) || {};
    let key = action?.payload?._parts?.[1]?.[1];
    if(key == undefined){
      key = action?.payload?.has("key") ? action?.payload?.get("key") : undefined
    }
    requirements.forEach((r: any, index: number) => {
      if (key === r?.key) {
        let i = requirements[index].files?.length - 1;
        requirements[index].files[i].uploading = true;
        return;
      }
    });
    yield put(setUploadingRequirement(true));
    let session = yield select(getSession);
    let res = yield call(request_uploadRequirement, {session, ...action});
    let success = res?.status === 200 && !res?.data?.failure;
    requirements.forEach((r: any, index: number) => {
      if (key === r?.key) {
        let i = requirements[index].files?.length - 1;
        requirements[index].files[i].uploading = false;
        requirements[index].files[i].uploaded = success;
        if (success) {
          requirements[index].files[i].links = res?.data || [];
        }
        else {
          requirements[index].files.splice(i, 1);
        }
        return;
      }
    });
    let msg = res?.data?.msg || res?.msg;
    if (!success && msg.match('413')) Alert.alert('File Too Large', 'File size must be lesser than 20MB.');
    else if (!success) Alert.alert('Alert', msg);

    yield put(setUploadingRequirement(false));
    if (success) {
      yield put(setApplicationItem({
        ...application,
        service: {
          ...application?.service,
          applicationType: {
            ...application?.service?.applicationType,
            requirements,
          }
        },
      }));
    }
  }
  catch(err) {
    yield put(setUploadingRequirement(false));
    Alert.alert('Alert', err?.message);
  }
};

export function* handle_fetchRegions() {
  try {
    yield put(setFetchingRegions(true));

    let session = yield select(getSession);
    let res = yield call(request_fetchRegions, session);
    if (res?.data) yield put(setRegions(res?.data));

    yield put(setFetchingRegions(false));

  }
  catch(err) {
    yield put(setFetchingRegions(false));
    Alert.alert('Alert', err?.message);
  }
};
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

export function* handle_fetchSOA(action: any) {
  try {
    yield put(setFetchingSOA(true));

    let session = yield select(getSession);
    let res = yield call(request_fetchSOA, {session, ...action});

    if (res?.status === 200) {
      yield put(setSOA(res?.data));
      yield put(setFetchSOASuccess(true));
    }
    else yield put(setFetchSOAError(true));
    yield put(setFetchingSOA(false));

  }
  catch(err) {
    yield put(setFetchingSOA(false));
    yield put(setFetchSOAError(true));
    Alert.alert('Alert', err?.message);
  }
};
