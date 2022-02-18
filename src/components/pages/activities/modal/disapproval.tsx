import React, {useState} from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";
import {InputField} from "@molecules/form-fields";
import {Feather, Ionicons} from "@expo/vector-icons";
import {DECLINED, FOREVALUATION} from "../../../../reducers/activity/initialstate";
import useKeyboard from 'src/hooks/useKeyboard';
import CustomAlert from "@pages/activities/alert/alert";
import {FileTextIcon} from "@assets/svg/fileText";
import {input , primaryColor} from "@styles/color";
import {Bold , Regular} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
const { height, width } = Dimensions.get('window');

function Disapproval(props: any) {
    const [showAlert, setShowAlert] = useState(false)
    const [text, setText] = useState("")
    const isKeyboardVisible = useKeyboard();
    const [alertLoading, setAlertLoading] = useState(false)
    const [showClose, setShowClose] = useState(false)
    const [title, setTitle] = useState("Decline Application")
    const [message, setMessage] = useState("Are you sure you want to reject this application?")
    const onCancelPressed = () =>{
        setTitle(  "Decline Application" )
        setMessage("Are you sure you want to reject this application?")
        setShowClose(false)
        setShowAlert(false)
        setAlertLoading(false)
        if(showClose){
            props.onDismissed()
        }
    }
    return (

        <Modal
            supportedOrientations={['portrait', 'landscape']}
            animationType="slide"
            transparent={true}
            visible={props.visible}

            onRequestClose={() => {
                props.onDismissed()
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
            } : {}}>

            </View>
            <CustomAlert
                showClose={showClose}
                type={DECLINED}
                onDismissed={onCancelPressed}
                onLoading={alertLoading}
                onCancelPressed={onCancelPressed}
                onConfirmPressed={() => {
                    setAlertLoading(true)

                    props.onChangeApplicationStatus(DECLINED, (bool, callback:(bool) =>{}) =>{
                        if(bool){
                            setAlertLoading(false)
                            setShowClose(true)
                            callback(true)
                            setTitle("Application Declined")
                            setMessage("Application has been rejected.")
                        }else{
                            setAlertLoading(false)
                            setShowClose(false)
                            setShowAlert(false)

                        }

                    })


                }} show={showAlert} title={title}
                message={message}/>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.container,]}
            >
               
                <View style={styles.rectFiller}></View>
                <View style={[styles.rect, !showAlert ||  {display: "none"}]}>
                    <View style={{padding: 10}}>
                        <TouchableOpacity onPress={() => {
                            props.onDismissed()
                        }}>
                            <Ionicons name="md-close" style={styles.icon}/>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            paddingHorizontal: 20
                        }}
                    >
                       <FileTextIcon style={styles.fileTextIcon}/>
                        <View style={styles.nodRemarksColumn}>
                            <Text style={styles.nodRemarks}>NOD/Remarks</Text>
                            <Text style={styles.pleaseProvide}>
                                Please provide reason of disapproval
                            </Text>
                        </View>
                    </View>
                    <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
                        <InputField
                            containerStyle={{
                                height: undefined ,
                                borderColor: "#D1D1D6",
                                borderWidth: 1 ,
                                backgroundColor: undefined,
                            }}
                            clearable={false}
                            outlineStyle={{
                              //  borderColor: "rgba(202,210,225,1)",
                               paddingTop: 10,
                                height: (height < 720 && isKeyboardVisible) ? 100 : height * 0.25
                            }}
                            placeholder={'Remarks'}
                            inputStyle={{fontWeight: "400", fontSize: RFValue(14)}}
                            multiline={true}
                            value={text}
                            onChangeText={setText}
                        />
                    </View>
                    <View style={{padding: 20, paddingBottom: 25}}>
                        <TouchableOpacity onPress={() => {
                            props.remarks(text)
                            setShowAlert(true)
                        }}>
                            <View style={styles.confirmButton}>
                                <Text style={styles.confirm}>Confirm</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fileTextIcon:{
       paddingLeft: 15,
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
        borderRadius: 15,
        width: "100%",
        backgroundColor: "rgba(255,255,255,1)",
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    icon: {
        color: "rgba(0,0,0,1)",
        fontSize: RFValue(30),
        marginLeft: 4
    },
    group: {
        width: 232,
        height: 35,
        marginTop: 12
    },
    icon2: {
        color: "rgba(53,62,89,1)",
        fontSize: RFValue(30)
    },
    nodRemarks: {
        fontFamily: Bold,
        textAlign: "left",
        fontSize: RFValue(18),
        marginLeft: -1
    },
    pleaseProvide: {

        color: "#121212",
        fontSize: RFValue(12),
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
        backgroundColor:primaryColor,
        borderRadius: 9
    },
    confirm: {
        color: "rgba(255,255,255,1)",
        fontFamily: Bold,
        fontSize: RFValue(18),
    },
    confirmButton: {
        backgroundColor: primaryColor,
        borderRadius: 12,

        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Disapproval;
