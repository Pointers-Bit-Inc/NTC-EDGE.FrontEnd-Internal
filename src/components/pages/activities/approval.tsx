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
                        <Text style={styles.applicationApproved}>
                            {props.isCashier ? 'PAYMENT CONFIRMED' : 'APPLICATION APPROVED'}
                        </Text>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    group: {
        width: '100%',
        paddingHorizontal: 10,
    },
    rect: {
        width: '100%',
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 12,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        color: "rgba(100,219,68,1)",
        fontSize: 94,
        height: 102,
        width: 94,
        marginTop: 28,
    },
    applicationApproved: {
        color: "#121212",
        fontSize: 20,
        marginTop: 25,
    },
    group2: {
        width: '100%',
        marginTop: 60,
    },
    rect3: {
        width: '100%',
        backgroundColor: "rgba(47,91,250,1)",
        borderRadius: 9,
        padding: 15,
        paddingVertical: 10,
        alignItems: 'center',
    },
    close: {
        color: "rgba(255,255,255,1)",
    }
});
export default Approval