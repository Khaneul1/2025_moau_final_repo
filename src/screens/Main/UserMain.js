import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import RegularText from '../../components/customText/RegularText';
import SemiBoldText from '../../components/customText/SemiBoldText';
import BoldText from '../../components/customText/BoldText';
import CalendarView from './calendar/CalendarView';
// import RNFS from 'react-native-fs';

import { createGroup, joinGroupByCode } from '../../services/groupService';
import { useAuthStore } from '../../store/useAuthStore';

const randomImages = [
  require('../../assets/groupImg/group1.png'),
  require('../../assets/groupImg/group2.png'),
  require('../../assets/groupImg/group3.png'),
  require('../../assets/groupImg/group4.png'),
  require('../../assets/groupImg/group5.png'),
  require('../../assets/groupImg/group6.png'),
  require('../../assets/groupImg/group7.png'),
  require('../../assets/groupImg/group8.png'),
  require('../../assets/groupImg/group9.png'),
  require('../../assets/groupImg/group10.png'),
  require('../../assets/groupImg/group11.png'),
  require('../../assets/groupImg/group12.png'),
  require('../../assets/groupImg/group13.png'),
];

// 이미지 변환...
// const convertImageToBase64 = async image => {
//   try {
//     const imagePath = Image.resolveAssetSource(image).uri;
//     const base64Data = await RNFS.readFile(imagePath, 'base64');
//     return `data:image/png;base64, ${base64Data}`;
//   } catch (err) {
//     console.error('이미지 번환 실패: ', err);
//     return null;
//   }
// };

