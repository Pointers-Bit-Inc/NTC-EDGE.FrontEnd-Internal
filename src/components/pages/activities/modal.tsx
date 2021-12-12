import React, {Component, useState} from "react";
import {Modal, StyleSheet, View, Text, TouchableOpacity} from "react-native";
import CheckBox from "@atoms/checkbox";
import {FontAwesome} from "@expo/vector-icons";

function ActivityModal(props: any) {
    return (
        <Modal
            style={{borderWidth:0,borderColor:'none'}}
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
                props.onDismissed()
            }}>
            <View
                style={{
                    borderTopWidth: 2,
                    borderColor: "rgba(128,128,128,0.3)",
                    borderStyle:"solid",
                    height: '30%',
                    marginTop: 'auto',
                    backgroundColor:'white'
                }}>
                <View>
                    <View style={styles.rect}>

                        <View style={styles.group}>
                            <View style={styles.rect2Row}>
                                <View style={styles.rect2}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.onDismissed()
                                        } }>
                                        <View style={styles.closecontainer}>
                                            <View style={styles.rect12}>
                                                <View style={styles.group9}>
                                                    <FontAwesome name="close" style={styles.icon8}></FontAwesome>
                                                    <Text style={styles.close}>Close</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {props.ActivitiesStatus.map((activity: any, index: number)=> {
                            return <View key={activity.id} style={styles.group}>
                                <View style={styles.rect2Row}>
                                    <View style={styles.rect2}>
                                        <CheckBox isChecked={activity.checked} onClick={() => props.onChecked(activity)}/>
                                    </View>
                                    <View style={styles.rect3}>
                                        <Text>{activity.status}</Text>
                                    </View>
                                </View>
                            </View>
                        })}


                    </View>
                </View>
                </View>
        </Modal>

    );
}
export default ActivityModal
const styles = StyleSheet.create({
    rect12: {
        height: 25
    },
    group9: {

        marginLeft: 3
    },
    icon8: {
        color: "rgba(128,128,128,1)",
        fontSize: 19
    },
    close: {
        color: "#121212",
        marginTop: -17,
        marginLeft: 17
    },
    closecontainer:{
    },
    rectFiller: {
        flex: 1
    },
    rect: {
        height: 159,
        backgroundColor: "#fff"
    },
    group: {
        width: 399,
        height: 30,
        flexDirection: "row",
        marginTop: 13,
        marginLeft: 33
    },
    rect2: {

        height: 30,

    },
    rect3: {

        width: 364,
        height: 30,
        marginLeft: 7
    },
    rect2Row: {
        height: 30,
        flexDirection: "row",
        flex: 1,
        marginRight: -2
    },
    group1: {
        width: 399,
        height: 30,
        flexDirection: "row",
        marginTop: 5,
        marginLeft: 33
    },
    rect4: {
        width: 30,
        height: 30,

    },
    rect5: {
        width: 364,
        height: 30,
        marginLeft: 7
    },
    rect4Row: {
        height: 30,
        flexDirection: "row",
        flex: 1,
        marginRight: -2
    },
    group2: {
        width: 401,
        height: 30,
        flexDirection: "row",
        marginTop: 3,
        marginLeft: 33
    },
    rect7: {
        width: 30,
        height: 30,

    },
    rect8: {
        width: 364,
        height: 30,
        marginLeft: 7
    },
    rect7Row: {
        height: 30,
        flexDirection: "row",
        flex: 1
    },
    group3: {
        width: 401,
        height: 30,
        flexDirection: "row",
        marginTop: 5,
        marginLeft: 33
    },
    rect9: {
        width: 30,
        height: 30,

    },
    rect10: {
        width: 364,
        height: 30,
        marginLeft: 7
    },
    rect9Row: {
        height: 30,
        flexDirection: "row",
        flex: 1
    }
});