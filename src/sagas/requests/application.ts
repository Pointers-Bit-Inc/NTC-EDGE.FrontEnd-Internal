import api from '../../services/api'

export function request_saveApplication(data: any) {
  let { session, payload } = data;
  if (payload?.editApplication) {
    let _id = payload?._id;
    delete payload?._id;
    return api(session?.token, '')
      .patch(`/applications/${_id}`, payload)
      .then((res: any) => {
        return {
          status: res?.status,
          data: {...payload, ...res?.data?.doc},
        };
      })
      .catch((err: any) => {
        return {
          status: 'error',
          msg: err?.message,
        };
      });
  }
  return api(session?.token, '')
    .post('/applications', payload)
    .then((res: any) => {
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      return {
        status: 'error',
        msg: err?.message,
      };
    });
};

export function request_fetchApplications(data: any) {
  let { session, payload } = data;
  let { pageSize = 5, page = 1 } = payload;
  payload.pageSize = payload?.pageSize || 5;
  payload.page = payload?.page || 1;
  return api(session?.token, '')
    .get(`/users/${session?._id}/applications?pageSize=${pageSize}&page=${page}`)
    .then((res: any) => {
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      return {
        status: 'error',
        msg: err?.message,
      };
    });
};

export function request_uploadRequirement(data: any) {
  let { session, payload } = data;
  return api(session?.token, null, true)
    .post(`/applications/upload-requirement`, payload)
    .then((res: any) => {
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      return {
        status: 'error',
        msg: err?.message,
      };
    });
}

export function request_fetchRegions(session: any) {
  return api(session?.token, '')
    .get('/regions')
    .then((res: any) => {
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      return {
        status: 'error',
        msg: err?.message,
      };
    });
};

export function request_fetchSchedules(data: any) {
  let { session, payload } = data;
  return api(session?.token, '')
    .get(`/schedules?region=${payload?.regionCode}`)
    .then((res: any) => {
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      return {
        status: 'error',
        msg: err?.message,
      };
    });
};

export function request_fetchProvinces(data: any) {
  let { session, payload } = data;
  return api(session?.token, '')
    .get(`/provinces?region=${payload?.regionCode}`)
    .then((res: any) => {
      let _data = [];
      res?.data?.forEach(a => {
        _data.push({
          label: a.name,
          value: a.provinceCode,
        });
      });
      return {
        status: res?.status,
        data: _data //res?.data,
      };
    })
    .catch((err: any) => {
      return {
        status: 'error',
        msg: err?.message,
      };
    });
};

export function request_fetchCities(data: any) {
  let { session, payload } = data;
  return api(session?.token, '')
    .get(`/cities?province=${payload?.provinceCode}`)
    .then((res: any) => {
      let _data = [];
      res?.data?.forEach(a => {
        _data.push({
          label: a.name,
          value: a.cityCode,
        });
      });
      return {
        status: res?.status,
        data: _data, //res?.data,
      };
    })
    .catch((err: any) => {
      return {
        status: 'error',
        msg: err?.message,
      };
    });
};

export function request_fetchBarangays(data: any) {
  let { session, payload } = data;
  return api(session?.token, '')
    .get(`/barangays?city=${payload?.cityCode}`)
    .then((res: any) => {
      let _data = [];
      res?.data?.forEach(a => {
        _data.push({
          label: a.name,
          value: a.brgyCode,
        });
      });
      return {
        status: res?.status,
        data: _data//res?.data,
      };
    })
    .catch((err: any) => {
      return {
        status: 'error',
        msg: err?.message,
      };
    });
};

export function request_fetchSOA(data: any) {
  let { session, payload } = data;
  return api(session?.token, '')
    .post('/applications/calculate-total-fee', payload)
    .then((res: any) => {
      return {
        status: res?.status,
        data: res?.data,
      };
    })
    .catch((err: any) => {
      return {
        status: 'error',
        msg: err?.message,
      };
    });
}
