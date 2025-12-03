import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
// import {groupReceiptData} from '../../data/receipts';
import SemiBoldText from '../../components/customText/SemiBoldText';
import BoldText from '../../components/customText/BoldText';

import { getGroup, joinGroupByCode } from '../../services/groupService';

const ManagerMain = ({ navigation, route }) => {
  const teamId = route?.params?.teamId;
  //   const groupData = groupReceiptData[groupId] || [];
  //   const receiptList = groupData.receipts;
  //   const groupName = groupData.groupName;
  //   const groupImage = groupData.groupImage;
  //   const requestCount = receiptList.length;

  const [groupInfo, setGroupInfo] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  //   const [pendingReceipts, setPendingReceipts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const group = await getGroup(teamId);
        setGroupInfo(group);

        const reqs = await joinGroupByCode(teamId);
        setJoinRequests(reqs);

        // const receipts = await getPendingReceipts(teamId);
        // setPendingReceipts(receipts);
      } catch (err) {
        console.error('MangerMain 로딩 에러: ', err);
      }
    })();
  }, []);

  if (!groupInfo) return null;

  return (
    <LinearGradient
      colors={['#7242E2', '#C7B4F3', '#FFFFFF']}
      start={{ x: 0, y: 0.07 }}
      end={{ x: 0, y: 0.67 }}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.navContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require('../../assets/img/backIcon.png')}
                style={styles.backIconStyle}
              />
            </TouchableOpacity>
            <BoldText style={styles.groupName}>{groupInfo.name}</BoldText>
          </View>

          <View style={styles.groupInfoCard}>
            <Image source={groupInfo.image} style={styles.groupImg} />
            <TouchableOpacity
              style={styles.acceptConfirmButton}
              onPress={() => navigation.navigate('RequestJoin', { teamId })}
            >
              <SemiBoldText style={styles.groupRequestText}>
                그룹 승인 요청 {joinRequests.length}
              </SemiBoldText>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.secondContainer}>
            <View style={styles.receiptSection}>
              <SemiBoldText style={styles.textSection}>
                승인 요청된 영수증 {requestCount}
              </SemiBoldText>
              {receiptList.slice(0, 2).map(receipt => (
                <TouchableOpacity
                  key={receipt.id}
                  style={styles.receiptCard}
                  onPress={() =>
                    navigation.navigate('ReqReceiptDetail', {
                      place: receipt.place,
                      amount: receipt.amount,
                      date: receipt.date,
                      card: receipt.card,
                      author: receipt.author,
                      desc: receipt.desc,
                    })
                  }
                >
                  <Image
                    source={receipt.Postimage}
                    style={styles.receiptImage}
                  />

                  <View style={styles.authorCard}>
                    <SemiBoldText style={styles.authorName}>
                      {receipt.author}
                    </SemiBoldText>
                    <SemiBoldText style={styles.receiptDesc}>
                      {receipt.desc}
                    </SemiBoldText>
                    <SemiBoldText style={styles.receiptDate}>
                      {receipt.date}
                    </SemiBoldText>
                  </View>
                  <Image
                    source={require('../../assets/img/receiptCheckIcon.png')}
                    style={styles.receiptCheck}
                  />
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.moreButton}
                onPress={() =>
                  navigation.navigate('ReqReceiptList', {
                    groupId,
                    receiptList,
                    requestCount,
                  })
                }
              >
                <SemiBoldText style={styles.moreText}>자세히</SemiBoldText>
              </TouchableOpacity>
            </View>

            <SemiBoldText style={styles.listText}>회비 관리</SemiBoldText>
            <View style={styles.accountingSection}>
              <View style={styles.noticeCard}>
                <Image
                  source={require('../../assets/img/accountingIcon.png')}
                  style={styles.IconStyle}
                />
                <View style={styles.noticeContainer}>
                  <SemiBoldText style={styles.accountText}>
                    우리 그룹의 회비, 누가 냈는지 체크해 볼까요?
                  </SemiBoldText>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      navigation.navigate('AccountManage', { groupId })
                    }
                  >
                    <SemiBoldText style={styles.detailButtonStyle}>
                      더보기
                    </SemiBoldText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <SemiBoldText style={styles.listText}>공지 게시</SemiBoldText>
            <View style={styles.accountingSection}>
              <View style={styles.noticeCard}>
                <Image
                  source={require('../../assets/img/communityIcon.png')}
                  style={styles.IconStyle}
                />
                <View style={styles.noticeContainer}>
                  <SemiBoldText style={styles.accountText}>
                    공지를 게시해 보세요
                  </SemiBoldText>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      navigation.navigate('NoticePost', { groupId })
                    }
                  >
                    <SemiBoldText style={styles.detailButtonStyle}>
                      바로가기
                    </SemiBoldText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <SemiBoldText style={styles.listText}>회원 관리</SemiBoldText>
            <View style={styles.accountingSection}>
              <View style={styles.noticeCard}>
                <Image
                  source={require('../../assets/img/memberManage.png')}
                  style={styles.IconStyle}
                />
                <View style={styles.noticeContainer}>
                  <SemiBoldText style={styles.accountText}>
                    우리 그룹의 회원을 관리해 봐요
                  </SemiBoldText>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      navigation.navigate('MemberManage', { groupId })
                    }
                  >
                    <SemiBoldText style={styles.detailButtonStyle}>
                      바로가기
                    </SemiBoldText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <SemiBoldText style={styles.listText}>그룹 관리</SemiBoldText>
            <View style={styles.accountingSection}>
              <View style={styles.manageCard}>
                <Image
                  source={require('../../assets/img/groupManage.png')}
                  style={styles.manageIcon}
                />
                <View style={styles.noticeContainer}>
                  <SemiBoldText style={styles.accountText}>
                    체계적으로 그룹을 관리해 봐요
                  </SemiBoldText>
                  <TouchableOpacity
                    style={styles.ManageDetailButton}
                    onPress={() =>
                      navigation.navigate('GroupManage', { groupId })
                    }
                  >
                    <SemiBoldText style={styles.detailButtonStyle}>
                      바로가기
                    </SemiBoldText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default ManagerMain;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  navContainer: {
    marginTop: 70,
    flexDirection: 'row',
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
    // top: 9,
    alignItems: 'center',
    zIndex: 10,
  },
  groupName: {
    fontSize: 27,
    color: '#FFFFFF',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    top: 2.7,
  },
  groupInfoCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupImg: {
    width: 85,
    height: 85,
    marginTop: 65,
  },
  acceptConfirmButton: {
    backgroundColor: '#EEE7FFB3',
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingVertical: 10,
    marginTop: 20,
  },
  groupRequestText: {
    fontSize: 21,
    color: '#3E247C',
  },
  divider: {
    width: '100%',
    height: 6,
    backgroundColor: '#EFEFEF',
    marginTop: 33,
  },
  secondContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    justifyContent: 'center',
  },
  textSection: {
    paddingVertical: 17,
    marginBottom: 7,
    fontSize: 16,
    color: '#7242E2',
  },
  receiptSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  receiptCard: {
    flexDirection: 'row',
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
    marginLeft: 20,
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
  receiptCheck: {
    width: 20,
    height: 20,
    alignSelf: 'flex-start',
    marginLeft: 40,
    bottom: 2,
  },
  moreButton: {
    backgroundColor: '#F1F1F1',
    height: 26,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 18,
  },
  moreText: {
    color: '#ADADAD',
    fontSize: 16,
    fontWeight: '600',
  },

  accountingSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  listText: {
    paddingVertical: 17,
    fontSize: 16,
    color: '#7242E2',
    marginLeft: 25,
  },
  noticeCard: {
    borderWidth: 1,
    borderColor: '#ADADAD',
    width: 360,
    borderRadius: 25,
    marginBottom: 4,
    padding: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  manageCard: {
    borderWidth: 1,
    borderColor: '#ADADAD',
    width: 360,
    borderRadius: 25,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  IconStyle: {
    width: 50,
    height: 50,
    marginRight: 8,
    alignSelf: 'center',
  },
  manageIcon: {
    marginRight: 12,
    alignSelf: 'center',
    width: 38.5,
    height: 34.83,
  },
  detailButton: {
    backgroundColor: '#EEE7FF',
    paddingVertical: 3,
    borderRadius: 15,
    paddingHorizontal: 11,
    textAlign: 'center',
  },
  ManageDetailButton: {
    backgroundColor: '#EEE7FF',
    paddingVertical: 3,
    borderRadius: 15,
    paddingHorizontal: 11,
    textAlign: 'center',
    marginRight: -8,
  },
  detailButtonStyle: {
    fontSize: 12,
    color: '#3E247C',
  },
  noticeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  accountText: {
    fontSize: 13.2,
    color: '#ADADAD',
  },
});
