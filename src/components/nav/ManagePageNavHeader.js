import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import BoldText from '../../components/customText/BoldText';

const ManagePageNavHeader = ({ navigation, groupId, pageName }) => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../../assets/img/backPurpleIcon.png')}
          style={styles.backIconStyle}
        />
      </TouchableOpacity>
      <BoldText style={styles.pageName}>{pageName}</BoldText>
    </View>
  );
};

export default ManagePageNavHeader;

const styles = StyleSheet.create({
  navContainer: {
    marginTop: 70,
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
    color: '#7242E2',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    top: 2.7,
  },
});
