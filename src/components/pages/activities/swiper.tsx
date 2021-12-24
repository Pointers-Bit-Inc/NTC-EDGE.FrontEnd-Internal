import {Text, View} from "react-native";
import UnseeIcon from "@assets/svg/unsee";
import MoreIcon from "@assets/svg/more";
import React from "react";

export const renderSwiper = (index: number, progress: any, dragX: any) => {

    return <>

        <View style={{
        paddingRight: 20,
            paddingLeft: 20,
            backgroundColor: '#2863d6',
            alignItems: "center",
            justifyContent: 'center'
    }}>
    <UnseeIcon width={18} height={18} fill={"#fff"}/>
    <Text
    style={{
        color: 'white',
            fontWeight: '600',

    }}>
    Unread
    </Text>
    </View>
    <View style={{
        paddingRight: 40,
            paddingLeft: 40,
            backgroundColor: '#e5e5e5',
            justifyContent: 'center',
            alignItems: "center"
    }}>
    <MoreIcon width={18} height={18} fill={"#000"}/>
    <Text
    style={{
        color: '#000',
            fontWeight: '600',
    }}>
    More
    </Text>
    </View>
    </>
}