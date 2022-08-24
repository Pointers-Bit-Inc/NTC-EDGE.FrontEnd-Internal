import {FlatList, Text, TouchableOpacity, View} from "react-native";
import React, {memo} from "react";
import ProfileData from "@templates/datatable/ProfileData";
import ResetPasswordTab from "@templates/datatable/ResetPasswordTab";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import tabBarOption from "@templates/datatable/TabBarOptions";
import CloseIcon from "@assets/svg/close";
import {Bold} from "@styles/font";
import {RootStateOrAny, useSelector} from "react-redux";
import {fontValue} from "@pages/activities/fontValue";
const Tab = createMaterialTopTabNavigator();
const UserEdit = (props) => {
    const data = useSelector((state: RootStateOrAny) => {
        return state.application.data
    });
    return    <View style={[{flex: 1}]}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between",  paddingVertical: 15,paddingHorizontal: 15, backgroundColor: "#fff", width: "100%"}}>
            <View/>
            <Text style={{fontSize: fontValue(14), textAlign: "center", fontFamily: Bold}}>{data?.firstName + " " + data?.middleName + " " + data?.lastName}</Text>
            <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                <CloseIcon></CloseIcon>
            </TouchableOpacity>
        </View>
        <Tab.Navigator  screenOptions={tabBarOption}>
            <Tab.Screen name="Profile Data" component={ProfileData} />
            <Tab.Screen name="Reset Password" component={ResetPasswordTab} />
        </Tab.Navigator>

    </View>
}

export default memo(UserEdit)