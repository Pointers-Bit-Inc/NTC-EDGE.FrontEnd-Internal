import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPassword from './forgot-password';
import Dial from '@screens/meet/video';
import App from '@screens/app';
import AppIntro from '@screens/intro';
import Login from '@screens/login';
import DrawerNavigation from '@screens/HomeScreen/DrawerNavigation';
import ActivitiesScreen from "@screens/ActivitiesScreen";
import UserProfile from "@pages/user-profile";
import Settings from '@pages/settings';

import Meeting from '@screens/meet';
import Participants from '@screens/meet/participants';
import CreateMeeting from '@screens/meet/create';
import VideoCall from '@screens/meet/video';

import ChatList from '@screens/chat';
import ViewChat from '@screens/chat/view';
import NewChat from '@screens/chat/new-chat';
import InitiateVideoCall from '@screens/meet/create';
import JoinVideoCall from '@screens/meet/video';
import Search from "@pages/activities/search";

type RootStackParamList = {
  App: undefined;
  AppIntro: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  HomeScreen: undefined;
  QrCodeScreen: undefined;
  ActivitiesScreen: undefined;
  UserProfileScreen: undefined;
  Settings: undefined;
  DrawerNavigation: undefined;
  Dial: undefined;
  Meeting: undefined;
  Participants: undefined;
  CreateMeeting: undefined;
  VideoCall: undefined;
  ChatList: undefined;
  ViewChat: undefined;
  NewChat: undefined;
  InitiateVideoCall: undefined;
  JoinVideoCall: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
          headerShown: false
        }}
        initialRouteName="App"
      >
        <Stack.Screen name="App" component={App} />
        <Stack.Screen name="AppIntro" component={AppIntro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="HomeScreen" component={DrawerNavigation} />
        <Stack.Screen name="ActivitiesScreen" component={ActivitiesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserProfileScreen" component={UserProfile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Dial" component={Dial} />
        <Stack.Screen name="Meeting" component={Meeting} />
        <Stack.Screen name="Participants" component={Participants} />
        <Stack.Screen name="CreateMeeting" component={CreateMeeting} />
        <Stack.Screen name="VideoCall" component={VideoCall} />
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="ViewChat" component={ViewChat} />
        <Stack.Screen name="NewChat" component={NewChat} />
        <Stack.Screen name="InitiateVideoCall" component={InitiateVideoCall} />
        <Stack.Screen name="JoinVideoCall" component={JoinVideoCall} />
        <Stack.Screen name="SearchActivities" component={Search} />

      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default RootNavigator;
