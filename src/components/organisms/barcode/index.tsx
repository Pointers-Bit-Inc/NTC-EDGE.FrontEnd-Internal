import React from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Button from "@atoms/button";
import {primaryColor} from "@styles/color";
import Activities from "@organisms/activities";
import TabNavigation from "@screens/ActivitiesScreen/TabNavigation";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const barCodeIndex = ({navigation}: any) => {
    return (
            <Activities/>
    )
}

export default barCodeIndex