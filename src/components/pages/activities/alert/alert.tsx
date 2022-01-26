import React from "react";
import {ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import {alertStyle} from "@pages/activities/alert/styles";
import CloseModal from "@assets/svg/closeModal";
import {APPROVED, DECLINED, FOREVALUATION} from "../../../../reducers/activity/initialstate";
import EndorseToIcon from "@assets/svg/endorseTo";
import ApplicationApproved from "@assets/svg/application-approved";

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

                            <View style={[styles.container_, {paddingBottom: 5}]}>
                                {
                                    props?.type == DECLINED && <View>
                                        <CloseModal></CloseModal>
                                    </View>

                                }
                                {
                                    props?.type == FOREVALUATION && <View>
                                        <EndorseToIcon height_={60} width_={60} color={"#2863D6"}></EndorseToIcon>
                                    </View>
                                }
                                {
                                    props?.type == APPROVED && <View>
                                                 <ApplicationApproved/>
                                    </View>
                                }
                                <Text style={[styles.title, alertStyle.titleStyle]}>{props?.title}</Text>
                                <Text style={styles.description_}>
                                    {props?.message ? props?.message : "Are you sure you want to approve this application?"}

                                </Text>

                            </View>
                            <View style={styles.separator}></View>
                            <View style={[styles.action, {paddingTop: 6}]}>
                                {

                                    props?.showClose == false && <>
                                        <TouchableOpacity onPress={props.onConfirmPressed}>
                                            {props.onLoading ? <ActivityIndicator style={{alignSelf: "center"}}
                                                                                  color={"rgba(40,99,214,1)"}/> : <Text
                                                style={[styles.yes, alertStyle.confirmButtonTextStyle]}>{props?.confirmButton || 'Yes'}</Text>}

                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={props.onCancelPressed}>
                                            <Text style={[styles.close, alertStyle.cancelButtonTextStyle]}>Close</Text>
                                        </TouchableOpacity>

                                    </>

                                }

                                { props?.showClose == true &&
                                    <TouchableOpacity onPress={props.onCancelPressed}>
                                        <Text style={[alertStyle.confirmButtonTextStyle]}>Close</Text>
                                    </TouchableOpacity>
                                }

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

        alignSelf: "center"
    },
    container___: {
        paddingBottom: 3,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 14,
        borderWidth: 0,
        borderColor: "#000000"
    },
    container__: {
        paddingTop: 15,
        paddingBottom: 15,
        justifyContent: "space-around",

    },
    container_: {
        width: "90%",
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
        marginTop: 10,
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
