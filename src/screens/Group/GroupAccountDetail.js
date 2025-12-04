import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import BoldText from '../../components/customText/BoldText';
import LinearGradient from 'react-native-linear-gradient';
import NavBar from '../../components/nav/NavBar';
import SemiBoldText from '../../components/customText/SemiBoldText';
import RegularText from '../../components/customText/RegularText';
import { launchCamera } from 'react-native-image-picker';

import useReceiptStore from '../../store/useReceiptStore';

const GroupAccountDetail = ({ navigation, route }) => {
  const { teamId } = route.params;
  const { receipts, loading, fetchReceipts } = useReceiptStore();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchReceipts(teamId);
  }, [teamId]);

  const visibleReceipts = showAll ? receipts : receipts.slice(0, 3);

  //   const [accountData, setAccountData] = useState({
  //     1: {
  //       total: 378900,
  //       recentTransactions: [
  //         {
  //           id: 1,
  //           place: '메가커피 백석대점',
  //           amount: -12000,
  //           date: '2025-10-20 18:00:21',
  //           balance: 378900,
  //         },
  //         {
  //           id: 2,
  //           place: '네이버스토어 스모어가든',
  //           amount: -35000,
  //           date: '2025-09-28 17:05:45',
  //           balance: 390900,
  //         },
  //       ],
  //       image: require('../../assets/groupImg/group1.png'),
  //       accountNum: '3333-19-903-702',
  //       ReceiptImage: [
  //         {
  //           id: 1,
  //           Postimage: require('../../assets/receipts/roman_receipt1.jpg'),
  //           author: '고하늘',
  //           desc: '동아리원 다과비 지출',
  //           date: '2025.10.03 18:14:23',
  //           state: '승인',
  //           place: '메가커피 백석대점',
  //           amount: 35201,
  //           card: '신한카드(0526)',
  //         },
  //         {
  //           id: 2,
  //           Postimage: require('../../assets/receipts/roman_receipt2.png'),
  //           author: '하승현',
  //           desc: '플리마켓 원자재 구매',
  //           date: '2025.09.28 17:15:37',
  //           state: '대기',
  //           place: '네이버스토어 애완돌키우기',
  //           amount: 35201,
  //           card: '신한카드(0526)',
  //         },
  //         {
  //           id: 3,
  //           Postimage: require('../../assets/receipts/roman_receipt3.jpg'),
  //           author: '하승현',
  //           desc: '회비 사용',
  //           date: '2025.09.28 17:15:21',
  //           state: '거절',
  //           place: '쪼다(쪼림닭)',
  //           amount: 35201,
  //           card: '신한카드(0526)',
  //         },
  //       ],
  //     },
  //     2: {
  //       total: 451900,
  //       recentTransactions: [
  //         {
  //           id: 1,
  //           place: '용우동 천안백석대점',
  //           amount: -20560,
  //           date: '2025-10-02 21:00',
  //           balance: 451900,
  //         },
  //         {
  //           id: 2,
  //           place: 'CU 백석대점',
  //           amount: -50000,
  //           date: '2025-09-28 18:00',
  //           balance: 501900,
  //         },
  //       ],
  //       image: require('../../assets/groupImg/group2.png'),
  //       accountNum: '352-1306-5538-21',
  //       ReceiptImage: [
  //         {
  //           id: 1,
  //           Postimage: require('../../assets/receipts/goorm_receipt1.webp'),
  //           author: '김효찬',
  //           desc: '동아리원 다과비 지출',
  //           date: '2025.10.03 18:14:39',
  //           state: '승인',
  //           place: '메가커피 백석대점',
  //           amount: 35201,
  //           card: '신한카드(1231)',
  //         },
  //         {
  //           id: 2,
  //           Postimage: require('../../assets/receipts/goorm_receipt2.jpg'),
  //           author: '김종혁',
  //           desc: '플리마켓 원자재 구매',
  //           date: '2025.09.28 17:15:21',
  //           state: '거절',
  //           place: '네이버스토어 naked',
  //           amount: 35201,
  //           card: '신한카드(4095)',
  //         },
  //         {
  //           id: 3,
  //           Postimage: require('../../assets/receipts/goorm_receipt3.jpg'),
  //           author: '김종혁',
  //           desc: '플리마켓 원자재 구매',
  //           date: '2025.09.28 17:15:21',
  //           state: '거절',
  //           place: '쿠팡 타투스티커',
  //           amount: 35201,
  //           card: '카카오뱅크(1298)',
  //         },
  //       ],
  //     },
  //     3: {
  //       total: 451900,
  //       recentTransactions: [
  //         {
  //           id: 1,
  //           place: '코스트코 천안성정점',
  //           amount: -85000,
  //           date: '2025-09-10 17:00',
  //           balance: 451900,
  //         },
  //         {
  //           id: 2,
  //           place: '에이바우트 천안신부점',
  //           amount: -45000,
  //           date: '2025-09-08 11:00',
  //           balance: 496900,
  //         },
  //       ],
  //       image: require('../../assets/groupImg/group3.png'),
  //       accountNum: '1000-552-9806732',
  //       ReceiptImage: [
  //         {
  //           id: 1,
  //           Postimage: require('../../assets/receipts/polaris_receipt1.jpg'),
  //           author: '임예준',
  //           desc: '동아리원 다과비 지출',
  //           date: '2025.10.03 18:14:39',
  //           state: '대기',
  //           place: '메가커피 백석대점',
  //           amount: 35201,
  //           card: '신한카드(0526)',
  //         },
  //         {
  //           id: 2,
  //           Postimage: require('../../assets/receipts/polaris_receipt2.jpg'),
  //           author: '국태양',
  //           desc: '플리마켓 원자재 구매',
  //           date: '2025.09.28 17:15:56',
  //           state: '대기',
  //           place: '네이버스토어 스모어가든',
  //           amount: 23567,
  //           card: '네이버페이',
  //         },
  //         {
  //           id: 3,
  //           Postimage: require('../../assets/receipts/polaris_receipt3.jpeg'),
  //           author: '국태양',
  //           desc: '회식비',
  //           date: '2025.09.28 17:15:56',
  //           state: '거절',
  //           place: '용우동 백석대점',
  //           amount: 32890,
  //           card: 'KB카드(8324)',
  //         },
  //       ],
  //     },
  //   });

  //   const [currentGroupData, setCurrentGroupData] = useState(null);

  //   const getStateColor = state => {
  //     switch (state) {
  //       case '승인':
  //         return '#00A93B';
  //       case '대기':
  //         return '#3197DA';
  //       case '거절':
  //         return '#D60000';
  //       default:
  //         return '#ADADAD';
  //     }
  //   };

  //   useEffect(() => {
  //     setCurrentGroupData(accountData[groupId]);
  //   }, [groupId, accountData]);

  //   if (!currentGroupData) return null;

  const handleDirectPhoto = async () => {
    try {
      await new Promise(res => setTimeout(res, 120)); // 디버거 멈춤 방지

      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: false,
        quality: 0.8,
      });

      if (result.didCancel) return;

      if (result.errorCode || result.errorMessage) {
        console.log('Camera Error:', result);
        return;
      }

      const photo = result.assets?.[0];
      if (!photo) return;

      // 촬영 후 임시 영수증 데이터 구성
      const newReceipt = {
        place: '가맹점 입력 필요',
        amount: 0,
        date: new Date().toISOString(),
        card: '정보 없음',
        author: '작성자',
        imageUri: photo.uri,
      };

      navigation.navigate('RequestAccept', {
        receipt: newReceipt,
        teamId,
      });
    } catch (err) {
      console.log('Camera Launch Exception:', err);
    }
  };

  return (
    <LinearGradient
      colors={['#7242E2', '#C7B4F3', '#FFFFFF']}
      start={{ x: 0, y: 0.07 }}
      end={{ x: 0, y: 0.67 }}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <ScrollView>
          <NavBar />
          <View style={styles.groupAccountContainer}>
            <Image source={group.image} style={styles.groupImage} />
            <BoldText style={styles.accountNumText}>
              {currentGroupData.accountNum}
            </BoldText>
            <BoldText style={styles.totalAmountText}>
              {currentGroupData.total.toLocaleString()} 원
            </BoldText>
          </View>

          <View style={styles.divider} />

          <View style={styles.accountSection}>
            <SemiBoldText style={styles.latestAccountText}>
              최근 거래
            </SemiBoldText>

            {currentGroupData.recentTransactions.map(item => (
              <View key={item.id} style={styles.transactionCard}>
                <View style={styles.transactionLeft}>
                  <SemiBoldText style={styles.placeText}>
                    {item.place}
                  </SemiBoldText>
                  <SemiBoldText style={styles.dateText}>
                    {item.date}
                  </SemiBoldText>
                </View>

                <View style={styles.transactionRight}>
                  <SemiBoldText style={styles.amountText}>
                    {Math.abs(item.amount).toLocaleString()}원
                  </SemiBoldText>
                  <SemiBoldText style={styles.balanceText}>
                    잔액 {item.balance.toLocaleString()}원
                  </SemiBoldText>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() =>
                navigation.navigate('RecentTransaction', { groupId, groupName })
              }
            >
              <RegularText style={styles.detailText}>자세히</RegularText>
            </TouchableOpacity>
          </View>

          <View style={styles.receiptSection}>
            <SemiBoldText style={styles.latestAccountText}>
              업로드된 영수증
            </SemiBoldText>
            {loading ? null : receipts.length === 0 ? (
              <SemiBoldText style={styles.noReceiptText}>
                업로드된 영수증이 없습니다.
              </SemiBoldText>
            ) : (
              <>
                {visibleReceipts.map(receipt => (
                  <TouchableOpacity
                    key={receipt.receiptId}
                    style={styles.receiptCard}
                    onPress={() =>
                      navigation.navigate('ReceiptDetail', {
                        teamId,
                        receiptId: receipt.receiptId,
                      })
                    }
                  >
                    <Image
                      source={{ uri: receipt.thumbnailUrl }}
                      style={styles.receiptImage}
                    />
                    <View style={styles.authorCard}>
                      <SemiBoldText style={styles.authorName}>
                        {receipt.authorName || '작성자'}
                      </SemiBoldText>
                      <SemiBoldText style={styles.receiptDesc}>
                        {receipt.title || '제목 없음'}
                      </SemiBoldText>
                      <RegularText style={styles.receiptDate}>
                        {receipt.createdAt?.slice(0, 10) || ''}
                      </RegularText>
                    </View>
                    <SemiBoldText
                      style={[
                        styles.stateText,
                        { color: getStateColor(receipt.state) },
                      ]}
                    >
                      {receipt.state}
                    </SemiBoldText>
                  </TouchableOpacity>
                ))}
                {!showAll && receipts.length > 3 && (
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      navigation.navigate('ReceiptList', { teamId })
                    }
                  >
                    <RegularText style={styles.detailText}>자세히</RegularText>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleDirectPhoto}
            >
              <SemiBoldText style={styles.buttonTextStyle}>
                영수증 촬영
              </SemiBoldText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default GroupAccountDetail;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  divider: {
    width: '100%',
    height: 6,
    backgroundColor: '#EFEFEF',
    marginTop: 30,
  },
  groupImage: {
    width: 85,
    height: 85,
  },
  groupAccountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountNumText: {
    color: '#EEE7FF',
    fontSize: 15,
    marginTop: 20,
  },
  totalAmountText: {
    fontSize: 35,
    color: '#FFFFFF',
    marginTop: 14,
  },
  accountSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  latestAccountText: {
    fontSize: 18,
    color: '#7242E2',
    marginTop: 20,
    marginBottom: 20,
  },
  recentSection: {
    shadowColor: '#000000',
    shadowOffset: { x: 0, y: 4 },
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  transactionLeft: {
    flexDirection: 'column',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  placeText: {
    fontSize: 18,
    color: '#3E247C',
    marginBottom: 4,
  },
  dateText: {
    color: '#ADADAD',
    fontSize: 11.5,
  },
  amountText: {
    fontSize: 18,
    color: '#7242E2',
    marginBottom: 4,
  },
  balanceText: {
    color: '#ADADAD',
    fontSize: 11.5,
  },
  detailButton: {
    backgroundColor: '#F1F1F1',
    width: 341,
    height: 26,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  detailText: {
    color: '#ADADAD',
    fontSize: 16,
    fontWeight: '600',
  },

  // 영수증 리스트...
  receiptSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  receiptCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  receiptImage: {
    width: 110,
    height: 91,
    borderWidth: 1.2,
    borderColor: '#ADADAD',
    borderRadius: 9,
  },
  authorCard: {
    marginLeft: -20,
  },
  authorName: {
    color: '#3E247C',
    fontSize: 17,
    marginBottom: 3,
  },
  receiptDesc: {
    color: '#ADADAD',
    fontSize: 14,
    marginBottom: 3,
  },
  receiptDate: {
    color: '#ADADAD',
    fontSize: 12,
  },
  stateText: {
    alignSelf: 'flex-start',
    fontSize: 16,
  },
  buttonSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  buttonStyle: {
    backgroundColor: '#7242E2',
    width: 316,
    height: 61,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    fontSize: 25,
  },

  container: {
    marginTop: 60,
  },
});
