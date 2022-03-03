import {Text, TouchableOpacity, View} from "react-native";
import UnseeIcon from "@assets/svg/unsee";
import MoreIcon from "@assets/svg/more";
import React from "react";
import SeeIcon from "@assets/svg/see";
import {Bold , Regular} from "@styles/font";
import {disabledColor} from "@styles/color";
import {RFValue} from "react-native-responsive-fontsize";

export const renderSwiper = (index: number, progress: any, dragX: any, onPressUser: any, activity, unReadReadApplicationFn) => {
    let action = activity?.dateRead ? "Unread" : "Read"
    return <>
        <View style={{
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: disabledColor,  // '#2863d6',
            justifyContent: 'center'
        }}>
            <TouchableOpacity style={{
                paddingRight: 20,
                paddingLeft: 20,
                alignItems: "center",
                justifyContent: "center"
            }} onPress={() => {

                unReadReadApplicationFn(activity?._id, activity?.dateRead, true, (response) => {
                    action = response
                })
            }
            }>

                {action == "Read" ? <UnseeIcon width={RFValue(18)} height={RFValue(18)}/> :  <SeeIcon width={18} height={18}/>}
                <Text
                    style={{
                        color: 'white',
                        fontFamily: Regular,

                    }}>

                    {action}
                </Text>
            </TouchableOpacity>

        </View>
        <View style={{
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            paddingRight: 30,
            
            paddingLeft: 30,
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: '#F1F1F1',
            justifyContent: 'center',
            alignItems: "center"
        }}>
            <TouchableOpacity style={{

            }} onPress={() => {
                onPressUser({icon: "more"})
            }}>
                <View style={{
                    justifyContent: "center",
                    borderRadius: 20,
                    backgroundColor: "#fff",
                    padding: 5,
                    alignSelf: "center",
                }}>
                    <MoreIcon width={RFValue(18)} height={RFValue(18)} fill={"#000"}/>
                </View>

                <Text
                    style={{
                        textAlign: "center",
                        color: '#606A80',
                        fontFamily: Regular,
                    }}>
                    More
                </Text>
            </TouchableOpacity>
        </View>

    </>
}