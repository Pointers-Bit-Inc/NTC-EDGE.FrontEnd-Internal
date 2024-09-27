import api from '@config/api';
import { storeCredentials } from '@hooks/useBiometrics';
import { JSONfn } from '@/src/utils/formatting';

export function request_loginUser(data: any) {
  return api(null, '')
    .post('/signin', data)
    .then((res: any) => {
      storeCredentials(res.data.email, data.password);
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      err = JSONfn.parse(JSONfn.stringify(err));
      return {
        status: err?.status,
        msg: err?.message,
      };
    });
};

export function request_register(data: any) {
  return api(null, '')
    .post('/users', data)
    .then((res: any) => {
      storeCredentials(res.data.email, data.password);
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      err = JSONfn.parse(JSONfn.stringify(err));
      return {
        status: err?.status,
        msg: err?.message,
      };
    });
};

export function request_updateUserProfile(data: any) {
  let { session, payload } = data;
  return api(session?.token, '')
    .patch(`/users/${session?._id}`, payload)
    .then((res: any) => {
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      err = JSONfn.parse(JSONfn.stringify(err));
      return {
        status: err?.status,
        msg: err?.message,
      };
    });
};

export function request_updateUserPhoto(data: any) {
  let { session, payload } = data;
  return api(session?.token, null, true)
    .post(`/users/${session._id}/upload-photo`, payload)
    .then((res: any) => {
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      err = JSONfn.parse(JSONfn.stringify(err));
      return {
        status: err?.status,
        msg: err?.message,
      };
    });
};

export function request_changePassword(data: any) {
  let { session, payload } = data;
  return api(session?.token, '')
    .patch(`/users/${session._id}/change-password`, payload)
    .then((res: any) => {
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      err = JSONfn.parse(JSONfn.stringify(err));
      return {
        status: err?.status,
        msg: err?.message,
      };
    });
};