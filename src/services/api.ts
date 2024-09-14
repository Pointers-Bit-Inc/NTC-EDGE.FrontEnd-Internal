import Axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import { BASE_URL } from './config';
import {store} from "./store";

function getCreatedAt(config: AxiosRequestConfig<any>) {
  const state = store.getState();
  const createdAt = state?.user?.createdAt ?? "";
  if (createdAt && config) {
    config.headers['CreatedAt'] = createdAt;
  }
}
let instance: AxiosInstance | null = null;
const api = (token:string, createdBy?: string) => {
  const state = store.getState();
  const createdAtStore = state?.user?.createdAt ?? "";
  if(!instance ){
    instance = Axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(createdBy || createdAtStore ? {CreatedAt: createdBy || createdAtStore} : {})
      }
    });

  }
  else {
    if(instance){
      instance.defaults.headers['Authorization'] = `Bearer ${token}`;
      instance.defaults.headers['Content-type'] =  'application/json';
      if (createdBy || createdAtStore) {
        instance.defaults.headers['CreatedAt'] = createdBy || createdAtStore;
      }
    }
  }


  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
    getCreatedAt(config);
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

  return instance;
}

export default api;