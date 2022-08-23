import {FlatList, Text, View} from "react-native";
import Row from "@pages/activities/application/Row";
import React, {memo} from "react";
import styles from "@styles/applications/basicInfo"
import {transformText} from "../../../utils/ntc";
import _ from "lodash";
import NavBar from "@molecules/navbar";
import ProfileImage from "@components/atoms/image/profile";
import {fontValue} from "@pages/activities/fontValue";
import {RootStateOrAny, useSelector} from "react-redux";
import ProfileData from "@templates/datatable/ProfileData";
import ResetPasswordTab from "@templates/datatable/ResetPasswordTab";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import tabBarOption from "@templates/datatable/TabBarOptions";
const Tab = createMaterialTopTabNavigator();
const UserEdit = () => {
    return   <Tab.Navigator  screenOptions={tabBarOption}>
        <Tab.Screen name="Profile Data" component={ProfileData} />
        <Tab.Screen name="Reset Password" component={ResetPasswordTab} />
    </Tab.Navigator>
}

export default memo(UserEdit)