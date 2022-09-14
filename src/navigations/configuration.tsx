import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConfigurationPage from "@pages/configuration/index";
type RootStackParamList = {
    ConfigurationScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const ConfigurationNavigator = ({ navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName={"ConfigurationScreen"}
        >
            <Stack.Screen name={"ConfigurationScreen"}  component={ConfigurationPage} />
        </Stack.Navigator>
    );
};

export default ConfigurationNavigator;
