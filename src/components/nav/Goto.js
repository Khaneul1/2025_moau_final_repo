import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import BoldText from '../customText/BoldText';
import { useNavigation } from '@react-navigation/native';
import SemiBoldText from '../customText/SemiBoldText';

const Goto = () => {
  const navigation = useNavigation();

  const [userName, setUserName] = useState('고하늘');
  const [groupInfo, setGroupInfo] = useState([
    {
      id: 1,
      name: '로망',
      account: 378900,
      latestNotices: '2025.09.30',
      latestPost: '2025.09.30',
      image: require('../../assets/groupImg/group1.png'),
    },
    {
      id: 2,
      name: '구름톤 유니브',
      account: 451900,
      latestNotices: '2025.10.25',
      latestPost: '2025.10.03',
      image: require('../../assets/groupImg/group2.png'),
    },
    {
      id: 3,
      name: '폴라리스',
      latestNotices: '2025.11.01',
      latestPost: '2025.10.28',
      account: 500000,
      image: require('../../assets/groupImg/group3.png'),
    },
  ]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <BoldText
            style={styles.userName}
            onPress={() => navigation.navigate('UserMain')}
          >
            {userName} 님
          </BoldText>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/img/disabledIcon.png')}
              style={styles.disabledIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.groupContainer}>
          {groupInfo.map(group => (
            <View key={group.id} style={styles.groupCard}>
              <View style={styles.groupSection}>
                <BoldText style={styles.groupTitle} numberOfLines={1}>
                  {group.name}
                </BoldText>

                <View style={styles.itemButton}>
                  <Image source={group.image} style={styles.groupImage} />
                  <View style={styles.textContainer}>
                    <SemiBoldText style={styles.itemTitle}>회계</SemiBoldText>
                    {group.account != undefined && (
                      <SemiBoldText style={styles.itemSubtitle}>
                        총 잔액 {group.account.toLocaleString()}원
                      </SemiBoldText>
                    )}
                  </View>
                  <View style={styles.togoButton}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('GroupAccountDetail', {
                          groupId: group.id,
                          groupName: group.name,
                        })
                      }
                    >
                      <SemiBoldText style={styles.buttonText}>
                        바로가기
                      </SemiBoldText>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemButton}>
                  <Image source={group.image} style={styles.groupImage} />
                  <View style={styles.textContainer}>
                    <SemiBoldText style={styles.itemTitle}>공지</SemiBoldText>
                    {group.latestNotices && (
                      <SemiBoldText style={styles.itemSubtitle}>
                        최근 공지일 {group.latestNotices}
                      </SemiBoldText>
                    )}
                  </View>
                  <View style={styles.togoButton}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('GroupNoticeDetail', {
                          groupId: group.id,
                          groupName: group.name,
                        })
                      }
                    >
                      <SemiBoldText style={styles.buttonText}>
                        바로가기
                      </SemiBoldText>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemButton}>
                  <Image source={group.image} style={styles.groupImage} />
                  <View style={styles.textContainer}>
                    <SemiBoldText style={styles.itemTitle}>
                      커뮤니티
                    </SemiBoldText>
                    {group.latestPost && (
                      <SemiBoldText style={styles.itemSubtitle}>
                        최근 게시글 {group.latestPost}
                      </SemiBoldText>
                    )}
                  </View>
                  <View style={styles.togoButton}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('GroupCommunityDetail', {
                          groupId: group.id,
                          groupName: group.name,
                        })
                      }
                    >
                      <SemiBoldText style={styles.buttonText}>
                        바로가기
                      </SemiBoldText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Goto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 17,
    marginTop: 80,
  },
  userName: {
    fontSize: 27,
    color: '#7242E2',
  },
  disabledIcon: {
    width: 35,
    height: 35,
  },
  divider: {
    borderWidth: 1,
    borderColor: '#B5B2B2',
    width: 322,
    marginTop: 25,
    marginBottom: 25,
    alignSelf: 'center',
  },
  groupSection: {
    padding: 16,
    marginBottom: 10,
    // alignSelf: "center",
  },
  groupTitle: {
    fontSize: 18,
    color: '#3E247C',
    marginBottom: 12,
    marginLeft: 10,
    backgroundColor: '#EEE7FF',
    borderRadius: 15,
    textAlign: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 15,
    maxWidth: 140,
    overflow: 'hidden',
  },
  itemButton: {
    flexDirection: 'row',
    // justifyContent: "space-between",
    // alignItems: "center",
    // paddingVertical: 10,
    // paddingHorizontal: 12,
    // justifyContent: "center",
    borderWidth: 1,
    borderColor: '#B5B2B2',
    borderRadius: 20,
    width: 326,
    height: 80,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: '#3E247C',
    marginLeft: 10,
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#ADADAD',
    marginLeft: 10,
  },
  groupImage: {
    width: 48,
    height: 48,
    marginTop: 15,
    marginLeft: 18,
  },
  buttonText: {
    borderWidth: 1,
    borderColor: '#3E247C',
    fontSize: 13,
    borderRadius: 15,
    width: 57,
    height: 22,
    textAlign: 'center',
    color: '#3E247C',
    textAlignVertical: 'center',
    padding: 2.2,
  },
  togoButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
});
