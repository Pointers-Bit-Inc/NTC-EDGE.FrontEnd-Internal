import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScheduleScreen from "@pages/schedule/index";
import CreateScheduleScreen from "@pages/schedule/create";
import EditScheduleScreen from "@pages/schedule/edit";
type RootStackParamList = {
    ScheduleScreen: undefined;
    CreateScheduleScreen: undefined;
    EditScheduleScreen: undefined
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const ScheduleNavigator = ({ navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName={"ScheduleScreen"}
        >
            <Stack.Screen name={"ScheduleScreen"}  component={ScheduleScreen} />
            <Stack.Screen name={"CreateScheduleScreen"}  component={CreateScheduleScreen} />
            <Stack.Screen name={"EditScheduleScreen"}  component={EditScheduleScreen} />
        </Stack.Navigator>
    );
};

export default ScheduleNavigator;
