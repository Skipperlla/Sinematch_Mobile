import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosResponse } from 'axios';

import { StorageKeys, baseURL } from '@app/constants';

const client = axios.create({
  baseURL: `${baseURL}/api/v1/user`,
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
});

client.interceptors.request.use(
  async (request) => {
    const token = await AsyncStorage.getItem(StorageKeys.accessToken);
    if (token) request.headers.Authorization = `Bearer ${token}`;
    return request;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default client;
