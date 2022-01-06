import {Text, TouchableOpacity, View} from "react-native";
import UnseeIcon from "@assets/svg/unsee";
import MoreIcon from "@assets/svg/more";
import React from "react";

export const renderSwiper = (index: number, progress: any, dragX: any, onPressUser:any) => {

    return <>

        <View style={{
            paddingRight: 20,
            paddingLeft: 20,
            backgroundColor: '#2863d6',
            alignItems: "center",
            justifyContent: 'center'
        }}>
            <UnseeIcon width={18} height={18} />
            <Text
                style={{
                    color: 'white',
                    fontWeight: '600',

                }}>
                Unread
            </Text>
        </View>
        <TouchableOpacity style={{
            paddingRight: 40,
            paddingLeft: 40,
            backgroundColor: '#e5e5e5',
            justifyContent: 'center',
            alignItems: "center"
        }} onPress={() => {
            onPressUser({icon: "more"})
        }}>
                <MoreIcon width={18} height={18} fill={"#000"}/>
                <Text
                    style={{
                        color: '#000',
                        fontWeight: '600',
                    }}>
                    More
                </Text>
</TouchableOpacity>
    </>
}