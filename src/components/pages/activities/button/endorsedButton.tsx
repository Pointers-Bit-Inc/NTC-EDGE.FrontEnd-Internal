import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FOREVALUATION} from "../../../../reducers/activity/initialstate";
import ForwardIcon from "@assets/svg/forward";
import React from "react";

export function EndorsedButton(props: { currentLoading: string, allButton: boolean, onPress: () => void }) {
    return <View style={{flex: 0.8,}}>
        <TouchableOpacity
            disabled={(props.currentLoading === FOREVALUATION || props.allButton)}
            onPress={props.onPress}
        >
            <View style={[{
                width: "85%",
                alignSelf: "flex-end",
                borderWidth: 1,
                borderRadius: 24,
                borderColor: "#c4c4c4",
                backgroundColor: ((props.allButton) ? "#C4C4C4" : "#fff"),
                height: undefined,
                paddingVertical: props.currentLoading === FOREVALUATION ? 8.5 : 10
            }]}>
                <View
                    style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    {
                        props.currentLoading === FOREVALUATION ? (
                            <ActivityIndicator color={"white"} size={"small"}/>
                        ) : (
                            <Text style={[styles.endorse, {
                                fontWeight: "600",
                                color: (props.allButton) ? "#808196" : "#031A6E",
                            }]}>Endorse</Text>

                        )
                    }
                    <ForwardIcon isDisable={props.allButton} style={{marginLeft: 6}}/>
                </View>

            </View>
        </TouchableOpacity>
    </View>;
}


const styles = StyleSheet.create({
    endorse: {
        textAlign: "center",
    },
})