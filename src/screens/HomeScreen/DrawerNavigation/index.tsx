import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '@screens/HomeScreen';
import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { primaryColor } from 'src/styles/color';

type DrawerScreenList = {
    Home: undefined,
    Profile: undefined,
    Account: undefined,
    Notifications: undefined,
    Help: undefined,
    About: undefined,
    Logout: undefined,
}
const Drawer = createDrawerNavigator<DrawerScreenList>();

const DrawerNavigation = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
                drawerActiveTintColor: primaryColor,
                drawerActiveBackgroundColor: 'rgba(0,0,0,0)',
                drawerPosition: 'right',
                headerShown: false,
            }}
        >
            <Drawer.Screen name="Profile" options={{ title: "Wave C. Ambray", drawerIcon: ({ color, size }) => <Ionicons name="ios-person-circle-outline" color={color} size={size} /> }} component={HomeScreen} />
            <Drawer.Screen name="Home" options={{ drawerIcon: ({ color, size }) => <Feather name="home" color={color} size={size} /> }} component={HomeScreen} />
            <Drawer.Screen name="Account" options={{ drawerIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} /> }} component={HomeScreen} />
            <Drawer.Screen name="Notifications" options={{ drawerIcon: ({ color, size }) => <Ionicons name="ios-megaphone-outline" color={color} size={size} /> }} component={HomeScreen} />
            <Drawer.Screen name="Help" options={{ title: "Help Center",drawerIcon: ({ color, size }) => <Entypo name="lifebuoy" color={color} size={size} /> }} component={HomeScreen} />
            <Drawer.Screen name="About" options={{ drawerIcon: ({ color, size }) => <Feather name="info" color={color} size={size} /> }} component={HomeScreen} />
            <Drawer.Screen name="Logout" options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="logout" color={color} size={size} /> }} component={HomeScreen} />
        </Drawer.Navigator>
    )
}

export default DrawerNavigation
