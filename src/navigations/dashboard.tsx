import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from "@pages/dashboard/index";
type RootStackParamList = {
    DashboardScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const DashboardNavigator = ({ navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName={"DashboardScreen"}
        >
            <Stack.Screen name={"DashboardScreen"}  component={DashboardScreen} />
        </Stack.Navigator>
    );
};

export default DashboardNavigator;
