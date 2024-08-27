import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportScreen from "@pages/reports/index";
type RootStackParamList = {
    ReportScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const ReportNavigator = ({ navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName={"ReportScreen"}
        >
            <Stack.Screen name={"ReportScreen"}  component={ReportScreen} />
        </Stack.Navigator>
    );
};

export default ReportNavigator;
