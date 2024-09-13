import React, { FC } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { defaultColor, primaryColor } from '@/src/styles/color';
import Services from '../Services';
import Applications from '../Applications';

type TapNavScreenList = {
    Services: undefined,
    Appications: undefined,
}
const Tab = createMaterialTopTabNavigator<TapNavScreenList>();
const TabNavigation = () => {
    return (
        <Tab.Navigator
            style={{ marginTop: 20 }}
            screenOptions={{
                tabBarActiveTintColor: primaryColor,
                tabBarInactiveTintColor: defaultColor,
                swipeEnabled: true,
            }}
        >
            <Tab.Screen name="Services" component={Services} />
            <Tab.Screen name="Appications" component={Applications} />
        </Tab.Navigator>
    )
}

export default TabNavigation

