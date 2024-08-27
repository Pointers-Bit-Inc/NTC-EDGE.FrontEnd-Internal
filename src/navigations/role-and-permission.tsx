import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleAndPermissionScreen from "@pages/role-and-permission/index";
type RootStackParamList = {
    RoleAndPermissionScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const RoleAndPermissionNavigator = ({ navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName={"RoleAndPermissionScreen"}
        >
            <Stack.Screen name={"RoleAndPermissionScreen"}  component={RoleAndPermissionScreen} />
        </Stack.Navigator>
    );
};

export default RoleAndPermissionNavigator;
