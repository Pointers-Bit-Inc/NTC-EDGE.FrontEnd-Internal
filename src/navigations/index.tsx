import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Registration from '@screens/registration';
import ForgotPassword from './forgot-password';
import Login from '@screens/login';
import Home from '@screens/home';


type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Registration: undefined;
  Home: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ForgotPassword"
        screenOptions={{
          gestureEnabled: false,
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
