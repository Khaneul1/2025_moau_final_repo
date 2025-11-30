import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { refreshAccessToken, logout } from '../services/authService';

const api = axios.create({
  baseURL: 'https://moau.store/api',
  timeout: 5000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API 요청 - 토큰 포함:', config.url);
    } else {
      console.warn('API 요청 - 토큰 없음:', config.url);
    }

    return config;
  },
  error => Promise.reject(error),
);

// 401/403 에러 처리 및 토큰 재발급
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    //401 에러 + 토큰 재발급이 아직 진행 중이 아닐 때
    if (error.response?.status === 401 && !originalRequest._retry) {
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
        const { accessToken, success } = await refreshAccessToken();

        if (!success) throw new Error('refresh failed');

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        console.error('리프레시 토큰 만료. 로그아웃 필요.');
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 에러 처리
    if (error.response?.status === 403) {
      console.error('403 Forbidden 에러 발생');
      console.error('요청 URL:', error.config?.url);
      console.error('요청 헤더:', error.config?.headers);
      console.error('응답 데이터:', error.response?.data);

      // 토큰 확인
      const token = useAuthStore.getState().accessToken;
      console.error(
        '현재 저장된 토큰:',
        token ? `${token.substring(0, 12)}...` : '없음',
      );
    }

    return Promise.reject(error);
  },
);

export default api;
