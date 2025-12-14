import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import RegularText from '../../../components/customText/RegularText';
import LinearGradient from 'react-native-linear-gradient';
import acceptIcon from '../../../assets/img/acceptIcon.png';
import standbyIcon from '../../../assets/img/standbyIcon.png';
import refusalIcon from '../../../assets/img/refusalIcon.png';
import BoldText from '../../../components/customText/BoldText';

const RequestAccept = ({ navigation }) => {
  const route = useRoute();
  const { receipt, group } = route.params;

  const [desc, setDesc] = useState('');

  return (
    <LinearGradient
      colors={['#7242E2', '#B49BF0', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.97 }}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.navContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require('../../../assets/img/backIcon.png')}
                style={styles.backIconStyle}
              />
            </TouchableOpacity>
            <BoldText style={styles.pageName}>영수증 승인 요청</BoldText>
          </View>

          <View style={styles.topContainer}>
            <View style={styles.container}>
              <Image
                source={require('../../../assets/img/noticeCheckPurpleIcon.png')}
                style={styles.stateIcon}
              />
              <SemiBoldText style={styles.stateMessage}>
                영수증 승인 요청 완료
              </SemiBoldText>
              <View style={styles.dashedLine} />

              <View style={styles.receiptDetailCard}>
                <View style={styles.receiptInfoLeft}>
                  <SemiBoldText style={styles.rightText}>가맹점</SemiBoldText>
                  <SemiBoldText style={styles.rightText}>결제금액</SemiBoldText>
                </View>

                {/* 목업 데이터 입력할 것 */}
                <View style={styles.receiptInfoRight}>
                  <SemiBoldText style={styles.leftText}>
                    {receipt.place}
                  </SemiBoldText>
                  <SemiBoldText style={styles.amountText}>
                    {receipt.amount.toLocaleString()}원
                  </SemiBoldText>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.receiptDetailCard}>
                <View style={styles.receiptInfoLeft}>
                  <SemiBoldText style={styles.rightText}>결제일시</SemiBoldText>
                  <SemiBoldText style={styles.rightText}>결제카드</SemiBoldText>
                  <SemiBoldText style={styles.rightText}>게시자</SemiBoldText>
                </View>

                <View style={styles.receiptInfoRight}>
                  <SemiBoldText style={styles.leftText}>
                    {receipt.date}
                  </SemiBoldText>
                  <SemiBoldText style={styles.leftText}>
                    {receipt.card}
                  </SemiBoldText>
                  <SemiBoldText style={styles.leftText}>
                    {receipt.author}
                  </SemiBoldText>
                </View>
              </View>

              <View style={styles.memoCard}>
                <TextInput
                  placeholder="메모를 남길 수 있어요"
                  value={desc}
                  onChangeText={setDesc}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.requestButton}
            onPress={() =>
              navigation.navigate('GroupAccountDetail', { group, receipt })
            }
          >
            <SemiBoldText style={styles.requestButtonText}>
              승인 요청하기
            </SemiBoldText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default RequestAccept;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    width: 322,
    height: 518,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  gradientContainer: {
    flex: 1,
  },
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navContainer: {
    marginTop: 80,
    flexDirection: 'row',
    marginBottom: 50,
  },
  backIconStyle: {
    width: 37,
    height: 37,
  },
  backButton: {
    width: 50,
    height: 50,
    justifyContent: 'flex-start',
    position: 'absolute',
    left: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  pageName: {
    fontSize: 27,
    color: '#FFFFFF',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    top: 2.7,
  },
  dashedLine: {
    width: '80%',
    borderBottomWidth: 1,
    borderColor: '#B5B2B2',
    borderStyle: 'dashed',
  },
  stateIcon: {
    width: 58,
    height: 58,
    marginBottom: 23,
  },
  stateMessage: {
    color: '#3F5A6F',
    fontSize: 24,
    marginBottom: 15,
  },
  receiptDetailCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 35,
    marginBottom: 10,
    width: '100%',
  },
  receiptInfoLeft: {
    flexDirection: 'column',
  },
  receiptInfoRight: {
    alignItems: 'flex-end',
  },
  rightText: {
    color: '#3F5A6F',
    fontSize: 14,
    marginBottom: 5,
  },
  leftText: {
    color: '#B5B2B2',
    fontSize: 14,
    marginBottom: 5,
  },
  amountText: {
    color: '#7242E2',
    fontSize: 14,
    marginBottom: 5,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: '#B5B2B2',
    borderRadius: 0.5,
    width: '80%',
    marginTop: -10,
  },
  memoCard: {
    borderWidth: 1,
    borderColor: '#B5B2B2',
    borderRadius: 20,
    // paddingHorizontal: 65,
    // paddingVertical: 23,
    marginTop: 35,
    width: 264,
    height: 63,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descText: {
    color: '#B5B2B2',
    fontFamily: 'Freesentation-6SemiBold',
  },
  refusalReason: {
    color: '#FF0000',
    marginBottom: 20,
    fontSize: 14,
  },
  requestButton: {
    backgroundColor: '#7242E2',
    width: 316,
    height: 61,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    alignSelf: 'center',
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 25,
  },
});
