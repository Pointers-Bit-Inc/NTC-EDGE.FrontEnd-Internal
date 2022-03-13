import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivitiesPage from "@pages/activities/index";
import Search from "@pages/activities/search";
import {ACTIVITIES , SEARCH} from "../reducers/activity/initialstate";
type RootStackParamList = {
    Activities: undefined;
    Search: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const ActivitiesNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName="Activities"
        >
            <Stack.Screen name={ACTIVITIES} component={ActivitiesPage} />
            <Stack.Screen name={SEARCH} component={Search} />
        </Stack.Navigator>
    );
};

export default ActivitiesNavigator;
