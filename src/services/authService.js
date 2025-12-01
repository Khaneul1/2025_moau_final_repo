import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

// jwt 저장
export const saveTokens = (accessToken, refreshToken) => {
  // const { setTokens } = useAuthStore.getState();
  // setTokens(accessToken, refreshToken);

  // useAuthStore.getState().setTokens(accessToken, refreshToken);

  const store = useAuthStore.getState();

  const prevRefresh = store.refreshToken;

  store.setTokens(accessToken, refreshToken || prevRefresh);
};

// 토큰 재발급
export const refreshAccessToken = async () => {
  try {
    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      throw new Error('Refresh token이 없습니다.');
    }

    const response = await api.post('/auth/refresh', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (!accessToken) {
      throw new Error('백엔드에서 accessToken이 반환되지 않았습니다');
    }

    saveTokens(accessToken, newRefreshToken ?? null);

    return {
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    console.error('Access token 갱신 실패:', err);
    return { success: false };
  }
};
