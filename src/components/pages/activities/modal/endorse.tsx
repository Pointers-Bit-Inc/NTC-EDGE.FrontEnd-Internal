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
import {DIRECTOR, EVALUATOR, FOREVALUATION} from "../../../../reducers/activity/initialstate";
import useKeyboard from 'src/hooks/useKeyboard';
import {errorColor , primaryColor} from "@styles/color";
import CustomAlert from "@pages/activities/alert/alert";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import {useOrientation} from "@pages/activities/hooks/useOrientation";
import {getRole} from "@pages/activities/script";

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
                return  getRole(item,[DIRECTOR, EVALUATOR]) //&& user?._id != item?._id
            })

            const res = filterResponse?.map((item) => {
                return {value: item._id, label: item.firstName + " " + item.lastName}
            })

            if (isCurrent) {
                setPickedEndorsed(res)
            }
            if (res) {
                if (isCurrent) {
                    setEndorsed(props?.assignedPersonnel || res[0]?.value)
                }
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
    const onEndorseConfirm = () => {

        setMessage(`` + pickedEndorsed?.find(picked => {
            return picked.value === endorsed
        })?.label)
        props.remarks({endorseId: endorsed, remarks: text, message})
        if(pickedEndorsed){
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
                style={[styles.container]}
            >

                <View style={[styles.rect, {height: orientation == "LANDSCAPE" ? "100%" : "80%",}]}>
                    <View style={styles.iconColumn}>
                        <TouchableOpacity onPress={() => {
                            setValidateRemarks({error: false})
                            props.onDismissed()
                        }}>
                            <Ionicons name="md-close" style={styles.icon}></Ionicons>
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
                                style={[{fontWeight: 'normal'}]}
                                containerStyle={{height: undefined}}
                                outlineStyle={{
                                    borderRadius: 4,
                                    paddingTop: 5,
                                    height: (height < 720 && isKeyboardVisible) ? 75 : height * 0.15
                                }}
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
                <View
                    style={{ position: "absolute", width: '100%', paddingHorizontal: 20, paddingBottom: 25,}}
                >
                    <TouchableOpacity onPress={onEndorseConfirm}>
                        <View style={styles.confirmButton}>
                            <Text style={styles.confirm}>Confirm</Text>
                        </View>
                    </TouchableOpacity>
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

        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 15,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 25,
    },
    group: {
        width: 138,
        height: 30,
        flexDirection: "row",
        marginTop: 17
    },
    icon2: {
        color: "rgba(128,128,128,1)",
        fontSize: 30
    },
    endorseTo: {
        color: "#121212",
        fontSize: 20,
        marginLeft: 12,
        marginTop: 3
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
        paddingTop: 20 ,
        paddingHorizontal: 20
    },
    iconColumnFiller: {
        flex: 1
    },
    rect6: {
        paddingHorizontal: 15,
        marginBottom: 90,
        width: '100%',
    },
    confirm: {
        color: "rgba(255,255,255,1)",
        fontWeight: '600',
        fontSize: 18,
    },
    confirmButton: {
        backgroundColor: primaryColor,
        borderRadius: 12,

        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Endorsed;