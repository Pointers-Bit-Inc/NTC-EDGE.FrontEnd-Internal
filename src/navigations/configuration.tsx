import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConfigurationPage from "@pages/configuration/index";
import CreateConfigurationScreen from "@pages/configuration/create";
import CommissionerConfigurationScreen from "@pages/configuration/commissioner";
import EditConfigurationScreen from "@pages/configuration/edit";
type RootStackParamList = {
    ConfigurationScreen: undefined;
    CreateConfigurationScreen: undefined;
    EditConfigurationScreen: undefined;
    CommissionerConfigurationScreen: undefined;
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
            <Stack.Screen name={"CreateConfigurationScreen"}  component={CreateConfigurationScreen} />
            <Stack.Screen name={"CommissionerConfigurationScreen"}  component={CommissionerConfigurationScreen} />
            <Stack.Screen name={"EditConfigurationScreen"}  component={EditConfigurationScreen} />
        </Stack.Navigator>
    );
};

export default ConfigurationNavigator;
