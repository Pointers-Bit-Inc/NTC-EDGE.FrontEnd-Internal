import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {DECLINED} from "../../../../reducers/activity/initialstate";
import React from "react";
import {Bold} from "@styles/font";

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
                        backgroundColor: (props.allButton) ? "#C4C4C4" : "#fff",
                        height: undefined,
                        paddingVertical: props.currentLoading === DECLINED ? 8.5 : 9,
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
                                color: (props.allButton) ? "#808196" : "rgba(194,0,0,1)",
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