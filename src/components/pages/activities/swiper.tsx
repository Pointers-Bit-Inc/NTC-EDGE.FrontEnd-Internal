import {Text, TouchableOpacity, View} from "react-native";
import UnseeIcon from "@assets/svg/unsee";
import MoreIcon from "@assets/svg/more";
import React from "react";

export const renderSwiper = (index: number, progress: any, dragX: any, onPressUser: any, activity, unReadReadApplicationFn) => {
    let action = activity?.dateRead ? "Unread" : "Read"
    return <>

        <View style={{

            backgroundColor: '#2863d6',

            justifyContent: 'center'
        }}>
            <TouchableOpacity style={{
                paddingRight: 20,
                paddingLeft: 20,
                alignItems: "center",
                justifyContent: "center"
            }} onPress={() => {

                unReadReadApplicationFn(activity?._id, activity?.dateRead, true, (response) =>{
                   action = response
                })
            }
            }>
                <UnseeIcon width={18} height={18}/>
                <Text
                    style={{
                        color: 'white',
                        fontWeight: '600',

                    }}>

                    {action}
                </Text>
            </TouchableOpacity>

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