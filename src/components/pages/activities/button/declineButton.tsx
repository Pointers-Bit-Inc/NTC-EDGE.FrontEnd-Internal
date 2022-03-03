import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {DECLINED} from "../../../../reducers/activity/initialstate";
import React from "react";
import {Bold} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";

export function DeclineButton(props: { currentLoading: string, allButton: boolean, onPress: () => void }) {
    return <View style={{flex: 1}}>
        <TouchableOpacity
            disabled={(props.currentLoading === DECLINED || props.allButton)}
            onPress={props.onPress}
        >
            <View
                style={[
                    styles.rect24,
                    {
                        backgroundColor:"#fff",
                        height: undefined,
                        paddingVertical: props.currentLoading === DECLINED ? RFValue(8.5) : RFValue(9),
                        borderWidth: 2,
                        borderColor: (props.allButton) ? "#C4C4C4" : "rgba(194,0,0,1)",
                    }]
                }>

                {
                    props.currentLoading === DECLINED ? (
                        <ActivityIndicator color={"rgba(194,0,0,1)"} size={"small"}/>
                    ) : (
                        <Text
                            style={[styles.endorse, {
                                fontFamily: Bold,
                                color: (props.allButton) ? "#C4C4C4" : "rgba(194,0,0,1)",
                            }]}>Decline</Text>
                    )
                }
            </View>
        </TouchableOpacity>
    </View>;
}

const styles = StyleSheet.create({
    rect24: {
        height: 31,
        borderRadius: 24
    },
    endorse: {
        textAlign: "center",
    }
})