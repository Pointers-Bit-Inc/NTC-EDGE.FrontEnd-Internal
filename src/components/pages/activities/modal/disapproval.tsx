import React , {useEffect , useState} from "react";
import {
    Dimensions ,
    KeyboardAvoidingView ,
    Modal ,
    Platform ,
    StyleSheet ,
    Text ,
    TouchableOpacity , useWindowDimensions ,
    View
} from "react-native";
import {InputField} from "@molecules/form-fields";
import {Ionicons} from "@expo/vector-icons";
import {DECLINED} from "../../../../reducers/activity/initialstate";
import useKeyboard from 'src/hooks/useKeyboard';
import CustomAlert from "@pages/activities/alert/alert";
import {FileTextIcon} from "@assets/svg/fileText";
import {primaryColor} from "@styles/color";
import {Bold , Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import {OnBackdropPress} from "@pages/activities/modal/onBackdropPress";
import CloseIcon from "@assets/svg/close";
import hairlineWidth = StyleSheet.hairlineWidth;
import button from "@pages/activities/modal/styles";
import ConfirmRightArrow from "@assets/svg/confirmArrow";
import {isLandscapeSync,isTablet} from "react-native-device-info";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import useSafeState from "../../../../hooks/useSafeState";

const { height , width } = Dimensions.get('window');

function Disapproval(props: any) {
    const [showAlert , setShowAlert] = useState(false);
    const [text , setText] = useState("");
    const isKeyboardVisible = useKeyboard();
    const [alertLoading , setAlertLoading] = useState(false);
    const [showClose , setShowClose] = useState(false);
    const [title , setTitle] = useState("Decline Application");
    const [message , setMessage] = useState("Are you sure you want to reject this application?");
    const onCancelPressed = () => {
        setTitle("Decline Application");
        setMessage("Are you sure you want to reject this application?");
        setShowClose(false);
        setShowAlert(false);
        setAlertLoading(false);
        if (showClose) {
            props.onExit()
        }
    };
    const dimensions = useWindowDimensions();
    useEffect(()=>{
        if(showAlert || props.visible){
            //TODO: add state
            props.onExit()
            props.onDismissed()
        }

    }, [isLandscapeSync()])
    const [dropdownValue, setDropdownValue] = useSafeState(1)
    const [dropdownData, setDropdowmData] = useSafeState([
        {label: "OTHERS", value: 1}
    ])
    return (

        <Modal

            supportedOrientations={ ['portrait' , 'landscape'] }
            animationType="slide"
            transparent={ true }
            visible={ props.visible }

            onRequestClose={ () => {
                props.onDismissed()
            } }>


            <OnBackdropPress onPressOut={ props.onDismissed }/>


            <CustomAlert
                showClose={ showClose }
                type={ DECLINED }
                onDismissed={ onCancelPressed }
                onLoading={ alertLoading }
                onCancelPressed={ onCancelPressed }
                onConfirmPressed={ () => {
                    setAlertLoading(true);

                    props.onChangeApplicationStatus(DECLINED , (bool , callback: (bool) => {}) => {



                        if (bool) {
                            setAlertLoading(false);
                            setShowClose(true);
                            callback(true);
                            setTitle("Application Declined");
                            setMessage("Application has been rejected.")
                        } else {
                            setAlertLoading(false);
                            setShowClose(false);
                            setShowAlert(false)

                        }

                    })


                } } show={ showAlert } title={ title }
                message={ message }/>


            <KeyboardAvoidingView
                behavior={ Platform.OS === "ios" ? "padding" : "height" }
                style={ [styles.container, {paddingRight:((isMobile&& !((Platform?.isPad||isTablet()) && isLandscapeSync()))) || dimensions.width <= 768 ? undefined : 64,}] }
            >
                <OnBackdropPress onPressOut={ props.onDismissed }/>
                <View style={ styles.rectFiller }>
                    <OnBackdropPress onPressOut={ props.onDismissed }/>
                </View>
                <View style={ [styles.rect , {

                    width: ((isMobile&& !((Platform?.isPad||isTablet()) && isLandscapeSync()))) || dimensions.width <= 768 ? "100%" : "32%",
                    display : !showAlert ? undefined : "none"
                }] }>

                    <View style={ {

                        borderBottomColor: "#e5e5e5",
                        borderBottomWidth: hairlineWidth,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding : 20} }>
                        <View
                            style={ {
                                flexDirection : 'row' ,
                                alignItems : 'flex-start' ,

                            } }
                        >
                            <FileTextIcon width={ fontValue(24) } height={ fontValue(24) } style={ styles.fileTextIcon }/>
                            <View style={ styles.nodRemarksColumn }>
                                <Text style={ styles.nodRemarks }>NOD/Remarks</Text>

                            </View>
                        </View>
                        <TouchableOpacity onPress={ () => {
                            props.onDismissed()
                        } }>
                            <CloseIcon/>
                        </TouchableOpacity>
                    </View>

                    <View style={ {  paddingHorizontal : 20 } }>
                        <Text style={ styles.pleaseProvide }>
                            Please provide reason of disapproval
                        </Text>
                        <View style={{paddingBottom: 10}}>
                            <CustomDropdown value={dropdownValue}
                                            label="Select Item"
                                            data={ dropdownData }
                                            onSelect={ ({ value }) => {
                                                if (value) setDropdownValue(value)
                                            } }/>
                        </View>

                        <InputField

                            containerStyle={ {
                                height : undefined ,
                                borderColor : "#D1D1D6" ,
                                borderWidth : 1 ,
                                backgroundColor : undefined ,
                            } }
                            clearable={ false }
                            outlineStyle={ {
                                //  borderColor: "rgba(202,210,225,1)",
                                paddingTop : 10 ,
                                height : (
                                             height < 720 && isKeyboardVisible) ? 100 : height * 0.25
                            } }
                            placeholder={ 'Remarks' }
                            inputStyle={ { [Platform.OS == "android" ? "padding" : "height"] : (
                                                        height < 720 && isKeyboardVisible) ? 70 : height * 0.15,fontWeight : "400" , fontSize : fontValue(14) } }
                            multiline={ true }
                            value={ text }
                            onChangeText={ setText }
                        />
                    </View>
                    <View style={button.confirmButtonContainer}>
                        <View style={ { padding : 20 , } }>
                            <TouchableOpacity onPress={ () => {
                                props.remarks(text);
                                setShowAlert(true)
                            } }>
                                <View style={ [button.confirmButton, {gap: 5} ]}>
                                    <Text style={ button.confirm }>Confirm</Text>
                                    <ConfirmRightArrow></ConfirmRightArrow>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </Modal>

    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1 ,

    } ,
    fileTextIcon : {
        paddingLeft : fontValue(15) ,
    } ,
    group3Filler : {
        flex : 1
    } ,
    group3 : {
        width : "100%" ,
        height : 540
    } ,
    rectFiller : {
        flex : 1
    } ,
    rect : {
        shadowColor: "rgba(0,0,0,1)",
            shadowOffset: {
                height: 0,
                width: 0
            },
            elevation: 60,
            shadowOpacity: 0.25,
            shadowRadius: 20,
        borderRadius : 15 ,
        alignSelf : "flex-end" ,

        backgroundColor : "rgba(255,255,255,1)" ,
        borderBottomRightRadius : 0 ,
        borderBottomLeftRadius : 0 ,
    } ,
    icon : {
        color : "rgba(0,0,0,1)" ,
        fontSize : fontValue(30) ,
        marginLeft : 4
    } ,
    group : {
        width : 232 ,
        height : 35 ,
        marginTop : 12
    } ,
    icon2 : {
        color : "rgba(53,62,89,1)" ,
        fontSize : fontValue(30)
    } ,
    nodRemarks : {
        fontFamily : Bold ,
        textAlign : "left" ,
        fontSize : fontValue(18) ,
        marginLeft : -1
    } ,
    pleaseProvide : {
        fontFamily: Regular,
        fontWeight: "400",
        paddingTop: fontValue(25),
        paddingBottom: fontValue(14),
        fontSize : fontValue(14) ,
    } ,
    nodRemarksColumn : {
        marginLeft : 6
    } ,
    icon2Row : {
        height : 35 ,
        flexDirection : "row"
    } ,
    rect2 : {

        width : 355 ,
        height : 290 ,
        backgroundColor : "rgba(255,255,255,1)" ,
        borderWidth : 1 ,
        borderColor : "rgba(218,218,222,1)" ,
        borderRadius : 8 ,
        marginTop : 12 ,
        marginLeft : 1
    } ,
    iconColumn : {

        width : 340 ,
        marginTop : 14 ,
        marginLeft : 17
    } ,
    iconColumnFiller : {
        flex : 1
    } ,
    group2 : {
        width : 340 ,
        height : 40 ,
        marginBottom : 94 ,
        marginLeft : 17
    } ,
    rect3 : {
        width : 340 ,
        height : 40 ,
        backgroundColor : primaryColor ,
        borderRadius : 9
    } ,

});

export default Disapproval;
