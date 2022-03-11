import {isMobile} from "@pages/activities/isMobile";
import {View} from "react-native";
import React , {Fragment} from "react";

export default function ActivityModalView(props) {
    return isMobile ? <View>{ props.children }</View> : <View style={ { flex : 0.6 } }> { props.children }</View>;
}