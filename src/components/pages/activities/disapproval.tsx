import React, {useState} from "react";
import {StyleSheet, View, Text, Modal, TouchableOpacity, TextInput} from "react-native";
import {Feather, Ionicons} from "@expo/vector-icons";
import {DECLINED, FOREVALUATION} from "../../../reducers/activity/initialstate";
import AwesomeAlert from "react-native-awesome-alerts";

function Disapproval(props:any) {
  const [showAlert, setShowAlert] = useState(false)
   return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}

            onRequestClose={() => {
            }}>
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Confirm?"
                message={`are you sure you want to decline ` + props?.user?.firstName + " " +  props?.user?.lastName }
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Cancel"
                confirmText="Yes"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setShowAlert(false)
                }}
                onConfirmPressed={() => {

                    props.onChangeApplicationStatus(DECLINED)
                    props.onDismissed()
                    setShowAlert(false)
                }}
            />
        <View style={styles.container}>
            <View style={styles.group3Filler}></View>
            <View style={styles.group3}>
                <View style={styles.rectFiller}></View>
                <View style={styles.rect}>
                    <View style={styles.iconColumn}>
                        <TouchableOpacity onPress={()=>{
                            props.onDismissed()
                        }}>
                            <Ionicons name="md-close" style={styles.icon}></Ionicons>
                        </TouchableOpacity>

                        <View style={styles.group}>
                            <View style={styles.icon2Row}>
                                <Feather
                                    name="file-text"
                                    style={styles.icon2}
                                ></Feather>
                                <View style={styles.nodRemarksColumn}>
                                    <Text style={styles.nodRemarks}>NOD/Remarks</Text>
                                    <Text style={styles.pleaseProvide}>
                                        Please provide reason of disapproval
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TextInput multiline style={styles.rect2}/>
                    </View>
                    <View style={styles.iconColumnFiller}></View>
                    <TouchableOpacity onPress={() => {
                        setShowAlert(true)

                    }}>
                    <View style={styles.group2}>

                            <View  style={styles.rect3}>
                                <Text style={styles.confirm}>Confirm</Text>
                            </View>


                    </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'

    },
    group3Filler: {
        flex: 1
    },
    group3: {

        width: "100%",
        height: 540
    },
    rectFiller: {
        flex: 1
    },
    rect: {
        height: 540,
        borderRadius: 22,
        width: "100%",
        backgroundColor: "rgba(255,255,255,1)"
    },
    icon: {
        color: "rgba(0,0,0,1)",
        fontSize: 30,
        marginLeft: 4
    },
    group: {
        width: 232,
        height: 35,
        marginTop: 12
    },
    icon2: {
        color: "rgba(53,62,89,1)",
        fontSize: 30
    },
    nodRemarks: {
        color: "#363f59",
        textAlign: "left",
        fontSize: 18,
        marginLeft: -1
    },
    pleaseProvide: {

        color: "#121212",
        fontSize: 12,
        marginLeft: -1
    },
    nodRemarksColumn: {
        marginLeft: 6
    },
    icon2Row: {
        height: 35,
        flexDirection: "row"
    },
    rect2: {

        width: 355,
        height: 290,
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(218,218,222,1)",
        borderRadius: 8,
        marginTop: 12,
        marginLeft: 1
    },
    iconColumn: {

        width: 340,
        marginTop: 14,
        marginLeft: 17
    },
    iconColumnFiller: {
        flex: 1
    },
    group2: {
        width: 340,
        height: 40,
        marginBottom: 94,
        marginLeft: 17
    },
    rect3: {
        width: 340,
        height: 40,
        backgroundColor: "rgba(47,91,250,1)",
        borderRadius: 9
    },
    confirm: {

        color: "rgba(255,255,255,1)",
        marginTop: 12,
        marginLeft: 145
    }
});

export default Disapproval;
