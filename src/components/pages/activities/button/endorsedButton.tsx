import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FOREVALUATION} from "../../../../reducers/activity/initialstate";
import ForwardIcon from "@assets/svg/forward";
import React from "react";
import {Bold} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";

export function EndorsedButton(props: { currentLoading: string, allButton: boolean, onPress: () => void }) {
    return <View style={{flex: 0.8,}}>
        <TouchableOpacity
            disabled={(props.currentLoading === FOREVALUATION || props.allButton)}
            onPress={props.onPress}
        >
            <View style={[{
                width: "85%",
                alignSelf: "flex-end",
                borderWidth: (props.allButton) ? 2 : 1,
                borderRadius: 24,
                borderColor: "#c4c4c4",
                backgroundColor: "#fff",
                height: undefined,
                paddingVertical: props.currentLoading === FOREVALUATION ? fontValue(8.5) : fontValue(10)
            }]}>
                <View
                    style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    {
                        props.currentLoading === FOREVALUATION ? (
                            <ActivityIndicator color={"white"} size={"small"}/>
                        ) : (
                            <Text style={[styles.endorse, {
                                fontFamily: Bold,
                                color: (props.allButton) ? "#C4C4C4" : "#031A6E",
                            }]}>Endorse</Text>

                        )
                    }
                    <ForwardIcon isdisable={props.allButton} style={{marginLeft: 6}}/>
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