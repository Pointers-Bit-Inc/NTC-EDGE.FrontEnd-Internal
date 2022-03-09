import {isMobile} from "@pages/activities/isMobile";
import {View} from "react-native";
import React from "react";

export default function ActivityModalView(props) {
    return isMobile ? <>{ props.children }</> : <View style={ { flex : 0.6 } }> { props.children }</View>;
}