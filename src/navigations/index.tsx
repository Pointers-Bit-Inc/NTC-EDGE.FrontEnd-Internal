import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Registration from '@screens/registration';
import Login from '@screens/login';
import Home from '@screens/home';
import DrawerNavigation from '@screens/HomeScreen/DrawerNavigation';


type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  HomeScreen: undefined;
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
        initialRouteName="HomeScreen"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="HomeScreen" component={DrawerNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
