// components/NavHeader.js
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BoldText from '../customText/BoldText';

const PageNavHeader = ({ pageName, navigation, teamId }) => {
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

      <View style={styles.iconGroup}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ManagerGuard', { teamId })}
        >
          <Image
            source={require('../../assets/img/ManagerPurpleIcon.png')}
            style={styles.mngIconStyle}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Goto')}>
          <Image
            source={require('../../assets/img/GotoPurpleIcon.png')}
            style={styles.gotoIconStyle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PageNavHeader;

const styles = StyleSheet.create({
  navContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    marginTop: 65,
  },
  backButton: {
    width: 50,
    height: 50,
    justifyContent: 'flex-start',
    position: 'absolute',
    left: 16,
    top: 9,
    alignItems: 'center',
    zIndex: 10,
  },
  backIconStyle: {
    width: 37,
    height: 37,
  },
  iconGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gotoIconStyle: {
    width: 23,
    height: 23,
    marginRight: 10,
    marginLeft: 5,
  },
  mngIconStyle: {
    width: 23,
    height: 23,
    marginRight: 10,
  },
  pageName: {
    fontSize: 27,
    color: '#7242E2',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});
