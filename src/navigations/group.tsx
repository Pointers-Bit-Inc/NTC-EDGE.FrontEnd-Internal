import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupScreen from "@pages/group/index";
type RootStackParamList = {
    GroupScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const GroupNavigator = ({ navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName={"GroupScreen"}
        >
            <Stack.Screen name={"GroupScreen"}  component={GroupScreen} />
        </Stack.Navigator>
    );
};

export default GroupNavigator;
