import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppIntro from '@screens/intro';
import Registration from '@screens/registration';
import Login from '@screens/login';
import Home from '@screens/home';


type RootStackParamList = {
  AppIntro: undefined;
  Login: undefined;
  Registration: undefined;
  Home: undefined;
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
      >
        <Stack.Screen name="AppIntro" component={AppIntro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
