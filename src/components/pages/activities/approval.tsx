import React, {Component, useEffect, useState} from "react";
import {StyleSheet, View, Text, Modal, TouchableOpacity, TextInput} from "react-native";
import ApplicationApproved from "@assets/svg/application-approved";
import Dropdown from "@atoms/dropdown";
import axios from "axios";
import {BASE_URL} from "../../../services/config";
import {APPROVED, CASHIER, DIRECTOR, EVALUATOR, PAID} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useSelector} from "react-redux";
import AwesomeAlert from "react-native-awesome-alerts";

function Approval(props: any){
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [pickedCashier, setPickedCashier] = useState<any[]>()
    const [cashier, setCashier] = useState()
    const [remarks, setRemarks] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    useEffect(()=>{
        axios.get(BASE_URL + '/users' ,
            {
                headers: {
                    Authorization: "Bearer ".concat(user.sessionToken)
                }
            }).then((response)=>{
            const filterResponse = [...response.data].filter((item) =>{
                return ([CASHIER].indexOf(item?.role?.key) != -1)
            })

            const res = filterResponse.map((item) =>{
                return {value: item._id, label: item.firstName + " " + item.lastName}
            })

            setPickedCashier(res)
            if(res){
                setCashier(res[0]?.value)
            }

        })
    }, [])
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
                message={"are you sure you want to approve?"}
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
                    props.confirm({cashier: cashier, remarks: remarks})
                    setShowAlert(false)
                }}
            />
            <View style={styles.container}>
                <View style={styles.group}>
                    <View style={styles.rect}>
                        <ApplicationApproved style={styles.icon}></ApplicationApproved>
                        <Text style={styles.applicationApproved}>Application Approved</Text>
                        <View style={styles.group2}>
                            <TouchableOpacity onPress={() =>{
                                props.onDismissed()
                            }}>
                                <View style={[styles.element, {marginBottom: 5}]}>
                                    <Dropdown value={cashier}  onChangeValue={(value: any) => {
                                        setCashier(value)}
                                    }
                                              placeholder={{}}
                                              items={pickedCashier}></Dropdown>
                                </View>
                                <View style={[styles.element, {paddingBottom: 10}]}>
                                    <TextInput onChangeText={remark => setRemarks(remark)}
                                               defaultValue={remarks} placeholder={"Remark"} >

                                    </TextInput>
                                </View>

                                <View style={{display: 'flex'}} >

                                    <TouchableOpacity onPress={()=>{
                                    setShowAlert(true)
                                    }}>
                                        <View style={styles.rect3}>
                                            <Text style={styles.close}>Confirm</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={()=>{
                                       props.onDismissed()

                                    }}>
                                        <View style={styles.rect3}>
                                            <Text style={styles.close}>Close</Text>
                                        </View>
                                    </TouchableOpacity>
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
    element:{
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(202,210,225,1)",
        borderRadius: 6,
    },
    container: {
        flex: 1
    },
    group: {
        width: 340,
        height: '100%',
        marginTop: "50%",
        marginLeft: "6%"
    },
    rect: {
        width: 340,
        height: "50%",
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
        marginTop: 3,
        marginBottom: 3,
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