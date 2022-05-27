import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from '@screens/chat';
import ViewChat from '@screens/chat/view';
import ChatInfo from '@screens/chat/info';
import NewChat from '@screens/chat/new-chat';
import InitiateVideoCall from '@screens/meet/create';

type RootStackParamList = {
  ChatList: undefined;
  ViewChat: undefined;
  ChatInfo: undefined;
  NewChat: undefined;
  InitiateVideoCall: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const RegistrationNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false
      }}
      initialRouteName="ChatList"
    >
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ViewChat" component={ViewChat} />
      <Stack.Screen name="ChatInfo" component={ChatInfo} />
      <Stack.Screen name="NewChat" component={NewChat} />
      <Stack.Screen name="InitiateVideoCall" component={InitiateVideoCall} />
    </Stack.Navigator>
  );
};

export default RegistrationNavigator;
