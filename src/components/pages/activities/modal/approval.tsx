import React, {useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import ApplicationApproved from "@assets/svg/application-approved";
import {Ionicons} from "@expo/vector-icons";
import axios from "axios";
import {InputField} from "@molecules/form-fields";
import {BASE_URL} from "../../../../services/config";
import {ACCOUNTANT,APPROVED,CASHIER,DIRECTOR,EVALUATOR,} from "../../../../reducers/activity/initialstate";
import {RootStateOrAny,useSelector} from "react-redux";
import useKeyboard from 'src/hooks/useKeyboard';
import {disabledColor, errorColor, primaryColor} from "@styles/color";
import CustomAlert from "@pages/activities/alert/alert";
import {useAlert} from "../../../../hooks/useAlert";
import {getRole} from "@pages/activities/script";
import {Bold} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import {OnBackdropPress} from "@pages/activities/modal/onBackdropPress";
import {isLandscapeSync,isTablet} from "react-native-device-info";
import useSafeState from "../../../../hooks/useSafeState";

const {width,height}=Dimensions.get('window');

const Approval=(props:any)=>{

    const {springValue,_springHide,_springCollapse}=useAlert(props.visible,()=>{
        setOnFocus(false);
        props.onDismissed(APPROVED, () => {
            props.setShowAlert(false);
        });

    });


    const isKeyboardVisible=useKeyboard();
    const user=useSelector((state:RootStateOrAny)=>state.user);
    const [pickedCashier,setPickedCashier]=useSafeState<any[]>();
    const [message,setMessage]=useSafeState<string>("");
    const [cashier,setCashier]=useSafeState();
    const [remarks,setRemarks]=useSafeState("");
    const [validateRemarks,setValidateRemarks]=useSafeState<{error:boolean}>({error:false});
    const [loading,setLoading]=useSafeState(false);
    const approveInputField = useRef()
    const [visible, setVisible] = useSafeState(true)
    const cancelTokenSource = axios.CancelToken.source();
    useEffect(()=>{
        approveInputField?.current?.focus()
    }, [_springHide])

    useEffect(async()=>{

        setLoading(true);
        const userEvaluator=getRole(user,[EVALUATOR]);
        const userDirector=getRole(user,[DIRECTOR]);
        const userAccountantRole=getRole(user,[ACCOUNTANT]);
        const userCashier=getRole(user,[CASHIER]);
        let isCurrent=true;
        let role=""

        if(userEvaluator||userDirector){ //if evaluator  and director
            role="accountant"
        } else if(userAccountantRole){   // if accountant
            role="cashier"
        }else if(userCashier){
            role="cashier"
        }

        await axios.get(BASE_URL+'/employees',
            {
                cancelToken: cancelTokenSource.token,
                params:{
                    ...(
                        role.length>0&&{role:role, })
                },
                headers:{
                    Authorization:"Bearer ".concat(user?.sessionToken)
                }
            }).then((response)=>{
            setLoading(false);
            const filterResponse=[...response?.data?.docs||response?.data].filter((item:any)=>{
                //evaluator and director -> accountant -> cashier -> null
                if(userEvaluator||userDirector){ //if evaluator  and director
                    return getRole(item,[ACCOUNTANT])   //get accountant
                } else if(userAccountantRole){   // if accountant
                    return getRole(item,[CASHIER]) //get cashier
                } else if(userCashier){ //if cashier
                    return getRole(item,[CASHIER])
                }
            });
            const res=filterResponse.map((item:any)=>{
                return {value:item._id,label:item.firstName+" "+item.lastName}
            });

            setPickedCashier(res);
            if(res.length){
                setCashier(res[0]?.value)

                if(!getRole(user,[CASHIER, DIRECTOR,ACCOUNTANT])){
                    props.onChangeRemarks(remarks, res[0]?.value);
                }
            } else{
                setLoading(true)
            }



        }).catch((err)=>{
            setLoading(false);
            Alert.alert('Alert',err?.message||'Something went wrong.');
            console.warn(err)
        });
        return ()=>{
            cancelTokenSource?.cancel();
            setLoading(false);
            isCurrent=false
            _springHide()
        }
    },[]);

    const onConfirmation=()=>{

        if(!(remarks) && getRole(user,[CASHIER])) return

        new Promise((resolve, reject) => {
            if(!loading){
                resolve("");
            }
        }).then(()=>{
            props.onChangeRemarks(remarks,cashier);
            setMessage("Are you sure you want to approve this application?");
            props.setShowAlert(true)
        })
    };

    const onCancelPress=(event,bool?:any)=>{


        setAlertLoading(false);
        props.setShowAlert(false);
        if(approvalIcon){
            setVisible(false)
            setApprovalIcon(false);
            setShowClose(false);
            props.onExit();
        } else{
            if(alertLoading){
                setAlertLoading(false)
                props.onModalDismissed("cancel");
            }else{
                props.onModalDismissed();
            }

            setApprovalIcon(false);
            setShowClose(false)
        }
        setTitle("Application Approve")
    };
    const [alertLoading,setAlertLoading]=useSafeState(false);
    const [approvalIcon,setApprovalIcon]=useSafeState(false);
    const [title,setTitle]=useSafeState("Approve Application");
    const [showClose,setShowClose]=useSafeState(false);
    const [isTyping,setIsTyping]=useSafeState(true);
    const [onFocus,setOnFocus]=useSafeState(false);
    const dimensions=useWindowDimensions();

    useEffect(()=>{
        if(props.showAlert || props.visible){
            //TODO: add state
            props.onModalDismissed();
            props.onExit();
            _springHide()
        }

    }, [isLandscapeSync()])



    const [animation] = useState(() => new Animated.Value(0));

    const background = animation.interpolate({
        inputRange: [0, 0.2, 1.8, 2],
        outputRange: [
            'rgba(255,255,255,0)',
            'rgba(255,255,255,.3)',
            'rgba(255,255,255,.3)',
            'rgba(255,255,255,0)',
        ],
        extrapolate: 'clamp',
    });

    const display = animation.interpolate({
        inputRange: [0.2, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const {height} = Dimensions.get('window');

    const success = animation.interpolate({
        inputRange: [1.1, 2],
        outputRange: [0, -height],
        extrapolate: 'clamp',
    });

    const closeButton = () =>{
        Animated.spring(animation, {
            toValue: 0,

            useNativeDriver: true,
        }).start(()=>{

        });
        setTimeout(()=>{
            props.onDismissed(APPROVED, () => {
                props.setShowAlert(false);
            });
        }, 70)
    }
    useEffect(()=>{
        if(props.visible){
            Animated.spring(animation, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [props.visible])

    return (

        <Modal
            supportedOrientations={['portrait','landscape']}
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={_springHide}>

            {loading && <View style={{flex: 1,alignItems:'center',
                justifyContent:'center',}}>
                <ActivityIndicator  color={"#fff"}/>
            </View>}
            {!loading && <>
                <CustomAlert
                    showClose={showClose}
                    type={approvalIcon ? APPROVED : ""}
                    onDismissed={()=>{
                        onCancelPress(APPROVED,true)
                    }}
                    onLoading={alertLoading}
                    onCancelPressed={()=>{
                        onCancelPress('exit',true)
                    }}
                    onConfirmPressed={async () => {

                        setAlertLoading(true);

                        props.confirm({cashier: cashier, remarks: remarks}, (response, callback) => {

                            setAlertLoading(false);
                            if (response) {
                                props.onDismissed(null, (bool) => {

                                    setShowClose(true);
                                    setApprovalIcon(true);
                                    setTitle("Application Approved");
                                    setMessage("Application has been approved.");

                                });

                                callback(true);

                            } else if (!response) {
                                props.onDismissed(APPROVED, () => {

                                    props.setShowAlert(false);
                                    setApprovalIcon(false);
                                    setShowClose(false);
                                })
                            } else {
                                props.onModalDismissed();
                                props.setShowAlert(false);
                                setApprovalIcon(false);
                                setShowClose(false)
                            }

                        })


                    }}
                    show={props.showAlert } title={title}
                    message={message}/>
                {getRole(user,[CASHIER, DIRECTOR,ACCOUNTANT]) && <KeyboardAvoidingView
                    behavior={Platform.OS==="ios" ? "padding" : "height"}
                    style={[styles.container,  {alignItems:"center"}]}
                >
                    <OnBackdropPress  styles={{  backgroundColor : !props.showAlert && visible && Platform.OS != "web"  ? "rgba(0, 0, 0, 0.3)" : undefined}}/>
                    {
                        <Animated.View style={[ styles.group,{
                            width:((isMobile&& !((Platform?.isPad||isTablet()) && isLandscapeSync())))||dimensions.width<=768 ? "100%" : "31.6%",  //474/1500
                            opacity:!props.showAlert && visible  ? 100 : 0,
                        },{
                            transform: [{scale: display}, {translateY: success}],
                        },]}>
                            <View style={[styles.shadow, {marginHorizontal:10,}]}>
                                <View style={styles.rect}>
                                    <View style={{alignSelf:'flex-start'}}>
                                        <TouchableOpacity onPress={closeButton}>
                                            <Ionicons name="md-close" style={{fontSize:fontValue(25)}}/>
                                        </TouchableOpacity>
                                    </View>
                                    <ApplicationApproved style={styles.icon}/>
                                    <Text style={styles.applicationApproved}>
                                        {getRole(user,[CASHIER]) ? 'PAYMENT CONFIRMED' : 'APPLICATION APPROVE'}
                                    </Text>
                                    <View style={styles.group2}>

                                        { getRole(user,[CASHIER, DIRECTOR,ACCOUNTANT]) ?
                                            <InputField
                                                ref={approveInputField}
                                                inputStyle={{
                                                    [Platform.OS=="android" ? "padding" : "height"]:(
                                                        height<720&&isKeyboardVisible) ? 70 : height*0.15,
                                                    fontWeight:"400",
                                                    fontSize:fontValue(14)
                                                }}
                                                onBlur={()=>setOnFocus(false)}
                                                onFocus={()=>setOnFocus(true)}
                                                containerStyle={{
                                                    height:undefined,
                                                    borderColor:"#D1D1D6",
                                                    borderWidth:1,
                                                    backgroundColor:undefined,
                                                }}
                                                clearable={false}
                                                outlineStyle={{
                                                    borderColor:"rgba(202,210,225,1)",
                                                    paddingTop:5,
                                                    height:(
                                                        height<720&&isKeyboardVisible) ? 70 : height*0.15
                                                }}
                                                placeholder= {getRole(user,[CASHIER]) ? 'OR Number' : 'Remarks'}
                                                multiline={true}
                                                value={remarks}
                                                error={validateRemarks.error}
                                                errorColor={errorColor}
                                                onEndEditing={()=>{
                                                    setIsTyping(false)
                                                }}
                                                onChangeText={(text:string)=>{
                                                    setIsTyping(true);

                                                    setRemarks(text)
                                                }
                                                }
                                            /> : <View style={{paddingVertical: 20}}/>}
                                        <View style={{marginTop:5}}>
                                            <TouchableOpacity disabled={!(remarks) && getRole(user,[CASHIER])} onPress={onConfirmation}>
                                                <View style={[styles.confirmButton, {backgroundColor:!(remarks) && getRole(user,[CASHIER]) ? disabledColor :primaryColor,}]}>
                                                    <Text style={styles.confirm}>Confirm</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>}
                </KeyboardAvoidingView>}
            </> }

        </Modal>

    )
};
const styles=StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shadow:{
        borderRadius:12,
        shadowColor:"rgba(0,0,0,1)",
        shadowOffset:{
            height:0,
            width:0
        },
        elevation:60,
        shadowOpacity:0.25,
        shadowRadius:20,
    },
    element:{
        backgroundColor:"rgba(255,255,255,1)",
        borderWidth:1,
        borderColor:"rgba(202,210,225,1)",
        borderRadius:6,
    },
    container:{
        zIndex: 5,
        flex:1,
        justifyContent:'center',

    },
    group:{},
    rect:{
        width:'100%',
        backgroundColor:"rgba(255,255,255,1)",
        borderRadius:12,
        padding:15,
        justifyContent:'center',
        alignItems:'center',
    },
    icon:{
        color:"rgba(100,219,68,1)",
        fontSize:fontValue(94),
        height:102,
        width:94,
    },
    applicationApproved:{
        fontFamily:Bold,
        color:"#121212",
        fontSize:fontValue(18),
    },
    group2:{
        width:'100%',
        marginTop:10,
    },
    confirm:{
        color:"rgba(255,255,255,1)",
        fontFamily:Bold,
        fontSize:fontValue(18),
    },
    confirmButton:{

        borderRadius:12,

        paddingVertical:16,
        alignItems:'center',
        justifyContent:'center',
    }
});
export default Approval
