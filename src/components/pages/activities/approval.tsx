import React, {Component, useCallback, useEffect, useMemo, useState} from "react";
import {StyleSheet, View, Text, Modal, TouchableOpacity, Dimensions, Platform, KeyboardAvoidingView } from "react-native";
import ApplicationApproved from "@assets/svg/application-approved";
import { Ionicons } from "@expo/vector-icons";
import Dropdown from "@atoms/dropdown";
import axios from "axios";
import { InputField } from "@components/molecules/form-fields";
import {BASE_URL} from "../../../services/config";
import {CASHIER, DIRECTOR, EVALUATOR,} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useSelector} from "react-redux";
import AwesomeAlert from "react-native-awesome-alerts";
import useKeyboard from 'src/hooks/useKeyboard';
import {errorColor} from "@styles/color";

const { width, height } = Dimensions.get('window');

function    Approval(props: any){
    const isKeyboardVisible = useKeyboard();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [pickedCashier, setPickedCashier] = useState<any[]>()
    const [message, setMessage] = useState<string>("")
    const [cashier, setCashier] = useState()
    const [remarks, setRemarks] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [validateRemarks, setValidateRemarks] = useState<{error: boolean}>({error: false})
    useEffect(()=>{
        let isCurrent = true
        axios.get(BASE_URL + '/users' ,
            {
                headers: {
                    Authorization: "Bearer ".concat(user?.sessionToken)
                }
            }).then((response)=>{
            const filterResponse = [...response.data].filter((item) =>{
                return ([CASHIER].indexOf(item?.role?.key) != -1)
            })

            const res = filterResponse.map((item) =>{
                return {value: item._id, label: item.firstName + " " + item.lastName}
            })

            if(isCurrent) setPickedCashier(res)
            if(res){
                setCashier(res[0]?.value)
            }

        })
        return () =>{
            isCurrent = false
        }
    }, [])



    function onConfirmation() {
        setMessage("Are you sure you want to approve this application?")
        setShowAlert(true)
    }
    const confirmDismissed = useMemo(() =>{
        return false
    }, [showAlert])
    return (

            <Modal

                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {
                }}>
                <AwesomeAlert
                    actionContainerStyle={{
                        flexDirection: "row-reverse"
                    }}
                    overlayStyle = {showAlert ? {
                        width: width,
                        height: height,
                        position: 'absolute',
                        backgroundColor: 'rgba(52,52,52,0.5)'
                    }: {}}
                    show={showAlert}
                    showProgress={false}
                    title="Confirm?"
                    message={message}
                    messageStyle={{ textAlign: 'center' }}
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
                             setMessage("")
                            props.confirm({cashier: cashier, remarks: remarks}, (response,callback) => {
                                setShowAlert(false)

                                    props.onDismissed()
                                   callback(true)
                            })

                    }}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={[styles.container]}
                >

                    <View style={styles.group}>
                        <View style={styles.rect}>
                            <View style={{ alignSelf: 'flex-start' }}>
                                <TouchableOpacity onPress={()=>{
                                    props.onDismissed()
                                }}>
                                    <Ionicons name="md-close" style={{ fontSize: 25 }}></Ionicons>
                                </TouchableOpacity>
                            </View>
                            <ApplicationApproved style={styles.icon}></ApplicationApproved>
                            <Text style={styles.applicationApproved}>
                               {props.isCashier ? 'PAYMENT CONFIRMED' : 'APPLICATION APPROVED'}
                            </Text>
                            <View style={styles.group2}>
                                {/* <View style={[styles.element, {marginBottom: 5}]}>
                                <Dropdown value={cashier}  onChangeValue={(value: any) => {
                                    setCashier(value)}
                                }
                                            placeholder={{}}
                                            items={pickedCashier}></Dropdown>
                            </View> */}
                                {[DIRECTOR, EVALUATOR].indexOf(user?.role?.key) != -1 && <InputField
                                    style={{ fontWeight: 'normal' }}
                                    outlineStyle={{
                                        borderColor: "rgba(202,210,225,1)",
                                        paddingTop: 5,
                                        height: (height < 720 && isKeyboardVisible) ? 45 : height * 0.15
                                    }}
                                    placeholder={'Remarks'}
                                    multiline={true}
                                    value={remarks}
                                    error={validateRemarks.error}
                                    errorColor={errorColor}
                                    onChangeText={(text: string) => {

                                        props.onChangeRemarks(text)
                                        setRemarks(text)
                                    }
                                    }
                                /> }
                                <View style={{ marginTop: 5 }} >
                                    <TouchableOpacity onPress={()=>{
                                        onConfirmation()
                                    }}>
                                        <View style={styles.rect3}>
                                            <Text style={styles.close}>Confirm</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
    },
    applicationApproved: {
        color: "#121212",
        fontSize: 18,
        marginTop: 10,
    },
    group2: {
        width: '100%',
        marginTop: 5,
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
    },
});
export default Approval