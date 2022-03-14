import {isMobile} from "@pages/activities/isMobile";
import {useWindowDimensions , View} from "react-native";
import React , {Fragment} from "react";

export default function ActivityModalView(props) {
    const dimensions = useWindowDimensions();
    return isMobile && dimensions.width >= 768  ? <View>{ props.children }</View> : <View style={ { flex : 0.6 } }> { props.children }</View>;
}