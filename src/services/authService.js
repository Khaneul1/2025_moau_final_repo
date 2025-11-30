import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

// const REST_API_KEY = 'e2f36d079866b90e1a76d7dea20892c2';
// const REDIRECT_URI = 'https://moau.store/login/oauth2/code/kakao';

// jwt 저장
export const saveTokens = (accessToken, refreshToken) => {
  const { setTokens } = useAuthStore.getState();
  setTokens(accessToken, refreshToken);
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

    saveTokens(accessToken, newRefreshToken);

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
