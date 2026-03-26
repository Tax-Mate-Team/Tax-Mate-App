import Axios, { type AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL =
  'http://taxmate-prod.us-east-1.elasticbeanstalk.com';

export const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// 토큰 리프레시 인터셉터
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const raw = await AsyncStorage.getItem('taxmate_auth');
        if (!raw) throw new Error('No auth');
        const auth = JSON.parse(raw);

        const { data } = await Axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken: auth.refreshToken,
        });

        const newAuth = {
          ...auth,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        };
        await AsyncStorage.setItem('taxmate_auth', JSON.stringify(newAuth));
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAuth.accessToken}`;

        processQueue(null, newAuth.accessToken);
        originalRequest.headers.Authorization = `Bearer ${newAuth.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await AsyncStorage.removeItem('taxmate_auth');
        delete axiosInstance.defaults.headers.common.Authorization;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
