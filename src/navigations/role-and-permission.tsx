import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleAndPermissionScreen from "@pages/role-and-permission/index";
import CreateRoleAndPermissionScreen from "@pages/role-and-permission/create";
import EditRoleAndPermissionScreen from "@pages/role-and-permission/edit";
type RootStackParamList = {
    RoleAndPermissionScreen: undefined;
    CreateRoleAndPermissionScreen: undefined;
    EditRoleAndPermissionScreen: undefined;
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
            <Stack.Screen name={"CreateRoleAndPermissionScreen"}  component={CreateRoleAndPermissionScreen} />
            <Stack.Screen name={"EditRoleAndPermissionScreen"}  component={EditRoleAndPermissionScreen} />
        </Stack.Navigator>
    );
};

export default RoleAndPermissionNavigator;
