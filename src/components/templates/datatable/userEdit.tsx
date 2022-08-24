import {FlatList, Text, TouchableOpacity, View} from "react-native";
import React, {memo} from "react";
import ProfileData from "@templates/datatable/ProfileData";
import ResetPasswordTab from "@templates/datatable/ResetPasswordTab";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import tabBarOption from "@templates/datatable/TabBarOptions";
import CloseIcon from "@assets/svg/close";
import {Bold} from "@styles/font";
const Tab = createMaterialTopTabNavigator();
const UserEdit = (props) => {
    return    <View style={[{flex: 1}]}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between",  paddingVertical: 15,paddingHorizontal: 15, backgroundColor: "#fff", width: "100%"}}>
            <View/>
            <Text style={{textAlign: "center", fontFamily: Bold}}></Text>
            <TouchableOpacity>
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