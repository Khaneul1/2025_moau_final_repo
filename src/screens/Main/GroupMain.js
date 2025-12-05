import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import SemiBoldText from '../../components/customText/SemiBoldText';
import RegularText from '../../components/customText/RegularText';
import NavBar from '../../components/nav/NavBar';
import CalendarView from './calendar/CalendarView';
import { getGroup } from '../../services/groupService';

const GroupMain = ({ route, navigation }) => {
  const { teamId } = route.params;

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log('전달받은 teamId: ', teamId);

  const [showMonthly, setShowMonthly] = useState(false);
  const calendarRef = useRef(null);

  const mockNotices = [
    {
      id: 1,
      title: '이번주 정기모임 및 공지사항',
      content: '1. 정기모임 \n 일시: 2025/11/19(수) 18:00 ~',
      date: '2025-11-18 10:21',
      link: '/romang/notice/1',
    },
    {
      id: 2,
      title: '특강 참여 공지',
      content:
        '금일 13시와 16시 두 차례에 걸쳐 특강을 진행합니다. 창업동아리 학생들을 위해 초청한 강사분들이니 많은 참석 부탁드립니다.',
      date: '2025-11-14 13:22',
      link: '/romang/notice/2',
    },
  ];

  const loadGroup = async () => {
    try {
      const data = await getGroup(teamId);
      setGroup(data);
    } catch (error) {
      console.log('그룹 상세 조회 실패: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
  }, []);

  useEffect(() => {
    if (group !== null) {
      console.log('group data: ', group);
    }
  }, [group]);

  const noticesToRender =
    group?.notices && group.notices.length > 0 ? group.notices : mockNotices;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <SemiBoldText>그룹 정보를 불러올 수 없습니다.</SemiBoldText>
      </View>
    );
  }

  // const notices = group.notices || [];

  return (
    <View style={styles.container}>
      <View style={styles.allSection}>
        <NavBar title={group.name} teamId={teamId} />

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
                  navigation.navigate('GroupNoticeList', { teamId: teamId })
                }
              >
                최근 공지
              </SemiBoldText>
              {/* {(!group?.notices || group.notices.length === 0) && (
                <View style={styles.noticeCard}>
                  <Image
                    source={require('../../assets/img/postIcon.png')}
                    style={styles.IconStyle}
                  />
                  <View style={styles.noticeContainer}>
                    <SemiBoldText style={{ color: '#999' }}>
                      등록된 공지가 없습니다.
                    </SemiBoldText>
                  </View>
                </View>
              )} */}
              {noticesToRender.slice(0, 2).map(notices => {
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
                            teamId: group.id,
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
                      navigation.navigate('GroupAccountDetail', {
                        teamId: group.id,
                        image: group.image,
                        groupName: group.name,
                      })
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
                      navigation.navigate('GroupCommunityDetail', {
                        teamId: group.id,
                      })
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
                      navigation.navigate('GroupMemberList', {
                        teamId: group.id,
                      })
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
