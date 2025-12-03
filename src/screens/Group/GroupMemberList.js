import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import SemiBoldText from '../../components/customText/SemiBoldText';
import BoldText from '../../components/customText/BoldText';
import PageNavHeader from '../../components/nav/PageNavHeader';
import { getGroupMembers } from '../../services/groupService';

const MemberManage = ({ navigation, route }) => {
  const { teamId } = route.params;
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    try {
      const data = await getGroupMembers(teamId);

      const formatted = data.map(member => ({
        id: member.userId,
        name: member.nickname,
        isAdmin: member.role === 'OWNER' || member.role === 'ADMIN',
      }));

      setMembers(formatted);
    } catch (error) {
      console.log('멤버 조회 실패 :', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <View style={styles.container}>
      <PageNavHeader
        pageName="회원 조회"
        navigation={navigation}
        teamId={teamId}
      />

      <View style={styles.divider} />
      <View style={styles.subTitle}>
        <SemiBoldText style={styles.totalMemberText}>총 멤버</SemiBoldText>
        <SemiBoldText style={styles.memberCount}>{members.length}</SemiBoldText>
      </View>

      <ScrollView style={{ marginTop: 20, paddingHorizontal: 25 }}>
        {members.map(member => (
          <View key={member.id} style={styles.memberBox}>
            <View style={styles.memberNameSection}>
              <SemiBoldText style={styles.memberName}>
                {member.name}
              </SemiBoldText>

              {member.isAdmin && (
                <View style={styles.adminBadge}>
                  <SemiBoldText style={styles.adminBadgeText}>
                    관리자
                  </SemiBoldText>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MemberManage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 8,
    backgroundColor: '#FFFFFF',
  },
  divider: {
    backgroundColor: '#EFEFEF',
    width: '100%',
    height: 6,
    marginVertical: 15,
  },
  subTitle: {
    flexDirection: 'row',
    gap: 3,
    backgroundColor: '#EEE7FF',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginTop: 10,
  },
  totalMemberText: {
    fontSize: 17,
    color: '#3E247C',
  },
  memberCount: {
    fontSize: 17,
    color: '#7242E2',
  },
  memberBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#B5B2B2',
    borderRadius: 15,
    padding: 26,
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberNameSection: {
    flexDirection: 'row',
    gap: 8,
  },
  memberName: {
    fontSize: 19,
    color: '#3E247C',
  },
  adminBadge: {
    borderWidth: 1,
    borderColor: '#7242E2',
    borderRadius: 10,
    width: 45,
    height: 18,
    marginTop: 2.3,
  },
  adminBadgeText: {
    fontSize: 12,
    color: '#7242E2',
    textAlign: 'center',
    top: 1,
  },
});
