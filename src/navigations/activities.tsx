import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivitiesPage from "@pages/activities/index";
import Search from "@pages/activities/search";
import {ACTIVITIESLIST , SEARCH} from "../reducers/activity/initialstate";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
type RootStackParamList = {
    ActivitiesList: undefined;
    Search: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const ActivitiesNavigator = ({ navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName={ACTIVITIESLIST}
        >
            <Stack.Screen name={ACTIVITIESLIST}  component={ActivitiesPage} />
            <Stack.Screen name={SEARCH} component={Search} />
        </Stack.Navigator>
    );
};

export default ActivitiesNavigator;
