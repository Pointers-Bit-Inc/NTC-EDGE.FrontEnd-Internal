import {ActivityIndicator, View} from "react-native";
import {infoColor} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import Text from "@atoms/text";
import {Bold} from "@styles/font";
import React from "react";

const LoadingModal = () =>{
    return <View style={[{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    }]}>
        <View style={{
            backgroundColor: infoColor,
            borderRadius: 24,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: fontValue(20),
            paddingVertical: fontValue(9)
        }}>
            <ActivityIndicator color={"#fff"} style={{marginRight: 10}}/>
            <Text style={{color: "#fff", fontFamily: Bold, fontSize: fontValue(16)}}>Saving</Text>
        </View>

    </View>;
}

export default LoadingModal
