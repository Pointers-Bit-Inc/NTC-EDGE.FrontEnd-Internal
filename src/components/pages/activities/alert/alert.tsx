import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Animated,
    BackHandler,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Modal from "react-native-modal";
import {alertStyle} from "@pages/activities/alert/styles";
const {width} = Dimensions.get('window');
function CustomAlert(props) {
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.show}
            onRequestClose={() => {
                props.onDismissed()
            }}
        >
            <View>
                <View style={styles.group}>
                    <View style={styles.container___}>
                        <View style={styles.container__}>
                            <View style={styles.container_}>
                                <Text style={[styles.title, alertStyle.titleStyle]}>{props?.title}</Text>
                                <Text style={styles.description_}>
                                    {props?.message ? props?.message :   "Are you sure you want to approve this application?"}

                                </Text>
                                <View style={styles.separator}></View>
                            </View>
                            <View style={styles.action}>
                                <TouchableOpacity onPress={props.onCancelPressed}>
                                    <Text style={[styles.close, alertStyle.cancelButtonTextStyle]}>Close</Text>
                                </TouchableOpacity >
                                 <TouchableOpacity  onPress={props.onConfirmPressed}>
                                     {props.onLoading ? <ActivityIndicator color={"rgba(40,99,214,1)"}/> : <Text style={[styles.yes, alertStyle.confirmButtonTextStyle]}>Yes</Text>}

                                 </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

    );
}

const styles = StyleSheet.create({
    group: {
       
        height: 170,
        alignSelf: "center"
    },
    container___: {
       
        height: 170,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 14,
        borderWidth: 0,
        borderColor: "#000000"
    },
    container__: {
        height: 134,
        justifyContent: "space-between",
        marginTop: 18
    },
    container_: {
       
        height: 112,
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center"
    },
    title: {
         fontWeight: "500",
        fontSize: 14,
        color: "#121212",
        textAlign: "center"
    },
    description_: {
        padding: 10,
        color: "#121212",
        textAlign: "center"
    },
    separator: {
        height: 1,
        backgroundColor: "rgba(217,219,233,1)",
        alignSelf: "stretch"
    },
    action: {
       
        flexDirection: "row",
        justifyContent: "space-around"
    },
    close: {
        color: "rgba(220,38,38,1)"
    },
    yes: {
        color: "rgba(40,99,214,1)"
    }
});

export default CustomAlert;
