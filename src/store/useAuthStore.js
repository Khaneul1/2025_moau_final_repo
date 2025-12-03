// import { logout } from '@react-native-seoul/kakao-login';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, logout } from '@react-native-seoul/kakao-login';
import {
  exchangeKakaoToken,
  saveTokens,
  refreshAccessToken,
} from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      adminToken: null,

      nickname: null,
      userId: null,

      loading: false,
      _refreshInterval: null,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUserInfo: (nickname, userId) => set({ nickname, userId }),

      // setAdminToken: adminToken => set({ adminToken }),
      logout: () => {
        clearInterval(get()._refreshInterval);
        set({
          accessToken: null,
          refreshToken: null,
          adminToken: null,
          nickname: null,
          userId: null,
          _refreshInterval: null,
        });
      },

      // 카카오 로그인
      kakaoLogin: async () => {
        set({ loading: true });
        try {
          const result = await login();
          const kakaoAccessToken = result.accessToken;

          const jwt = await exchangeKakaoToken(kakaoAccessToken);

          set({ nickname: jwt.nickname, userId: jwt.userId });

          await saveTokens(jwt.accessToken, jwt.refreshToken);

          return true;
        } catch (err) {
          console.error('카카오 로그인 실패: ', err);
          return false;
        } finally {
          set({ loading: false });
        }
      },

      startTokenAutoRefresh: () => {
        if (get()._refreshInterval) return;

        const interval = setInterval(async () => {
          // const { success, accessToken, refreshToken } =
          //   await refreshAccessToken();

          const response = await refreshAccessToken();
          if (!response.success) {
            get().logout();
            return;
          }
          await saveTokens(response.accessToken, response.refreshToken);
        }, 4 * 60 * 1000);
        set({ _refreshInterval: interval });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
