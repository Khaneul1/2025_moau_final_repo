import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import ManagePageNavHeader from '../../../components/nav/ManagePageNavHeader';
import { getGroup, updateGroup } from '../../../services/groupService';
import { useGroupStore } from '../../../store/useGroupStore';
import { deleteGroup } from '../../../services/groupService';

const GroupManage = ({ route, navigation }) => {
  const params = route?.params || {};

  const {
    teamId = params.teamId,
    groupImage = params.groupImage,
    groupName = params.groupName,
    groupDescription = params.groupDescription,
    groupCode = params.groupCode,
  } = params;

  const { fetchGroups } = useGroupStore();

  const [editName, setEditName] = useState(groupName);
  const [editDesc, setEditDesc] = useState(groupDescription);
  // const [payAccount, setPayAccount] = useState('');
  const [payAmount, setPayAmount] = useState('');

  const [selectedCycle, setSelectedCycle] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownLayoutY, setDropdownLayoutY] = useState(0);

  const [nameFocused, setNameFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [groupData, setGroupData] = useState(null);

  const feeCycles = ['분기', '매월', '3개월', '6개월', '12개월'];

  const feeCycleMap = {
    분기: 'QUARTERLY',
    매월: 'MONTHLY',
    '3개월': 'THREE_MONTHS',
    '6개월': 'SIX_MONTHS',
    '12개월': 'YEARLY',
  };

  const feeCycleReverseMap = {
    QUARTERLY: '분기',
    MONTHLY: '매월',
    THREE_MONTHS: '3개월',
    SIX_MONTHS: '6개월',
    YEARLY: '12개월',
  };

  const scrollRef = useRef(null);

  // 그룹 정보 조회
  useEffect(() => {
    const fetchGroupData = async () => {
      if (!teamId) return;

      try {
        setLoading(true);
        const data = await getGroup(teamId);
        console.log('그룹 정보 조회 성공:', data);

        setGroupData(data);
        setEditName(data.name || groupName);
        setEditDesc(data.description || groupDescription);
        // setPayAccount(data.accountNumber || data.account_number || '');
        setPayAmount(data.duesAmount?.toString() || '');

        // 회비 주기가 있으면 프론트엔드 형식으로 변환
        if (data.duesPeriod) {
          setSelectedCycle(feeCycleReverseMap[data.duesPeriod] || '');
        }
      } catch (error) {
        console.error('그룹 정보 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [teamId]);

  // const handleSave = async () => {
  //   if (loading) return;

  //   if (!editName.trim()) {
  //     Alert.alert("알림", "그룹 이름을 입력해 주세요");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const updateData = {
  //       name: editName.trim(),
  //       description: editDesc.trim(),
  //     };

  //   }
  // }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <ScrollView ref={scrollRef} style={{ flex: 1 }}>
          <ManagePageNavHeader pageName="그룹 관리" navigation={navigation} />

          <Image source={groupImage} style={styles.groupImage} />

          <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
              <SemiBoldText style={styles.inputLabel}>그룹 이름</SemiBoldText>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                style={[
                  styles.textInput,
                  { color: editName && nameFocused ? '#3E247C' : '#ADADAD' },
                ]}
              />
            </View>

            <View style={styles.inputWrapper}>
              <SemiBoldText style={styles.inputLabel}>그룹 소개</SemiBoldText>
              <TextInput
                value={editDesc}
                onChangeText={setEditDesc}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                style={[
                  styles.textInput,
                  { color: editDesc && descFocused ? '#3E247C' : '#ADADAD' },
                ]}
              />
            </View>

            <View style={styles.inputWrapper}>
              <SemiBoldText style={styles.inputLabel}>그룹 코드</SemiBoldText>
              <SemiBoldText style={[styles.textInput, { color: '#ADADAD' }]}>
                {groupCode}
              </SemiBoldText>
            </View>

            {/* <View style={styles.inputWrapper}>
              <SemiBoldText style={styles.inputLabel}>계좌번호</SemiBoldText>
              <TextInput
                placeholder="그룹 계좌번호를 입력하세요"
                placeholderTextColor="#ADADAD"
                value={payAccount}
                onChangeText={setPayAccount}
                style={styles.textInput}
              />
            </View> */}

            <View style={styles.inputWrapper}>
              <SemiBoldText style={styles.inputLabel}>회비 금액</SemiBoldText>
              <TextInput
                placeholder="회비 금액을 입력하세요"
                placeholderTextColor="#ADADAD"
                value={payAmount}
                onChangeText={setPayAmount}
                keyboardType="number-pad"
                maxLength={7}
                style={styles.textInput}
              />
            </View>

            <View
              style={styles.inputWrapper}
              onLayout={event => {
                setDropdownLayoutY(event.nativeEvent.layout.y);
              }}
            >
              <SemiBoldText style={styles.inputLabel}>
                회비 주기 선택
              </SemiBoldText>
              <View style={styles.cycleInputSection}>
                <TextInput
                  style={[
                    styles.cycleInput,
                    { color: selectedCycle ? '#3E247C' : '#ADADAD' },
                  ]}
                  value={
                    selectedCycle ? selectedCycle : '선택된 회비 주기가 없어요!'
                  }
                  editable={false}
                  maxLength={2}
                />

                <TouchableOpacity
                  style={styles.dropdownTouchable}
                  onPress={() => {
                    setOpenDropdown(!openDropdown);
                    setTimeout(() => {
                      if (scrollRef.current) {
                        scrollRef.current.scrollTo({
                          y: dropdownLayoutY - 100,
                          animated: true,
                        });
                      }
                    }, 150);
                  }}
                >
                  <Image
                    source={require('../../../assets/img/dropdownArrowIcon.png')}
                    style={styles.dropdownIcon}
                  />
                </TouchableOpacity>
              </View>

              {openDropdown && (
                <View style={styles.dropdownBox}>
                  {feeCycles.map(cycle => (
                    <SemiBoldText
                      key={cycle}
                      style={[
                        styles.dropdownItem,
                        selectedCycle === cycle && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedCycle(cycle);
                        setOpenDropdown(false);
                      }}
                    >
                      {cycle}
                    </SemiBoldText>
                  ))}
                </View>
              )}
            </View>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={async () => {
                if (loading) return;

                if (!editName.trim()) {
                  Alert.alert('알림', '그룹 이름을 입력해 주세요.');
                  return;
                }

                try {
                  setLoading(true);

                  // 수정할 데이터 준비
                  const updateData = {
                    name: editName.trim(),
                    description: editDesc.trim(),
                    duesAmount: payAmount ? parseInt(payAmount, 10) : 0,
                    duesPeriod: selectedCycle
                      ? feeCycleMap[selectedCycle]
                      : 'NONE',
                  };

                  console.log('그룹 수정 요청: ', updateData);

                  // 계좌번호가 있으면 추가
                  // if (payAccount.trim()) {
                  //   updateData.accountNumber = payAccount.trim();
                  // }

                  const result = await updateGroup(teamId, updateData);
                  console.log('그룹 수정 성공: ', result);

                  await fetchGroups();

                  // 회비 금액이 있으면 추가
                  // if (payAmount.trim()) {
                  //   updateData.feeAmount = parseInt(payAmount.trim(), 10);
                  // }

                  // 회비 주기가 선택되었으면 추가
                  // if (selectedCycle) {
                  //   updateData.feeCycle = feeCycleMap[selectedCycle];
                  // }

                  Alert.alert('성공', '그룹 정보가 저장되었습니다.', [
                    {
                      text: '확인',
                      onPress: () => navigation.navigate('UserMain'),
                    },
                  ]);
                } catch (error) {
                  console.error('그룹 수정 에러:', error);
                  console.error('에러 상세:', error.response?.data);
                  Alert.alert('오류', '그룹 정보 수정에 실패했습니다.');
                } finally {
                  setLoading(false);
                }
              }}
              // disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <SemiBoldText style={styles.buttonText}>저장하기</SemiBoldText>
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                Alert.alert(
                  '그룹 삭제',
                  '정말로 이 그룹을 삭제하시겠습니까?\n삭제한 그룹은 복구할 수 없습니다.',
                  [
                    { text: '취소', style: 'cancel' },
                    {
                      text: '삭제',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          setLoading(true);

                          const result = await deleteGroup(teamId);
                          console.log('그룹 삭제 성공: ', result);

                          await fetchGroups();

                          Alert.alert('삭제 완료', '그룹이 삭제되었습니다', [
                            {
                              text: '확인',
                              onPress: () => navigation.navigate('UserMain'),
                            },
                          ]);
                        } catch (error) {
                          console.error('그룹 삭제 에러:', error);
                          Alert.alert('오류', '그룹 삭제에 실패했습니다.');
                        } finally {
                          setLoading(false);
                        }
                      },
                    },
                  ],
                );
              }}
            >
              <SemiBoldText style={styles.deleteButtonText}>
                그룹 삭제
              </SemiBoldText>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GroupManage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  groupImage: {
    borderRadius: 100,
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 40,
    marginTop: 20,
    marginVertical: 20,
  },
  inputSection: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  inputWrapper: {
    width: '80%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#7242E2',
    marginBottom: 5,
    marginLeft: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#B5B2B2',
    padding: 20,
    borderRadius: 15,
    marginBottom: 8,
    width: '100%',
    fontFamily: 'Freesentation-6SemiBold',
    color: '#3E247C',
    fontSize: 15.5,
  },
  dropdownTouchable: {
    position: 'absolute',
    right: 10,
    top: 4,
    padding: 10,
    zIndex: 10,
  },
  dropdownIcon: {
    width: 30,
    height: 30,
  },
  cycleInput: {
    fontFamily: 'Freesentation-6SemiBold',
    color: '#ADADAD',
    fontSize: 15.5,
  },
  cycleInputSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#B5B2B2',
    padding: 20,
    borderRadius: 15,
    marginBottom: 8,
    width: '100%',
  },
  dropdownBox: {
    marginTop: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#B5B2B2',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    textAlign: 'center',
    fontSize: 15,
    color: '#ADADAD',
    borderWidth: 1,
    borderColor: '#B5B2B2',
    width: '75%',
    borderRadius: 20,
    marginBottom: 5,
    marginTop: 5,
  },
  saveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: '#7242E2',
    width: '80%',
    height: 61,
    borderRadius: 16,
    marginBottom: 10,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 26,
    color: '#FFFFFF',
  },
});
