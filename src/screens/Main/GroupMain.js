import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SemiBoldText from '../../components/customText/SemiBoldText';
import RegularText from '../../components/customText/RegularText';
import { groupDetails } from '../../data/group';
import NavBar from '../../components/nav/NavBar';
import CalendarView from './calendar/CalendarView';

// import useGroupStore from '../../store/useGroupStore';

const GroupMain = ({ route, navigation }) => {
  const { groupId } = route.params;
  const group = groupDetails[groupId];
  // const getGroupById = useGroupStore(state => state.getGroupById);
  // const group = getGroupById(groupId);

  const [showMonthly, setShowMonthly] = useState(false);
  const calendarRef = useRef(null);

  return (
    <View style={styles.container}>
      <View style={styles.allSection}>
        <NavBar />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <View style={styles.groupCard}>
            <View style={styles.calendarContainer}>
              <CalendarView ref={calendarRef} initialMode="week" />

              <TouchableOpacity
                style={styles.CalenderButton}
                onPress={() => navigation.navigate('MonthCalendar')}
              >
                <RegularText style={styles.CalenderTextButton}>
                  {showMonthly ? '닫기' : '자세히'}
                </RegularText>
              </TouchableOpacity>
            </View>

            <View style={styles.noticeSection}>
              <SemiBoldText
                style={styles.sectionTitle}
                onPress={() =>
                  navigation.navigate('GroupNoticeList', { groupId })
                }
              >
                최근 공지
              </SemiBoldText>
              {group.notices.map(notices => {
                const limitedContent =
                  notices.content.length > 22
                    ? notices.content.slice(0, 22) + '...'
                    : notices.content;

                return (
                  <View key={notices.id} style={styles.noticeCard}>
                    <Image
                      source={require('../../assets/img/postIcon.png')}
                      style={styles.IconStyle}
                    />
                    <View style={styles.noticeContainer}>
                      <View style={styles.groupContainer}>
                        <SemiBoldText style={styles.noticeTitle}>
                          {notices.title}
                        </SemiBoldText>
                        <RegularText style={styles.noticeContent}>
                          {limitedContent}
                        </RegularText>
                        <RegularText style={styles.noticeDate}>
                          {notices.date}
                        </RegularText>
                      </View>
                      <TouchableOpacity
                        style={styles.detailButton}
                        onPress={() =>
                          navigation.navigate('GroupNoticeDetail', {
                            groupId,
                            noticeId: notices.id,
                          })
                        }
                      >
                        <SemiBoldText style={styles.detailButtonStyle}>
                          더보기
                        </SemiBoldText>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.accountingSection}>
              <SemiBoldText style={styles.sectionTitle}>회계</SemiBoldText>
              <View style={styles.noticeCard}>
                <Image
                  source={require('../../assets/img/accountingIcon.png')}
                  style={styles.IconStyle}
                />
                <View style={styles.noticeContainer}>
                  <SemiBoldText style={styles.accountText}>
                    우리 그룹의 자금, 어떻게 운영되고 있을까요?
                  </SemiBoldText>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      navigation.navigate('GroupAccountDetail', { groupId })
                    }
                  >
                    <SemiBoldText style={styles.detailButtonStyle}>
                      더보기
                    </SemiBoldText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.accountingSection}>
              <SemiBoldText style={styles.sectionTitle}>커뮤니티</SemiBoldText>
              <View style={styles.noticeCard}>
                <Image
                  source={require('../../assets/img/communityIcon.png')}
                  style={styles.IconStyle}
                />
                <View style={styles.noticeContainer}>
                  <SemiBoldText style={styles.accountText}>
                    그룹원과 자유롭게 소통해 봐요!
                  </SemiBoldText>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      navigation.navigate('GroupCommunityDetail', { groupId })
                    }
                  >
                    <SemiBoldText style={styles.detailButtonStyle}>
                      글보기
                    </SemiBoldText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.accountingSection}>
              <SemiBoldText style={styles.sectionTitle}>회원 조회</SemiBoldText>
              <View style={styles.noticeCard}>
                <Image
                  source={require('../../assets/img/memberManage.png')}
                  style={styles.IconStyle}
                />
                <View style={styles.noticeContainer}>
                  <SemiBoldText style={styles.accountText}>
                    우리 그룹의 회원 목록을 조회해 봐요
                  </SemiBoldText>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      navigation.navigate('GroupMemberList', { groupId })
                    }
                  >
                    <SemiBoldText style={styles.detailButtonStyle}>
                      더보기
                    </SemiBoldText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default GroupMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7242E2',
    paddingTop: 30,
    justifyContent: 'center',
  },
  allSection: {
    flex: 1,
    marginTop: 33,
  },
  scroll: {
    flex: 1,
  },
  groupCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  calendarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  CalenderButton: {
    backgroundColor: '#F1F1F1',
    width: 341,
    height: 26,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  CalenderTextButton: {
    color: '#ADADAD',
    fontSize: 16,
    fontWeight: '600',
  },
  noticeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  noticeSection: {
    marginTop: 50,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#7242E2',
    marginBottom: 10,
    marginLeft: 15,
  },
  noticeCard: {
    borderWidth: 1,
    borderColor: '#ADADAD',
    width: 360,
    borderRadius: 25,
    marginBottom: 6,
    padding: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  IconStyle: {
    width: 50,
    height: 50,
    marginRight: 8,
    alignSelf: 'center',
  },
  noticeTitle: {
    fontSize: 16,
    color: '#3E247C',
    marginBottom: 4,
  },
  noticeContent: {
    fontSize: 14,
    color: '#ADADAD',
    marginBottom: 3,
  },
  noticeDate: {
    fontSize: 11,
    color: '#ADADAD',
    marginBottom: 6,
  },
  accountText: {
    fontSize: 13.2,
    color: '#ADADAD',
  },
  groupContainer: {
    flex: 1,
    marginTop: 5,
  },
  detailButton: {
    backgroundColor: '#EEE7FF',
    padding: 13,
    paddingVertical: 3,
    borderRadius: 15,
    width: 55,
    height: 20,
  },
  detailButtonStyle: {
    fontSize: 12,
    color: '#3E247C',
  },
  accountingSection: {
    marginBottom: 20,
  },
});
