import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPassword from './forgot-password';
import App from '@screens/app';
import AppIntro from '@screens/intro';
import Login from '@screens/login';
import DrawerNavigation from '@screens/HomeScreen/DrawerNavigation';
import ApplicationSteps from '@pages/application-steps';

type RootStackParamList = {
  App: undefined;
  AppIntro: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  HomeScreen: undefined;
  ApplicationSteps: undefined;
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
        <Stack.Screen name="ApplicationSteps" component={ApplicationSteps} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
