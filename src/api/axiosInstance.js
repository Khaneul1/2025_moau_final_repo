import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';
import { saveTokens } from '../services/authService';

const api = axios.create({
  baseURL: 'https://moau.store/api',
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

// 요청
api.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().accessToken;

    console.log(`axios header token: ${token}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`API 요청 - 토큰 포함: ${config.url}`);
    } else {
      console.warn(`API 요청 - 토큰 없음: ${config.url}`);
    }

    return config;
  },
  error => Promise.reject(error),
);

const refreshTokensRequest = async refreshToken => {
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const plain = axios.create({
    baseURL: 'https://moau.store/api',
    timeout: 15000,
  });

  const res = await plain.post('/auth/refresh', {
    refreshToken,
  });

  return res.data;
};

// 401/403 에러 처리 및 토큰 재발급
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;

    //401 에러 + 토큰 재발급이 아직 진행 중이 아닐 때
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        //이미 토큰 재발급 중이면 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        const { accessToken, refreshToken: newRefresh } =
          await refreshTokensRequest(refreshToken);

        // const data = await refreshTokensRequest(refreshToken);
        // const { accessToken, refreshToken: newRefresh } = data;

        await saveTokens(accessToken, newRefresh);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 에러 처리
    if (error.response?.status === 403) {
      console.error('403 권한 없음');

      // // 토큰 확인
      // const token = useAuthStore.getState().accessToken;
      // console.error('현재 저장된 토큰: ', token || '없음');
    }

    return Promise.reject(error);
  },
);

export default api;
