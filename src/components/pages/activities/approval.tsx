import React, {useEffect, useMemo, useState} from "react";
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import ApplicationApproved from "@assets/svg/application-approved";
import {Ionicons} from "@expo/vector-icons";
import axios from "axios";
import {InputField} from "@components/molecules/form-fields";
import {BASE_URL} from "../../../services/config";
import {APPROVED, CASHIER, DIRECTOR, EVALUATOR,} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useSelector} from "react-redux";
import useKeyboard from 'src/hooks/useKeyboard';
import {errorColor} from "@styles/color";
import AwesomeAlert from "react-native-awesome-alerts";
import {alertStyle} from "@pages/activities/alert/styles";
import CustomAlert from "@pages/activities/alert/alert";
import {useAlert} from "@pages/activities/hooks/useAlert";

const {width, height} = Dimensions.get('window');

function Approval(props: any) {

    const {springValue, _springHide} = useAlert(props.visible, props.onDismissed);



    const isKeyboardVisible = useKeyboard();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [pickedCashier, setPickedCashier] = useState<any[]>()
    const [message, setMessage] = useState<string>("")
    const [cashier, setCashier] = useState()
    const [remarks, setRemarks] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [validateRemarks, setValidateRemarks] = useState<{ error: boolean }>({error: false})
    useEffect(() => {
        let isCurrent = true
        axios.get(BASE_URL + '/users',
            {
                headers: {
                    Authorization: "Bearer ".concat(user?.sessionToken)
                }
            }).then((response) => {
            const filterResponse = [...response.data].filter((item) => {
                return ([CASHIER].indexOf(item?.role?.key) != -1)
            })

            const res = filterResponse.map((item) => {
                return {value: item._id, label: item.firstName + " " + item.lastName}
            })

            if (isCurrent) setPickedCashier(res)
            if (res) {
                if (isCurrent) setCashier(res[0]?.value)
            }

        })
        return () => {
            isCurrent = false
        }
    }, [])


    function onConfirmation() {
        setMessage("Are you sure you want to approve this application?")
        setShowAlert(true)
    }

    const confirmDismissed = useMemo(() => {
        return false
    }, [showAlert])
          const [alertLoading, setAlertLoading] = useState(false)
          const [approvalIcon, setApprovalIcon] = useState(false)
        const [title, setTitle] = useState("Approve Application")
    const [showClose, setShowClose] = useState(false)
    return (

        <Modal
            animationType="none"
            transparent={true}
            visible={props.visible}
            onRequestClose={_springHide}>
                  <View style={showAlert ? {
                      zIndex: 1,
                      flex: 1,
                      width: width,
                      height: height,
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      backgroundColor: 'rgba(52,52,52,0.5)'
                  }: {}}>

                  </View>

            <CustomAlert
                showClose={showClose}
                type={approvalIcon ? APPROVED: ""}
                onDismissed={()=>{
                    setShowAlert(false)
                    setApprovalIcon(false)
                    setShowClose(false)
                }}
                onLoading={alertLoading}
                onCancelPressed={() => {
                    setShowAlert(false)
                    if(approvalIcon){
                        props.onDismissed()
                        setApprovalIcon(false)
                        setShowClose(false)
                    }
                    setTitle("Application Approve")
                }}
                onConfirmPressed={() => {
                    setAlertLoading(true)
                    props.confirm({cashier: cashier, remarks: remarks}, (response, callback) => {
                        setAlertLoading(false)


                        props.onDismissed(APPROVED, (bool)=>{
                            setApprovalIcon(true)
                            setTitle("Application Approved")
                            setMessage("Application has been approved.")
                            setShowClose(true)
                        })
                        callback(true)
                    })

                }} show={showAlert} title={title}
                message={message}/>
            {/*<AwesomeAlert
                actionContainerStyle={alertStyle.actionContainerStyle}
                overlayStyle={showAlert ? alertStyle.overlayStyle : {}}
                titleStyle={alertStyle.titleStyle}
                contentContainerStyle={alertStyle.contentContainerStyle}
                confirmButtonTextStyle={alertStyle.confirmButtonTextStyle}
                cancelButtonColor="#fff"
                cancelButtonTextStyle={alertStyle.cancelButtonTextStyle}
                cancelText="Cancel"
                confirmText="Yes"
                confirmButtonColor="#fff"
                show={showAlert}
                showProgress={false}
                title="Approved?"
                message={message}
                messageStyle={{textAlign: 'center'}}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                onCancelPressed={() => {
                    setShowAlert(false)
                }}
                onConfirmPressed={() => {

                    props.confirm({cashier: cashier, remarks: remarks}, (response, callback) => {
                        setShowAlert(false)

                        props.onDismissed()
                        callback(true)
                    })

                }}
            />*/}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.container]}
            >

                {!showAlert && <Animated.View style={[styles.group,  { transform: [{ scale:  springValue }] }]}>
                    <View style={styles.rect}>
                        <View style={{alignSelf: 'flex-start'}}>
                            <TouchableOpacity onPress={_springHide}>
                                <Ionicons name="md-close" style={{fontSize: 25}}></Ionicons>
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
                                style={{fontWeight: 'normal'}}
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
                            />}
                            <View style={{marginTop: 5}}>
                                <TouchableOpacity onPress={() => {
                                    onConfirmation()
                                }}>
                                    <View style={styles.rect3}>
                                        <Text style={styles.close}>Confirm</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Animated.View>}
            </KeyboardAvoidingView>
        </Modal>

    )
}

const styles = StyleSheet.create({

    element: {
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
        backgroundColor: "#031A6E",
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