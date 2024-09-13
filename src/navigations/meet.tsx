import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Meeting from '@screens/meet';
import Participants from '@screens/meet/add-participants';
import CreateMeeting from '@screens/meet/create';
import VideoCall from '@screens/meet/video';

type RootStackParamList = {
  Meeting: undefined;
  Participants: undefined;
  CreateMeeting: undefined;
  VideoCall: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const RegistrationNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false
      }}
      initialRouteName="Meeting"
    >
      <Stack.Screen name="Meeting" component={Meeting} />
      <Stack.Screen name="Participants" component={Participants} />
      <Stack.Screen name="CreateMeeting" component={CreateMeeting} />
      <Stack.Screen name="VideoCall" component={VideoCall} />
    </Stack.Navigator>
  );
};

export default RegistrationNavigator;
