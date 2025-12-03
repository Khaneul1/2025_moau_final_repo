import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import BoldText from '../../components/customText/ExtraBoldText';
import SemiBoldText from '../../components/customText/SemiBoldText';

import { useAuthStore } from '../../store/useAuthStore';

const KakaoLoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const kakaoLogin = useAuthStore(state => state.kakaoLogin);
  const startTokenAutoRefresh = useAuthStore(
    state => state.startTokenAutoRefresh,
  );

  const handleKakaoLogin = async () => {
    setLoading(true);
    try {
      const success = await kakaoLogin();

      if (!success) {
        throw new Error('카카오 로그인 과정에서 오류 발생');
      }

      startTokenAutoRefresh();
      navigation.navigate('UserMain');
    } catch (err) {
      console.error('카카오 로그인 실패: ', err);
      Alert.alert('오류', '로그인 과정에서 문제가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#7242E2', '#B49BF0', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.97 }}
        style={styles.gradientContainer}
      >
        <View style={styles.textContainer}>
          <BoldText style={styles.titleBold}>MOAU</BoldText>
          <SemiBoldText style={styles.subTitle}>
            소규모 일정 회계관리 솔루션{' '}
          </SemiBoldText>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleKakaoLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Image
              source={require('../../assets/kakao/kakao_login_large_wide.png')}
              style={styles.kakaoLoginImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
};

export default KakaoLoginScreen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 300,
    marginTop: 45,
  },
  titleBold: {
    fontSize: 64,
    letterSpacing: 12,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  loginButton: {
    width: '85%',
    height: 59,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  kakaoLoginImage: {
    width: '100%',
    height: '100%',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
