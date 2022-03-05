import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {APPROVED} from "../../../../reducers/activity/initialstate";
import React from "react";
import {Bold} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/script";

export const ApprovedButton = (props: { currentLoading: string, allButton: boolean, onPress: () => void }) => {

    return <View
        style={ { flex : 1 , paddingRight : 5 } }>
        <TouchableOpacity
            disabled={ props.currentLoading === APPROVED || props.allButton }
            onPress={ props.onPress }
        >
            <View style={ [styles.rect22 , {

                backgroundColor : (
                    props.allButton ? "#C4C4C4" : "rgba(0,171,118,1)") ,
                height : undefined ,
                paddingVertical : props.currentLoading === APPROVED ? fontValue(9) : fontValue(10.5)
            }] }>
                {
                    props.currentLoading === APPROVED ? (
                        <ActivityIndicator color={ "white" } size={ "small" }/>
                    ) : (
                        <Text
                            style={ [styles.approved , {
                                fontFamily: Bold,
                                color : props.allButton ? "#FCFCFC" : "rgba(255,255,255,1)" ,
                            }] }>
                            Approve
                        </Text>
                    )
                }
            </View>
        </TouchableOpacity>
    </View>;
}
const styles = StyleSheet.create({
    rect22: {
        
        borderRadius: 24
    },
    approved: {
        textAlign: "center",
        alignSelf: "center"
    },
})
