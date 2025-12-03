import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BoldText from '../customText/BoldText';

const NavBar = ({ title, teamId }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../../assets/img/backIcon.png')}
          style={styles.backIconStyle}
        />
      </TouchableOpacity>

      <BoldText style={styles.groupName}>{title}</BoldText>
      <View style={styles.iconGroup}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ManagerGuard', { teamId })}
        >
          <Image
            source={require('../../assets/img/managerIcon.png')}
            style={styles.mngIconStyle}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Goto')}>
          <Image
            source={require('../../assets/img/gotoIcon.png')}
            style={styles.gotoIconStyle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    marginBottom: 15,
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
    top: 9,
    alignItems: 'center',
    zIndex: 10,
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
  groupName: {
    fontSize: 27,
    color: '#FFFFFF',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  iconGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
