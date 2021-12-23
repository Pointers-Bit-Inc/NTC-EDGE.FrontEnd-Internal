import React, { Component } from "react";
import {StyleSheet, View, Text, Modal, TouchableOpacity} from "react-native";
import ApplicationApproved from "@assets/svg/application-approved";

function Approval(props: any){
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}

            onRequestClose={() => {
            }}>
            <View style={styles.container}>
                <View style={styles.group}>
                    <View style={styles.rect}>
                        <ApplicationApproved style={styles.icon}></ApplicationApproved>
                        <Text style={styles.applicationApproved}>Application Approved</Text>
                        <View style={styles.group2}>
                            <TouchableOpacity onPress={() =>{
                                props.onDismissed()
                            }}>
                                <View style={styles.rect3}>
                                    <Text style={styles.close}>Close</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group: {
        width: 340,
        height: 260,
        marginTop: 276,
        marginLeft: 18
    },
    rect: {
        width: 340,
        height: 260,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 12
    },
    icon: {
        color: "rgba(100,219,68,1)",
        fontSize: 94,
        height: 102,
        width: 94,
        marginTop: 28,
        marginLeft: 123
    },
    applicationApproved: {
        color: "#121212",
        fontSize: 20,
        marginTop: 25,
        marginLeft: 75
    },
    group2: {
        width: 304,
        height: 40,
        marginTop: 30,
        marginLeft: 18
    },
    rect3: {
        width: 304,
        height: 40,
        backgroundColor: "rgba(47,91,250,1)",
        borderRadius: 9
    },
    close: {
        color: "rgba(255,255,255,1)",
        marginTop: 12,
        marginLeft: 135
    }
});
export default Approval