import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import SemiBoldText from '../../components/customText/SemiBoldText';
import PageNavHeader from '../../components/nav/PageNavHeader';

const ManagerGuard = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = useState(true); //나중에 false로 바꿀 것

  // useEffect(() => {
  //   (async () => {
  //     const token = await AsyncStorage.getItem("adminToken");
  //     setIsAdmin(!!token);
  //   })();

  useEffect(() => {
    if (isAdmin === true) {
      navigation.replace('ManagerMain');
    }
  }, [isAdmin, navigation]);

  return (
    <View style={styles.container}>
      <PageNavHeader pageName="관리자" navigation={navigation} />

      {!isAdmin && (
        <>
          <View style={styles.overlay} />

          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.disabledButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.disabledButtonText}>확인</Text>
            </TouchableOpacity>

            <SemiBoldText style={styles.modalText}>
              관리자만 접근 가능합니다.
            </SemiBoldText>
          </View>
        </>
      )}
    </View>
  );
};

export default ManagerGuard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9,
  },
  modalBox: {
    position: 'absolute',
    top: '48%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }],
    width: 300,
    height: 130,
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 17,
    color: '#D60000',
    textAlign: 'center',
    marginTop: 14,
  },
  disabledButtonText: {
    color: '#ADADAD',
    fontSize: 15,
  },
  disabledButton: {
    alignSelf: 'flex-end',
  },
});
