import axios from 'axios';
import { TEST_BASE_URL, LINE_BASE_URL } from '../constants/constant';
import { ToastController } from '../components/modal/ToastModal';
import { store } from '../redux/persist';

export const TIMEOUT_LIMIT = 60 * 1000;

const instance = axios.create({
  baseURL: LINE_BASE_URL,
  timeout: TIMEOUT_LIMIT,
});

instance.interceptors.request.use(
  config => {
    config.cancelToken = new axios.CancelToken(cancel => {
      setTimeout(() => cancel('Connect timeout'), config.timeout);
    });
    const userToken = store.getState().user.token;
    if (config.params.auth && userToken) {
      // console.log('token: ', store.getState().user.token);
      config.headers.Authorization = 'Bearer ' + userToken;
    }

    console.log(config.baseURL + config.url + ' => params: ' + JSON.stringify(config.params));
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

instance.interceptors.response.use(
  response => {
    // console.log("=> response: " + JSON.stringify(response.data));

    const res = response.data;

    // console.log(res);

    if (res.code !== 0) {
      ToastController.showError(res.message || 'Error');
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  err => {
    if (err.message === 'Network Error') {
      // ToastController.showError('Network error, please check the network');
    } else {
      ToastController.showError(err.message);
    }
    return Promise.reject(err);
  },
);

export default instance;
