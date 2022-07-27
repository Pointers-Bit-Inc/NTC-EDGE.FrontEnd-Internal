import {ActivityIndicator, useWindowDimensions, View} from "react-native";
import {infoColor} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import Text from "@atoms/text";
import {Bold} from "@styles/font";
import React from "react";
import CheckMarkIcon from "@assets/svg/checkmark";

const LoadingModal = (props) =>{
    const dimensions = useWindowDimensions();
    return <View style={[{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 4,
        backgroundColor:  props?.saved ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)"
    }]}>
        <View style={[{
            backgroundColor:  props?.saved ? infoColor : "#fff",
            borderRadius: 24,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: fontValue(20),
            paddingVertical: fontValue(9),

        },  !props?.saved ? {shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,} : {}]}>

            {  props?.saved ? <ActivityIndicator size={16}  color={"#fff"} style={{marginRight: 10}}/> : <CheckMarkIcon color={infoColor} />}
                <Text style={{color: props?.saved ? "#fff" : infoColor, fontFamily: Bold, fontSize: fontValue(16)}}>{props?.loading ? "Saving" : "Saved" }</Text>

        </View>

    </View>;
}

export default LoadingModal
