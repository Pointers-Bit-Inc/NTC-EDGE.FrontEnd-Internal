import React, {useEffect, useState} from "react";
import {Animated, BackHandler, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
const {width} = Dimensions.get('window');
function CustomAlert(props) {
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.show}
            onRequestClose={() => {

            }}
        >
            <View style={styles.container}>
                <View style={styles.group}>
                    <View style={styles.container___}>
                        <View style={styles.container__}>
                            <View style={styles.container_}>
                                <Text style={styles.title}>{props?.title}</Text>
                                <Text style={styles.description_}>
                                    {props?.message ? props?.message :   "Are you sure you want to approve this application?"}

                                </Text>
                                <View style={styles.separator}></View>
                            </View>
                            <View style={styles.action}>
                                <TouchableOpacity onPress={props.onCancelPressed}>
                                    <Text style={styles.close}>Close</Text>
                                </TouchableOpacity>
                                 <TouchableOpacity onPress={props.onConfirmPressed}>
                                     <Text style={styles.yes}>Yes</Text>
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
    container: {
         zIndex: 1,
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(52,52,52,0.5)'
    },
    group: {
        width: width/2,
        height: 170,
        alignSelf: "center"
    },
    container___: {
        width: width/2,
        height: 170,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 14,
        borderWidth: 0,
        borderColor: "#000000"
    },
    container__: {
        width: width/2,
        height: 134,
        justifyContent: "space-between",
        marginTop: 18
    },
    container_: {
        width: width/2,
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

        color: "#121212"
    },
    separator: {
        height: 1,
        backgroundColor: "rgba(217,219,233,1)",
        alignSelf: "stretch"
    },
    action: {
        width: width/2,
        height: 16,
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
