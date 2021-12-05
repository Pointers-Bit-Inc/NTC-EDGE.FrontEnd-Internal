import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegistrationPageOne from '@screens/registration';
import RegistrationPageTwo from '@screens/registration/signup';
import RegistrationSuccess from '@screens/registration/success';


type RootStackParamList = {
  RegistrationPageOne: undefined;
  RegistrationPageTwo: undefined;
  RegistrationSuccess: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const RegistrationNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="RegistrationPageOne"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false
      }}
    >
      <Stack.Screen name="RegistrationPageOne" component={RegistrationPageOne} />
      <Stack.Screen name="RegistrationPageTwo" component={RegistrationPageTwo} />
      <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccess} />
    </Stack.Navigator>
  );
};

export default RegistrationNavigator;
