import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from "@pages/users";
import UserEdit from "@templates/datatable/userEdit";
type RootStackParamList = {
    UserScreen: undefined;
    UserEdit:undefined;
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
            <Stack.Screen name={"UserEdit"}  component={UserEdit} />
        </Stack.Navigator>
    );
};

export default UserNavigator;
