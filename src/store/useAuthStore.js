// import { logout } from '@react-native-seoul/kakao-login';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken as refreshTokenService } from '../services/authService';

// 임시 토큰
const TEMP_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0NDk2NzkwMzEwIiwidHlwIjoiQVQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc2NDUxNzQyNiwiZXhwIjoxNzY0NTE4MzI2fQ.ZIMwPNk61ioC2xc_10dS9DwWw_iG-Ru_3mYmaMxoYwQ';
const TEMP_REFRESH_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0NDk2NzkwMzEwIiwidHlwIjoiUlQiLCJqdGkiOiI2OTk5OWZjNS05ZTM5LTQ5NzEtOWY1YS05MzA4ZDBlYWMwN2MiLCJpYXQiOjE3NjQ1MTc0MjcsImV4cCI6MTc2NTcyNzAyN30.PmXHQc5r5Xbo1NYwIINVgEQZ0yKSL3BmFM_FyVzCWSU';

export const useAuthStore = create(
  // persist(
  (set, get) => ({
    accessToken: TEMP_ACCESS_TOKEN, //사용자 임시 토큰
    refreshToken: TEMP_REFRESH_TOKEN, //임시 리프레시 토큰
    adminToken: null, //그룹 관리자 토큰 (그룹 생성 시 받음)
    _refreshInterval: null,

    setAccessToken: token => set({ accessToken: token }),
    setRefreshToken: token => set({ refreshToken: token }),
    setAdminToken: token => set({ adminToken: token }),

    setTokens: (accessToken, refreshToken) =>
      set({ accessToken, refreshToken }),

    setAllTokens: (accessToken, refreshToken, adminToken) =>
      set({ accessToken, refreshToken, adminToken }),

    logout: () =>
      set({ accessToken: null, refreshToken: null, adminToken: null }),

    startTokenAutoRefresh: () => {
      // const state = get();
      // if (state._refreshInterval) return;

      if (get()._refreshInterval) return;

      const interval = setInterval(async () => {
        console.log('자동 토큰 갱신 시도');

        const result = await refreshTokenService();

        if (!result.success) {
          console.log('자동 갱신 실패 : 로그아웃');
          get().logout();
        } else {
          console.log('토큰 자동 갱신 완료:', result.accessToken);
          get().setAccessToken(result.accessToken);
          if (result.refreshToken) get().setRefreshToken(result.refreshToken);
        }
      }, 4 * 60 * 1000); //4분마다 갱신하기...
      set({ _refreshInterval: interval });
    },
  }),
  {
    name: 'auth-storage',
    storage: createJSONStorage(() => AsyncStorage),
  },
  // ),
);
