import {ActivityIndicator, Text, View} from "react-native";
import {Regular} from "@styles/font";
import React from "react";

function ToastLoading() {
    return <View style={{alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator color={"#fff"}/>
        <View style={{paddingTop: 6}}>
            <Text style={{color: "#fff", fontFamily: Regular, fontSize: 16}}>Loading...</Text>
        </View>

    </View>;
}

export default ToastLoading
