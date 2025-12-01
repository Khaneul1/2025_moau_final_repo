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

const refreshTokensRequest = async currentRefreshToken => {
  if (!currentRefreshToken) {
    throw new Error('No refresh token available');
  }

  const plain = axios.create({
    baseURL: 'https://moau.store/api',
    timeout: 15000,
  });

  const res = await plain.post('/auth/refresh', {
    refreshToken: currentRefreshToken,
  });

  return res.data;
};

// 401/403 에러 처리 및 토큰 재발급
api.interceptors.response.use(
  response => response,
  async error => {
    // console.error('Axios 요청 실패: ', error.config?.url, error.message);
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

      //   try {
      //     const { accessToken, success } = await refreshAccessToken();

      //     if (!success) throw new Error('refresh failed');

      //     useAuthStore.getState().setAccessToken(accessToken);
      //     processQueue(null, accessToken);
      //     originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      //     return api(originalRequest);
      //   } catch (refreshError) {
      //     processQueue(refreshError, null);

      //     console.error('리프레시 토큰 만료. 로그아웃 필요.');
      //     useAuthStore.getState().logout();
      //     return Promise.reject(refreshError);
      //   } finally {
      //     isRefreshing = false;
      //   }
      // }

      try {
        const currentRefreshToken = useAuthStore.getState().refreshToken;
        if (!currentRefreshToken) throw new Error('Refresh token이 없습니다.');

        const data = await refreshTokensRequest(currentRefreshToken);
        const { accessToken, refreshToken: newRefreshToken } = data;

        if (!accessToken)
          throw new Error('백엔드에서 accessToken이 반환되지 않았습니다');

        // Save tokens to store and local storage (saveTokens handles AsyncStorage write)
        await saveTokens(accessToken, newRefreshToken);

        // update zustand state (in case saveTokens didn't)
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('리프레시 토큰 만료. 로그아웃 처리합니다.', refreshError);
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
