import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import { useRoute } from '@react-navigation/native';

const generateTransactions = (initialBalance, count) => {
  const places = [
    '메가커피 백석대점',
    'CU 백석대점',
    'GS25 백석로점',
    '스타벅스 천안백석점',
    '네이버스토어 스모어가든',
    '버거킹 백석대점',
    '파리바게뜨 천안신부점',
    '이디야커피 천안백석점',
    '코스트코 천안성정점',
    '롯데마트 천안점',
    '서브웨이 백석대점',
    '세븐일레븐 천안캠퍼스점',
    '이마트 천안서북점',
    '다이소 백석대점',
    '배스킨라빈스 천안두정점',
  ];

  const today = new Date('2025-10-23');
  let transactions = [];
  let randomAmounts = Array.from(
    { length: count },
    () => Math.floor(Math.random() * 99000) + 1000,
  );
  let balance = initialBalance;

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i * 5);

    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    const formattedTime = `${String(randomHour).padStart(2, '0')}:${String(
      randomMinute,
    ).padStart(2, '0')}`;

    const formattedDate = date.toISOString().split('T')[0];
    const place = places[i % places.length];
    const amount = -randomAmounts[i];

    balance += amount;

    transactions.push({
      id: i + 1,
      place,
      amount,
      date: formattedDate,
      time: formattedTime,
      balance: balance,
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const RecentTransaction = ({ route }) => {
  const { teamId, groupName } = route.params;

  const [recentAccountData, setRecentAccountData] = useState({
    1: {
      recentTransactions: generateTransactions(1000000, 10),
    },
    2: {
      recentTransactions: generateTransactions(1000000, 10),
    },
    3: {
      recentTransactions: generateTransactions(1000000, 10),
    },
  });

  const [currentGroupData, setCurrentGroupData] = useState(null);

  useEffect(() => {
    setCurrentGroupData(recentAccountData[teamId]);
  }, [teamId, recentAccountData]);

  if (!currentGroupData) return null;

  return (
    <ScrollView>
      <View style={styles.accountSection}>
        <SemiBoldText style={styles.latestAccountText}>거래 내역</SemiBoldText>
        {currentGroupData.recentTransactions.map(item => (
          <View key={item.id} style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <SemiBoldText style={styles.placeText}>{item.place}</SemiBoldText>
              <View style={styles.dateTimeContainer}>
                <SemiBoldText style={styles.dateText}>{item.date}</SemiBoldText>
                <SemiBoldText style={styles.timeText}>{item.time}</SemiBoldText>
              </View>
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
      </View>
    </ScrollView>
  );
};

export default RecentTransaction;

const styles = StyleSheet.create({
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
    flex: 1,
  },
  latestAccountText: {
    fontSize: 18,
    color: '#3E247C',
    marginTop: 80,
    marginBottom: 20,
    backgroundColor: '#EEE7FF',
    paddingHorizontal: 19,
    paddingVertical: 6,
    borderRadius: 20,
    width: 100,
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
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#ADADAD',
    fontSize: 11.5,
  },
  timeText: {
    color: '#ADADAD',
    fontSize: 11.5,
    marginLeft: 5.5,
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
});
