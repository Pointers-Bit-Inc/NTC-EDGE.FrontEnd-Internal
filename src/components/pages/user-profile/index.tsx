import React from "react";
import UserProfileScreen from "@pages/user-profile/user-profile";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ResetPassword from "@pages/user-profile/resetPassword";

const Stack = createNativeStackNavigator();

 const UserProfile = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen options={{headerShown: false}} name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
    );
}


export  default UserProfile
