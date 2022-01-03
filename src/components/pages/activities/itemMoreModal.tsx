import React, { Component } from "react";
import {StyleSheet, View, Text, Modal, TouchableOpacity} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import PinToTopIcon from "@assets/svg/pintotop";
import BellIcon from "@assets/svg/bell";
import BellMuteIcon from "@assets/svg/bellMute";
import ArchiveIcon from "@assets/svg/archive";
import DeleteIcon from "@assets/svg/delete";
import {red} from "react-native-redash";
import CloseIcon from "@assets/svg/close";

function ItemMoreModal(props:any) {
    return (
        <Modal

            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {

            }}>

            <View style={[styles.container,]}>
                <View style={styles.rect}>
                    <View style={styles.group7}>

                        <View style={[styles.name]}>
                            <View></View>
                            <View>
                                <Text style={styles.centerName} >Name</Text>
                            </View>
                            <TouchableOpacity onPress={props.onDismissed}>
                                <CloseIcon  />
                            </TouchableOpacity>


                        </View>


                        <View style={styles.group6}>
                            <View style={styles.group5}>
                                <TouchableOpacity>
                                    <View style={styles.group3}>
                                        <View style={styles.rect10}></View>
                                        <View style={styles.group4}>
                                            <PinToTopIcon
                                                style={styles.icon1}
                                            />
                                            <Text style={styles.pinToTop1}>Pin to top</Text>
                                        </View>
                                        <View style={styles.rect11}></View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={styles.group3}>
                                        <View style={styles.rect10}></View>
                                        <View style={styles.group4}>
                                            <BellMuteIcon
                                                style={styles.icon1}
                                            />
                                            <Text style={styles.pinToTop1}>Mute</Text>
                                        </View>
                                        <View style={styles.rect11}></View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={styles.group3}>
                                        <View style={styles.rect10}></View>
                                        <View style={styles.group4}>
                                            <ArchiveIcon
                                                style={styles.icon1}
                                            />
                                            <Text style={styles.pinToTop1}>Archive</Text>
                                        </View>
                                        <View style={styles.rect11}></View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={styles.group3}>
                                        <View style={styles.rect10}></View>
                                        <View style={styles.group4}>
                                            <DeleteIcon
                                                style={styles.icon1}
                                            />
                                            <Text style={[styles.pinToTop1, {color: '#CF0327'}]}>Delete</Text>
                                        </View>
                                        <View style={styles.rect11}></View>
                                    </View>
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
    centerName:{
        fontSize: 18

    },
    container: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        justifyContent: 'flex-end',
    },
    rect: {
        height: "40%",
        backgroundColor: "rgba(255,255,255,1)",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    group7: {
        justifyContent: "flex-start",
        alignItems: "flex-end",

        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },
    name: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    },
    group6: {
        height: 15,
        alignSelf: "stretch"
    },
    group5: {
        justifyContent: "flex-start"
    },
    group2: {
        height: 62,
        justifyContent: "space-between",
        marginRight: 0,
        marginLeft: 0,
        alignSelf: "stretch"
    },
    rect9: {
        height: 1,
        alignSelf: "stretch"
    },
    group: {
        width: 116,
        height: 25,

        flexDirection: "row",
        justifyContent: "flex-end"
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 25,
        width: 14,
        alignSelf: "center"
    },
    pinToTop: {

        color: "#121212",
        fontSize: 18
    },
    rect7: {
        height: 1,
        backgroundColor: "rgba(234,234,234,1)",
        alignSelf: "stretch"
    },
    group3: {
        height: 62,
        justifyContent: "space-between",
        marginRight: 0,
        marginLeft: 0,
        alignSelf: "stretch"
    },
    rect10: {
        height: 1,
        alignSelf: "stretch"
    },
    group4: {
        width: 116,
        height: 25,

        flexDirection: "row",
        justifyContent: "flex-start"
    },
    icon1: {
        color: "rgba(128,128,128,1)",
        fontSize: 25,
        marginRight: 21,
        width: 14,
        alignSelf: "center"
    },
    pinToTop1: {

        color: "#121212",
        fontSize: 18
    },
    rect11: {
        height: 1,
        backgroundColor: "rgba(234,234,234,1)",
        alignSelf: "stretch"
    }
});

export default ItemMoreModal;
