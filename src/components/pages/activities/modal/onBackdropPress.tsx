import {TouchableWithoutFeedback , View} from "react-native";
import React from "react";

export function     OnBackdropPress(props: { onPressOut: any, styles: any }) {
    return <TouchableWithoutFeedback onPressOut={ props.onPressOut }>
        <View style={ [{
            width : "100%" ,
            height : "100%" ,
            alignItems : "center" ,
            justifyContent : "flex-end" ,
            position : "absolute" ,
            backgroundColor : "rgba(255, 255, 255, 0)"
        }, props.styles] }/>
    </TouchableWithoutFeedback>;
}