const UserMain = ({ navigation }) => {
  const { accessToken, refreshToken, setAdminToken } = useAuthStore();

  // console.log('userMain access token: ', accessToken);
  // console.log('userMain refresh token: ', refreshToken);
  // inside UserMain component
  useEffect(() => {
    // 한 번만 확인
    console.log('앱 시작시 토큰 상태:', useAuthStore.getState().accessToken);
  }, []);

  const [showMonthly, setShowMonthly] = useState(false);
  const calendarRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('select');

  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupImage, setGroupImage] = useState(null);

  const [generatedCode, setGeneratedCode] = useState('');
  const [groupCode, setGroupCode] = useState('');

  // const createGroupId = () => {
  //     return "G-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  // };

  const [groupId, setGroupId] = useState(null);

  const [kakaoUser, setKakaoUser] = useState({
    name: '고하늘',
    email: 'kohaneul1219@naver.com',
    groupCount: 3,
    userGroup: [
      {
        id: 1,
        name: '로망',
        description: '창업지원단 소속 창업동아리',
        image: require('../../assets/groupImg/group1.png'),
      },
      {
        id: 2,
        name: '구름톤 유니브',
        description: 'Kakao x goorm 연합 동아리',
        image: require('../../assets/groupImg/group2.png'),
      },
      {
        id: 3,
        name: '폴라리스',
        description: '창업지원단 소속 개발 창업 동아리',
        image: require('../../assets/groupImg/group3.png'),
      },
    ],
  });

  // const createdRandomCode = () => {
  //     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  //     let result = "";
  //     for (let i = 0; i < 6; i++) {
  //         result += chars[Math.floor(Math.random() * chars.length)];
  //     }
  //     return result;
  // };

  const resetModalState = () => {
    setGroupName('');
    setGroupDesc('');
    setGroupImage(null);
    setGeneratedCode('');
    setGroupCode('');
    setGroupId(null);
    setModalStep('main');
  };

  // create 단계에서 모달을 닫을 때: 모달만 닫기 (입력한 내용은 유지)
  const handleCloseModalFromCreate = () => {
    setShowModal(false);
    // 상태는 유지하여 나중에 다시 모달을 열었을 때 입력한 내용이 남아있도록 함
  };

  // createDone 단계나 다른 완료 단계에서 모달을 닫을 때: 상태 초기화하고 모달 닫기
  const handleCloseModal = () => {
    resetModalState();
    setShowModal(false);
  };

  const handleCreateFinish = () => {
    if (!groupId || !generatedCode) {
      Alert.alert('오류', '그룹 정보가 올바르지 않습니다.');
      return;
    }

    navigation.navigate('GroupManage', {
      groupId,
      groupName,
      groupDescription: groupDesc,
      groupCode: generatedCode,
    });

    // 모달 닫기 및 상태 초기화
    handleCloseModal();
  };

  // const handleEnterCode = () => {
  //     navigation.navigate("AdminJoin", {
  //         userName: kakaoUser.name,
  //         requestDate: dayjs().format("YYYY-MM-DD")
  //     });
  //     setShowModal(false);
  // };

  const startCreateGroup = () => {
    // 그룹 생성 시작 시 상태 초기화 (이전 입력 내용 제거)
    setGroupName('');
    setGroupDesc('');
    setGroupImage(
      randomImages[Math.floor(Math.random() * randomImages.length)],
    );
    // setGroupImage(
    //   prev =>
    //     prev || randomImages[Math.floor(Math.random() * randomImages.length)],
    // );
    setGroupId(null);
    setGeneratedCode('');
    setModalStep('create');
  };

  // console.log('토큰 확인:', useAuthStore.getState().accessToken);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.navStyle}>
            <TouchableOpacity onPress={() => navigation.navigate('Goto')}>
              <Image
                source={require('../../assets/img/gotoIcon.png')}
                style={styles.gotoicon}
              />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <BoldText style={styles.userName}>{kakaoUser.name} 님</BoldText>
            </View>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <CalendarView
            ref={calendarRef}
            initialMode="week"
            style={{ marginBottom: 0 }}
          />
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('MonthCalendar')}
          >
            <RegularText style={styles.detailText}>
              {showMonthly ? '닫기' : '자세히'}
            </RegularText>
          </TouchableOpacity>

          <View style={styles.myGroupSection}>
            <SemiBoldText style={styles.userGroupText}>
              내 그룹 {kakaoUser.groupCount}
            </SemiBoldText>
            <TouchableOpacity
              style={styles.addGroupButton}
              onPress={() => {
                setModalStep('main');
                setShowModal(true);
              }}
            >
              <Image
                source={require('../../assets/img/addGroupIcon.png')}
                style={styles.addGroupIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.groupList}>
            {kakaoUser.userGroup.map(group => (
              <View key={group.id} style={styles.groupCard}>
                <Image source={group.image} style={styles.imgIcon} />
                <View style={{ flex: 1 }}>
                  <SemiBoldText style={styles.groupName}>
                    {group.name}
                  </SemiBoldText>
                  <RegularText style={styles.groupInfo}>
                    {group.description}
                  </RegularText>
                </View>

                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() =>
                    navigation.navigate('GroupMain', { groupId: group.id })
                  }
                >
                  <SemiBoldText style={styles.joinText}>참여</SemiBoldText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalBox}>
                {modalStep === 'main' && (
                  <>
                    <View style={styles.titleSection}>
                      <BoldText style={styles.modalTitle}>
                        그룹 추가하기
                      </BoldText>
                      <TouchableOpacity
                        style={styles.disabledButton}
                        onPress={handleCloseModal}
                      >
                        <Image
                          source={require('../../assets/img/disabledIcon.png')}
                          style={styles.disabledIcon}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.modalSubSection}>
                      <Image
                        source={require('../../assets/img/group-add-icon.png')}
                        style={styles.groupIcon}
                      />
                      <SemiBoldText style={styles.modalSubText}>
                        소속된 그룹을 추가해 보세요!
                      </SemiBoldText>
                    </View>

                    <View style={styles.rowButtons}>
                      <TouchableOpacity
                        style={styles.mainBtn}
                        onPress={startCreateGroup}
                      >
                        <SemiBoldText style={styles.mainBtnText}>
                          그룹 생성/초대
                        </SemiBoldText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.mainBtn}
                        onPress={() => setModalStep('enterCode')}
                      >
                        <SemiBoldText style={styles.mainBtnText}>
                          그룹코드 입력
                        </SemiBoldText>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {modalStep === 'create' && (
                  <>
                    <View style={styles.topRow}>
                      <TouchableOpacity onPress={handleCloseModalFromCreate}>
                        <Image
                          source={require('../../assets/img/disabledIcon.png')}
                          style={styles.disabledIcon}
                        />
                      </TouchableOpacity>

                      <BoldText style={styles.modalTitle}>
                        그룹 생성하기
                      </BoldText>

                      <TouchableOpacity
                        onPress={async () => {
                          if (!groupName.trim()) {
                            Alert.alert('알림', '그룹 이름을 입력해 주세요.');
                            return;
                          }

                          try {
                            // const base64Image = groupImage
                            //   ? await convertImageToBase64(groupImage)
                            //   : null;

                            const result = await createGroup({
                              name: groupName,
                              description: groupDesc,
                              // image: base64Image,
                            });

                            if (!accessToken) {
                              Alert.alert(
                                '오류',
                                '인증 정보가 없습니다. 다시 로그인 해 주세요',
                              );
                              console.log(
                                'accessToken 없음 : createGroup 요청 불가',
                              );
                              return;
                            }

                            console.log('그룹 생성 요청 전 상태: ', {
                              groupName,
                              groupDesc,
                              groupImage,
                            });

                            // try {
                            //   if (!groupName) {
                            //     setGroupImage(
                            //       randomImages[
                            //         Math.floor(
                            //           Math.random() * randomImages.length,
                            //         )
                            //       ],
                            //     );
                            //   }
                            //   const result = await createGroup({
                            //     name: groupName,
                            //     description: groupDesc,
                            //     image: groupImage,
                            //   });

                            //   console.log('그룹 생성 성공:', result);

                            // API 응답에서 그룹 정보 추출
                            // response: { "groupId": 101, "name": "그룹명", "invite_code": "AB12CD34", "adminToken": "..." }
                            const groupIdFromResponse =
                              result.groupId || result.id;
                            const inviteCodeFromResponse =
                              result.invite_code || result.inviteCode;
                            const adminToken =
                              result.adminToken || result.admin_token;

                            if (
                              !groupIdFromResponse ||
                              !inviteCodeFromResponse
                            ) {
                              console.error('응답 데이터 형식 오류:', result);
                              Alert.alert(
                                '오류',
                                '서버 응답 형식이 올바르지 않습니다.',
                              );
                              return;
                            }

                            // 관리자 토큰이 있으면 저장
                            if (adminToken) {
                              // const { setAdminToken } = useAuthStore.getState();
                              setAdminToken(adminToken);
                              console.log('관리자 토큰 저장 완료');
                            }

                            setGroupId(groupIdFromResponse);
                            setGeneratedCode(inviteCodeFromResponse);

                            console.log('모달 스텝 전환 전 상태: ', {
                              groupId: groupIdFromResponse,
                            });
                            setModalStep('createDone');
                          } catch (error) {
                            console.error('그룹 생성 에러:', error);
                            console.error('에러 상세:', error.response);
                            console.error(
                              '에러 상태 코드:',
                              error.response?.status,
                            );
                            console.error('에러 데이터:', error.response?.data);
                            console.error('에러 메시지:', error.message);

                            let errorMessage = '그룹 생성에 실패했습니다.';

                            // if (!error.response) {
                            //   errorMessage =
                            //     '서버와 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.';
                            // } else
                            if (error.response?.status === 400) {
                              errorMessage =
                                '잘못된 요청입니다. 입력한 정보를 확인해주세요.';
                            } else if (error.response?.status === 401) {
                              errorMessage =
                                '인증에 실패했습니다. 로그인을 다시 시도해주세요.';
                              console.error('401 에러 - 인증 토큰 확인 필요');
                              const token = useAuthStore.getState().accessToken;
                              console.log(
                                '현재 토큰:',
                                token ? '토큰 존재' : '토큰 없음',
                              );
                            } else if (error.response?.status === 403) {
                              errorMessage =
                                '권한이 없습니다. 로그인을 다시 시도해주세요.';
                              console.error('403 에러 - 인증 토큰 확인 필요');
                              const token = useAuthStore.getState().accessToken;
                              console.log(
                                '현재 토큰:',
                                token ? '토큰 존재' : '토큰 없음',
                              );
                            } else if (error.response?.data?.message) {
                              errorMessage = error.response.data.message;
                            } else if (error.message) {
                              errorMessage = error.message;
                            }

                            Alert.alert('오류', errorMessage);
                          }
                        }}
                      >
                        <BoldText style={styles.confirmText}>확인</BoldText>
                      </TouchableOpacity>
                    </View>

                    <Image source={groupImage} style={styles.groupRandomImg} />

                    <TextInput
                      placeholder="그룹 이름을 설정해 주세요"
                      placeholderTextColor="#ADADAD"
                      style={styles.inputBox}
                      value={groupName}
                      onChangeText={setGroupName}
                    />

                    <TextInput
                      placeholder="그룹에 대한 설명을 적어 주세요"
                      placeholderTextColor="#ADADAD"
                      style={styles.inputBox}
                      value={groupDesc}
                      onChangeText={setGroupDesc}
                    />
                  </>
                )}

                {modalStep === 'createDone' && (
                  <>
                    <View style={styles.topRow}>
                      <TouchableOpacity onPress={handleCloseModal}>
                        <Image
                          source={require('../../assets/img/disabledIcon.png')}
                          style={styles.disabledIcon}
                        />
                      </TouchableOpacity>

                      <BoldText style={styles.modalTitle}>
                        그룹 생성 완료
                      </BoldText>

                      <TouchableOpacity onPress={handleCreateFinish}>
                        <BoldText style={styles.confirmText}>확인</BoldText>
                      </TouchableOpacity>
                    </View>

                    <Image source={groupImage} style={styles.groupRandomImg} />

                    <View style={styles.codeBox}>
                      <SemiBoldText style={styles.codeText}>
                        {generatedCode}
                      </SemiBoldText>
                    </View>

                    <View style={styles.modalSubSection}>
                      <Image
                        source={require('../../assets/img/group-add-icon.png')}
                        style={styles.groupIcon}
                      />
                      <SemiBoldText style={styles.modalSubText}>
                        그룹코드를 공유해 인원을 초대해 보세요!
                      </SemiBoldText>
                    </View>
                  </>
                )}

                {modalStep === 'enterCode' && (
                  <>
                    <View style={styles.topRow}>
                      <TouchableOpacity onPress={handleCloseModalFromCreate}>
                        <Image
                          source={require('../../assets/img/disabledIcon.png')}
                          style={styles.disabledIcon}
                        />
                      </TouchableOpacity>

                      <BoldText style={styles.modalTitle}>
                        그룹 추가하기
                      </BoldText>

                      <View style={{ width: 50 }} />
                    </View>

                    <TextInput
                      placeholder="그룹 코드를 입력하세요"
                      placeholderTextColor="#ADADAD"
                      style={styles.inputBox}
                      value={groupCode}
                      onChangeText={setGroupCode}
                    />

                    <TouchableOpacity
                      style={styles.enterBtn}
                      onPress={async () => {
                        if (!groupCode.trim()) {
                          Alert.alert('알림', '그룹 코드를 입력해 주세요.');
                          return;
                        }

                        try {
                          // 서버로 그룹 가입 요청
                          // { "invite_code": "A1B2C3D4" }
                          const result = await joinGroupByCode(
                            groupCode.trim(),
                          );

                          // API 명세 response { "id": 1001, "groupId": 10, "status": "PENDING", "requestedAt": "2025-10-05T12:00:00Z" }
                          console.log('그룹 가입 성공:', result);
                          console.log('가입 요청 ID:', result.id);
                          console.log('그룹 ID:', result.groupId);
                          console.log('상태:', result.status);

                          // 가입 성공 시 완료 화면으로 이동
                          setGroupCode(''); //입력한 코드 초기화
                          setModalStep('enterDone');
                        } catch (error) {
                          console.error('그룹 가입 에러:', error);
                          console.error('에러 상세:', error.response);
                          console.error(
                            '에러 상태 코드:',
                            error.response?.status,
                          );
                          console.error('에러 데이터:', error.response?.data);
                          console.error('에러 메시지:', error.message);

                          let errorMessage = '그룹 가입에 실패했습니다.';

                          if (error.response?.status === 400) {
                            errorMessage =
                              '잘못된 그룹 코드입니다. 코드를 확인해주세요.';
                          } else if (error.response?.status === 401) {
                            errorMessage =
                              '인증에 실패했습니다. 로그인을 다시 시도해주세요.';
                            console.error('401 에러 - 인증 토큰 확인 필요');
                            const token = useAuthStore.getState().accessToken;
                            console.log(
                              '현재 토큰:',
                              token ? '토큰 존재' : '토큰 없음',
                            );
                          } else if (error.response?.status === 403) {
                            errorMessage =
                              '권한이 없습니다. 로그인을 다시 시도해주세요.';
                            console.error('403 에러 - 인증 토큰 확인 필요');
                            const token = useAuthStore.getState().accessToken;
                            console.log(
                              '현재 토큰:',
                              token ? '토큰 존재' : '토큰 없음',
                            );
                          } else if (error.response?.status === 409) {
                            errorMessage = '이미 가입된 그룹입니다.';
                          } else if (error.response?.data?.message) {
                            errorMessage = error.response.data.message;
                          } else if (error.message) {
                            errorMessage = error.message;
                          }

                          Alert.alert('오류', errorMessage);
                        }
                      }}
                    >
                      <SemiBoldText style={styles.enterBtnText}>
                        입장하기
                      </SemiBoldText>
                    </TouchableOpacity>
                  </>
                )}

                {modalStep === 'enterDone' && (
                  <>
                    <View style={styles.titleSection}>
                      <BoldText style={styles.modalTitle}>
                        그룹 추가하기
                      </BoldText>
                      <TouchableOpacity
                        style={styles.disabledButton}
                        onPress={handleCloseModal}
                      >
                        <Image
                          source={require('../../assets/img/disabledIcon.png')}
                          style={styles.disabledIcon}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={{ paddingVertical: 40 }}>
                      <SemiBoldText style={styles.donText}>
                        입장 요청이 완료되었어요!
                      </SemiBoldText>
                    </View>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default UserMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  navStyle: {
    flexDirection: 'row',
    marginTop: 70,
    marginBottom: 45,
    paddingHorizontal: 40,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#7242E2',
    paddingTop: 10,
    paddingBottom: 15,
    alignItems: 'center',
  },
  gotoicon: {
    width: 25,
    height: 22.6,
    marginTop: 4,
  },
  userName: {
    fontSize: 27,
    color: '#FFFFFF',
    marginLeft: -20,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: -25,
    zIndex: 10,
  },
  detailButton: {
    backgroundColor: '#F1F1F1',
    width: 341,
    height: 26,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  detailText: {
    color: '#ADADAD',
    fontSize: 16,
    fontWeight: '600',
  },
  myGroupSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 50,
  },
  userGroupText: {
    alignSelf: 'flex-start',
    marginLeft: 28,
    marginBottom: 8,
    fontSize: 17,
    color: '#3E247C',
  },
  addGroupButton: {
    marginRight: 25,
  },
  addGroupIcon: {
    width: 25,
    height: 25,
  },
  groupCard: {
    borderWidth: 1,
    borderColor: '#B3B3B3',
    width: 326,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  imgIcon: {
    width: 42,
    height: 42,
    marginRight: 14,
  },
  groupName: {
    color: '#3E247C',
    fontSize: 18,
    marginBottom: 2,
  },
  groupInfo: {
    color: '#B5B2B2',
    fontSize: 14,
  },
  joinButton: {
    backgroundColor: '#EEE7FF',
    width: 47,
    height: 21,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: {
    color: '#3E247C',
    fontSize: 13,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 29,
    paddingHorizontal: 30,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 5,
  },
  modalTitle: {
    fontSize: 22,
    color: '#7242E2',
    textAlign: 'center',
  },
  disabledButton: {
    position: 'absolute',
    right: 0,
  },
  disabledIcon: {
    width: 30,
    height: 30,
  },
  modalSubSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  groupIcon: {
    width: 22,
    height: 22,
  },
  modalSubText: {
    fontSize: 14,
    color: '#ADADAD',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  mainBtn: {
    flex: 1,
    backgroundColor: '#EFEFFE',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  mainBtnText: {
    fontSize: 18,
    color: '#3E247C',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  confirmText: {
    fontSize: 18,
    color: '#ADADAD',
  },
  groupRandomImg: {
    borderRadius: 100,
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  codeBox: {
    borderWidth: 1,
    borderColor: '#ADADAD',
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginBottom: 12,
    fontSize: 16,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 23,
    color: '#ADADAD',
  },
  inputBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ADADAD',
    fontFamily: 'Freesentation-7Bold',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginBottom: 12,
    fontSize: 16,
    color: '#3E247C',
  },
  enterBtn: {
    backgroundColor: '#7242E2',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
  },
  enterBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  donText: {
    fontSize: 20,
    color: '#3E247C',
    textAlign: 'center',
  },
});
