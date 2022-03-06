import React, {useEffect, useState} from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {InputField} from "@molecules/form-fields";
import axios from "axios";
import EndorseToIcon from "@assets/svg/endorseTo";
import {BASE_URL} from "../../../../services/config";
import {RootStateOrAny, useSelector} from "react-redux";
import {ACCOUNTANT , DIRECTOR , EVALUATOR , FOREVALUATION} from "../../../../reducers/activity/initialstate";
import useKeyboard from 'src/hooks/useKeyboard';
import {disabledColor , errorColor , primaryColor} from "@styles/color";
import CustomAlert from "@pages/activities/alert/alert";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import {useOrientation} from "@pages/activities/hooks/useOrientation";
import {getRole} from "@pages/activities/script";
import {Bold , Regular , Regular500} from "@styles/font";
import CloseIcon from "@assets/svg/close";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";

const {height, width} = Dimensions.get('window');

const Endorsed = (props: any) => {

    const user = useSelector((state: RootStateOrAny) => state.user);
    const [pickedEndorsed, setPickedEndorsed] = useState<any[]>()
    const [text, setText] = useState("")
    const [endorsed, setEndorsed] = useState()
    const [showAlert, setShowAlert] = useState(false)
    const isKeyboardVisible = useKeyboard();
    const [message, setMessage] = useState("")
    const [alertLoading, setAlertLoading] = useState(false)
    const [showClose, setShowClose] = useState(false)
    const [title, setTitle] = useState("Endorse Application to")
    const [selected, setSelected] = useState(undefined);
    const [validateRemarks, setValidateRemarks] = useState<{ error: boolean }>({error: false})

    const fetchEndorse = async (isCurrent: boolean) => {
        await axios.get(BASE_URL + '/users',
            {
                headers: {
                    Authorization: "Bearer ".concat(user.sessionToken)
                }
            }).then((response) => {
            const filterResponse = [...response.data].filter((item) => {
                return  getRole(item,[DIRECTOR, EVALUATOR, ACCOUNTANT]) //&& user?._id != item?._id
            })

            const res = filterResponse?.map((item) => {
                return {value: item._id, label: item.firstName + " " + item.lastName}
            })

            if (isCurrent && !!res) {
                setPickedEndorsed(res)
                setEndorsed(props?.assignedPersonnel || res[0]?.value)
            }

        })
    };

    useEffect(() => {
        let isCurrent = true
        fetchEndorse(isCurrent);
        return () => {
            isCurrent = false
        }
    }, [])
    const [picked, setPicked] = useState(false)
    useEffect(()=>{

        setPicked(pickedEndorsed?.find(picked => {
            return picked.value === endorsed
        })?.label);
    }, [endorsed, picked])

    const onEndorseConfirm = () => {


        setMessage(`` + picked)
        props.remarks({endorseId: endorsed, remarks: text, message})
        if(pickedEndorsed && !!picked ){
            setShowAlert(true)
        } else{
            Alert.alert('Alert',"Something went wrong." )
        }


    }
    const onCancelPress = () => {
        setTitle("Endorse Application to")
        if (showClose) {
            setShowAlert(false)
            setShowClose(false)

            props.onDismissed()
        } else {
            setShowClose(false)
            setShowAlert(false)
            props.onModalDismissed()
        }
        setAlertLoading(false)
    }


    const orientation = useOrientation();

    return (
        <Modal
            supportedOrientations={['portrait', 'landscape']}
            animationType="slide"
            transparent={true}
            visible={props.visible}

            onRequestClose={() => {
                onCancelPress()
            }}>

            <View style={showAlert ? {
                zIndex: 1,
                flex: 1,
                width: "100%",
                height: "100%",
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                backgroundColor: 'rgba(52,52,52,0.5)'
            } : {}}/>

            <CustomAlert

                showClose={showClose}
                type={FOREVALUATION}
                onDismissed={onCancelPress}
                onLoading={alertLoading}
                onCancelPressed={onCancelPress}
                confirmButton={"Proceed"}
                onConfirmPressed={() => {

                    setAlertLoading(true)

                    props.onChangeApplicationStatus({
                        status: FOREVALUATION,
                        id: endorsed,
                        remarks: text
                    }, (bool, callback: (bool) => {}) => {
                        if(bool){
                            setAlertLoading(false)
                            setShowClose(true)
                            callback(true)

                            setTitle("Application has been endorsed to")
                        }else{
                            onCancelPress()
                        }


                    })


                }} show={showAlert} title={title}
                message={message}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.container, {display: !showAlert ? undefined : "none"}]}
            >

                <View style={[styles.rect, {height: orientation == "LANDSCAPE" ? "100%" : "80%",}]}>

                    <View>
                        <View style={styles.iconColumn}>
                            <TouchableOpacity onPress={() => {
                                setValidateRemarks({error: false})
                                props.onDismissed()
                            }}>
                                <CloseIcon/>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingHorizontal: 20}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 10}}>
                                <EndorseToIcon style={styles.icon2}/>
                                <Text style={styles.endorseTo}>Endorse to</Text>
                            </View>


                            <CustomDropdown value={endorsed}
                                            label="Select Item"
                                            data={pickedEndorsed}
                                            onSelect={({value}) => {
                                                if(value) setEndorsed(value)
                                            }}/>
                            <View style={{paddingVertical: 10}}>
                                <InputField
                                    clearable={false}
                                    containerStyle={{
                                        height: undefined ,
                                        borderColor: "#D1D1D6",
                                        borderWidth: 1 ,
                                        backgroundColor: undefined,
                                    }}
                                    outlineStyle={{
                                        borderRadius: 4,
                                        paddingTop: 10,
                                        height: (height < 720 && isKeyboardVisible) ? 75 : height * 0.15
                                    }}
                                    inputStyle={{fontWeight: "400", fontSize: fontValue(14)}}
                                    error={validateRemarks.error}
                                    errorColor={errorColor}
                                    placeholder={'Remarks'}
                                    multiline={true}
                                    value={text}
                                    onChangeText={(text: string) => {

                                        setText(text)
                                    }}
                                />
                            </View>

                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 15}}>
                        <TouchableOpacity disabled={!picked} onPress={onEndorseConfirm}>
                            <View style={[styles.confirmButton, {backgroundColor:  picked ? primaryColor : disabledColor,}]}>
                                <Text style={styles.confirm}>Confirm</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </Modal>

    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: "flex-end"
    },
    rectFiller: {
        flex: 1
    },
    rect: {
        justifyContent: "space-between",
        paddingBottom: 20,


        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 15,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: fontValue(25),
    },
    group: {
        width: 138,
        height: 30,
        flexDirection: "row",
        marginTop: 17
    },
    icon2: {
        color: "#000",
        fontSize: fontValue(30)
    },
    endorseTo: {
        fontFamily: Regular500,
        color: "#121212",
        fontSize: fontValue(18),
        paddingLeft: 10,
        paddingTop: 3
    },
    icon2Row: {
        height: 30,
        flexDirection: "row",
        flex: 1
    },
    rect5: {
        width: 355,
        height: 50,
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(202,210,225,1)",
        borderRadius: 6,
        padding: 5,
        marginTop: 9,
    },
    iconColumn: {
        width: '100%',
        paddingTop: 22 ,
        paddingHorizontal: 30,
        paddingBottom: 15
    },
    iconColumnFiller: {
        flex: 1
    },
    rect6: {
        paddingHorizontal: 15,
        width: '100%',
    },
    confirm: {
        color: "rgba(255,255,255,1)",
        fontFamily: Bold,
        fontSize: 18,
    },
    confirmButton: {

        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Endorsed;