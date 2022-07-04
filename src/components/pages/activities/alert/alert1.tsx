import React, {useEffect, useState} from "react";
import {ActivityIndicator, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import {alertStyle} from "@pages/activities/alert/styles";
import CloseModal from "@assets/svg/closeModal";
import {APPROVED, DECLINED, FOREVALUATION} from "../../../../reducers/activity/initialstate";
import EndorseToIcon from "@assets/svg/endorseTo";
import ApplicationApproved from "@assets/svg/application-approved";
import {useAlert} from "../../../../hooks/useAlert";
import {Bold} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";

const {width} = Dimensions.get('window');

function CustomAlert(props) {
    const {springValue, _springHide} = useAlert(props.show,  props.onDismissed, props.onCancelPressed);



    return (
        <Modal
            useNativeDriver={true}
            supportedOrientations={['portrait', 'landscape']}
            animationType="none"
            transparent={true}
            visible={props.show}
            onRequestClose={() => {
                _springHide()
            }
            }
        >

            <Animated.View style={[   { transform: [{ scale: springValue}] }]}>
                <View style={styles.group}>
                    <View style={[styles.container___, styles.shadow]}>
                        <View style={styles.container__}>

                            <View style={[styles.container_, {padding: "5%", paddingHorizontal: 48,}]}>
                                {
                                    props?.type == DECLINED && <View>
                                        <CloseModal></CloseModal>
                                    </View>

                                }
                                {
                                    props?.type == FOREVALUATION && <View style={{paddingBottom: 10}}>
                                        <EndorseToIcon height_={fontValue(60)} width_={fontValue(60)} color={"#2863D6"}></EndorseToIcon>
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


                        </View>
                        <View style={[styles.action, {alignItems: "flex-end", paddingVertical: 15}]}>
                            {

                                props?.showClose == false && <>
                                    {props.onLoading ?  <ActivityIndicator style={{alignSelf: "center"}}
                                                                           color={"rgba(40,99,214,1)"}/> :
                                        <TouchableOpacity onPress={props.onConfirmPressed}>

                                            <Text
                                                style={[alertStyle.confirmButtonTextStyle]}>{props?.confirmButton || 'Yes'}</Text>

                                        </TouchableOpacity>
                                    }
                                    <TouchableOpacity onPress={() => {
                                        if(!props.onLoading){
                                            _springHide(false)
                                        }
                                    }}>
                                        <Text style={[props.onLoading ?alertStyle.disableButtonTextStyle :  alertStyle.cancelButtonTextStyle  ]}>Close</Text>
                                    </TouchableOpacity>

                                </>

                            }

                            {props?.showClose == true &&
                                <TouchableOpacity onPress={() => {

                                    _springHide(true)
                                }}>
                                    <Text style={[alertStyle.confirmButtonTextStyle]}>Close</Text>
                                </TouchableOpacity>
                            }

                        </View>
                    </View>
                </View>
            </Animated.View>



        </Modal>

    );
}

const styles = StyleSheet.create({
    group: {
        alignSelf: "center"
    },
    shadow: {shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 60,
        shadowOpacity: 0.25,
        shadowRadius: 20,},
    container___: {

        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 14,
        borderWidth: 0,
        borderColor: "#000000"
    },
    container__: {


        //paddingVertical: 15

    },
    container_: {

        width: "100%",
        alignItems: "center",
    },
    title: {
        fontFamily: Bold,
        fontSize: fontValue(14),
        color: "#121212",
        textAlign: "center"
    },
    description_: {

        padding: 10,
        color: "#121212",
        textAlign: "center"
    },

    action: {
        borderTopWidth: 1,
        borderTopColor: "rgba(217,219,233,1)",

        flexDirection: "row",
        justifyContent: "space-around"
    },
});

export default CustomAlert;