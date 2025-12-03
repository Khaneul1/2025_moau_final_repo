import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

// jwt 저장
export const saveTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.multiSet([
      ['@accessToken', accessToken],
      ['@refreshToken', refreshToken],
    ]);
    useAuthStore.getState().setTokens(accessToken, refreshToken);
  } catch (err) {
    console.error('토큰 저장 실패', err);
  }
};

export const exchangeKakaoToken = async kakaoAccessToken => {
  try {
    const response = await api.post('/auth/kakao/code/exchange', {
      accessToken: kakaoAccessToken,
    });

    const data = response.data;

    if (!data.accessToken || !data.refreshToken) {
      throw new Error('JWT 응답 형식이 올바르지 않습니다');
    }

    console.log('서버 data :', data);

    return data;
  } catch (err) {
    console.error('카카오 토큰 교환 실패 :', err);
    throw err;
  }
};

// 토큰 재발급
export const refreshAccessToken = async () => {
  try {
    const { refreshToken } = useAuthStore.getState().refreshToken;
    if (!refreshToken) throw new Error('refreshToken 없음');

    const response = await api.post('/auth/refresh', {
      refreshToken,
    });

    const data = response.data;

    const { accessToken, refreshToken: newRefreshToken } = data;

    if (!accessToken) throw new Error('accessToken 없음');

    await saveTokens(accessToken, newRefreshToken);

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
