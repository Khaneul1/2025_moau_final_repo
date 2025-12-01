import * as React from 'react';
// import { useEffect } from 'react';
// import "./src/api/interceptors";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './src/screens/login/StartScreen';
import KakaoLoginScreen from './src/screens/login/KaKaoLoginScreen';
import CalendarView from './src/screens/Main/calendar/CalendarView';
import MonthCalendarView from './src/screens/Main/calendar/MonthCalendarView';
import NavBar from './src/components/nav/NavBar';
import Goto from './src/components/nav/Goto';
import UserMain from './src/screens/Main/UserMain';
import GroupMain from './src/screens/Main/GroupMain';
// import GroupNoticeDetail from './src/screens/Group/GroupNoticeDetail';
import GroupAccountDetail from './src/screens/Group/GroupAccountDetail';
import GroupCommunityDetail from './src/screens/Group/GroupCommunityDetail';
import RecentTransaction from './src/screens/Group/account/RecentTransaction';
import ReceiptDetail from './src/screens/Group/account/ReceiptDetail';
import ReceiptList from './src/screens/Group/account/ReceiptList';
import ReceiptPhoto from './src/screens/Group/account/ReceiptPhoto';
import ManagerGuard from './src/screens/Manager/ManagerGuard';
import PostDetail from './src/screens/Group/community/PostDetail';
import PostUpdate from './src/screens/Group/community/PostUpdate';
import MyPostDetail from './src/screens/Group/community/MyPostDetail';
import ManagerMain from './src/screens/Manager/ManagerMain';
import ReqReceiptDetail from './src/screens/Manager/requestReceipt/ReqReceiptDetail';
import RejectReceipt from './src/screens/Manager/requestReceipt/RejectReceipt';
import GroupManage from './src/screens/Manager/group/GroupManage';
import MemberManage from './src/screens/Manager/member/MemberManage';
import NoticePost from './src/screens/Manager/notice/NoticePost';
import MyNoticeDetail from './src/screens/Manager/notice/MyNoticeDetail';
import RequestJoin from './src/screens/Manager/group/RequestJoin';
import ReqReceiptList from './src/screens/Manager/requestReceipt/ReqReceiptList';
import GroupMemberList from './src/screens/Group/GroupMemberList';
import GroupNoticeDetail from './src/screens/Group/notice/GroupNoticeDetail';
import GroupNoticeList from './src/screens/Group/notice/GroupNoticeList';
import AccountManage from './src/screens/Manager/accountManage/AccountManage';
import RequestAccept from './src/screens/Group/account/RequestAccept';
// import { useAuthStore } from './src/store/useAuthStore';

const Stack = createNativeStackNavigator();

const App = () => {
  // const startTokenAutoRefresh = useAuthStore(
  //   state => state.startTokenAutoRefresh,
  // );

  // useEffect(() => {
  //   startTokenAutoRefresh();
  // }, [startTokenAutoRefresh]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={KakaoLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CalendarView" component={CalendarView} />
        <Stack.Screen
          name="MonthCalendar"
          component={MonthCalendarView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NavBar"
          component={NavBar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Goto"
          component={Goto}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserMain"
          component={UserMain}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupMain"
          component={GroupMain}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="GroupAccountDetail"
          component={GroupAccountDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupCommunityDetail"
          component={GroupCommunityDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecentTransaction"
          component={RecentTransaction}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReceiptDetail"
          component={ReceiptDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReceiptList"
          component={ReceiptList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReceiptPhoto"
          component={ReceiptPhoto}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManagerGuard"
          component={ManagerGuard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CommunityPostDetail"
          component={PostDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CommunityPost"
          component={PostUpdate}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyPostDetail"
          component={MyPostDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManagerMain"
          component={ManagerMain}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReqReceiptDetail"
          component={ReqReceiptDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RejectReceipt"
          component={RejectReceipt}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="GroupManage"
          component={GroupManage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MemberManage"
          component={MemberManage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NoticePost"
          component={NoticePost}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccountManage"
          component={AccountManage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyNoticeDetail"
          component={MyNoticeDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RequestJoin"
          component={RequestJoin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReqReceiptList"
          component={ReqReceiptList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupMemberList"
          component={GroupMemberList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupNoticeDetail"
          component={GroupNoticeDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupNoticeList"
          component={GroupNoticeList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RequestAccept"
          component={RequestAccept}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
