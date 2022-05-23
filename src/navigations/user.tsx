import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from "@pages/users";
type RootStackParamList = {
    UserScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const UserNavigator = ({ navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName={"UserScreen"}
        >
            <Stack.Screen name={"UserScreen"}  component={UserScreen} />
        </Stack.Navigator>
    );
};

export default UserNavigator;
