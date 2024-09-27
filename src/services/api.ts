import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { BASE_URL } from './config';
import { store } from "./store";

function getCreatedAt(config: AxiosRequestConfig<any>) {
  const state = store.getState();
  const createdAt = state?.user?.createdAt ?? "";
  if (createdAt && config) {
    config.headers['CreatedAt'] = createdAt;
  }
}

const api = (token: string, _createdBy?: string): AxiosInstance => {
  const state = store.getState();
  const createdBy = _createdBy || "";
  const createdAtStore = state?.user?.createdAt ?? "";
  const createdAt = createdBy || createdAtStore || "ntc-region10";

  const instance = Axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      CreatedAt: createdAt,
    }
  });

  // Add a request interceptor
  instance.interceptors.request.use(
      function (config) {
        getCreatedAt(config);
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
  );

  // Add a response interceptor
  instance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        return Promise.reject(error);
      }
  );

  return instance;
}

export default api;
