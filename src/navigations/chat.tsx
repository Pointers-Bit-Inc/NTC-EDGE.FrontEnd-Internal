import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from '@screens/chat/list';
import ChatView from '@screens/chat/view';
import NewChat from '@screens/chat/new-chat';

type RootStackParamList = {
  ChatList: undefined;
  ChatView: undefined;
  NewChat: undefined;
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
      <Stack.Screen name="ChatView" component={ChatView} />
      <Stack.Screen name="NewChat" component={NewChat} />
    </Stack.Navigator>
  );
};

export default RegistrationNavigator;
