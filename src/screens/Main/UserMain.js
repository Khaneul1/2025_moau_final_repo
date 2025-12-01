import React, { useState, useRef } from 'react';
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
} from 'react-native';
import RegularText from '../../components/customText/RegularText';
import SemiBoldText from '../../components/customText/SemiBoldText';
import BoldText from '../../components/customText/BoldText';
import CalendarView from './calendar/CalendarView';

import useGroupStore from '../../store/useGroupStore';

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

const UserMain = ({ navigation }) => {
  const [showMonthly, setShowMonthly] = useState(false);
  const calendarRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('main');

  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [groupCode, setGroupCode] = useState('');

  // const createGroupId = () => {
  //   return 'G-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  // };

  const addGroup = useGroupStore(state => state.addGroup);
  const userGroups = useGroupStore(state => state.groups);
  const createGroupId = () => Math.floor(Math.random() * 1000000);

  const [groupId, setGroupId] = useState(null);

  const createdRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const handleCreateFinish = () => {
    const newGroup = {
      groupId: groupId,
      groupName: groupName,
      description: groupDesc,
      image: groupImage,
      ownerUserId: 101,
      inviteCode: generatedCode,
      createdAt: new Date().toISOString(),
      duesPeriod: 'NONE',
      duesAmount: 0,
    };
    addGroup(newGroup);
    setShowModal(false);
    navigation.navigate('GroupMain', { groupId: groupId });
  };

  const startCreateGroup = () => {
    setGroupImage(
      randomImages[Math.floor(Math.random() * randomImages.length)],
    );
    setModalStep('create');
  };

  // 예시 사용자 이름
  const userName = '고하늘';

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
              <BoldText style={styles.userName}>{userName} 님</BoldText>
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
              내 그룹 {userGroups.length}
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
            {userGroups.map(group => (
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
                        onPress={() => setShowModal(false)}
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
                      <TouchableOpacity onPress={() => setShowModal(false)}>
                        <Image
                          source={require('../../assets/img/disabledIcon.png')}
                          style={styles.disabledIcon}
                        />
                      </TouchableOpacity>

                      <BoldText style={styles.modalTitle}>
                        그룹 생성하기
                      </BoldText>
                      <TouchableOpacity
                        onPress={() => {
                          setGeneratedCode(createdRandomCode());
                          setGroupId(createGroupId());
                          setModalStep('createDone');
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
                      <TouchableOpacity onPress={() => setShowModal(false)}>
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
                      <TouchableOpacity onPress={() => setShowModal(false)}>
                        <Image
                          source={require('../../assets/img/disabledIcon.png')}
                          style={styles.disabledIcon}
                        />
                      </TouchableOpacity>

                      <BoldText style={styles.modalTitle}>
                        그룹 추가하기
                      </BoldText>

                      <TouchableOpacity onPress={handleCreateFinish}>
                        <BoldText style={styles.confirmText}>확인</BoldText>
                      </TouchableOpacity>
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
                      onPress={() => setModalStep('enterDone')}
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
                        onPress={() => setShowModal(false)}
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
