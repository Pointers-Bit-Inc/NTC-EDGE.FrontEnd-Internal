import React,{useState} from 'react';

import {isMobile} from "@pages/activities/isMobile";
import {useAuth} from "../../hooks/useAuth";
import {
    ImageBackground,
    Modal,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View
} from "react-native";
import EdgeBlue from "@assets/svg/edgeBlue";
import {styles} from "@screens/login/styles";
import Text from "@atoms/text";
import LoginForm from "@organisms/forms/login";
import Button from "@atoms/button";
import {button , text} from "@styles/color";
import Ellipsis from "@atoms/ellipsis";
import {Regular500} from "@styles/font";
import ForgotPassword from "@screens/forgot-password";
import CloseIcon from "@assets/svg/close";

const background = require('@assets/webbackground.png');
const Login = ({ navigation }: any) => {
    const {width, height} = useWindowDimensions();
    const { loading , formValue , onChangeValue , onCheckValidation , isValid } = useAuth(navigation);
    const [forgotPasswordModal, setForgotPasswordModal]= useState(false)


    return (<ImageBackground
            resizeMode="cover"
            source={ background }
            style={ {
                flex : 1 ,
                justifyContent : "center"
            } }
            imageStyle={ { flex : 1 } }
        >
            <StatusBar barStyle="dark-content"/>

            <View style={ { flex : 1 , justifyContent : "center" , alignItems : "center" } }>
                <View style={ { paddingBottom : 40 } }>
                    <EdgeBlue width={ 342 } height={ 78 }></EdgeBlue>
                </View>
                <View style={ styles.formContainer }>

                    <Text style={ [styles.formTitleText] }>Login</Text>

                    <LoginForm onChangeValue={ onChangeValue } form={ formValue }/>

                    <View style={ styles.bottomContainer }>
                        <Button
                            style={ [
                                styles.loginButton ,
                                {
                                    backgroundColor : loading
                                                      ? button.info
                                                      : isValid
                                                        ? button.primary
                                                        : button.default
                                }
                            ] }
                            disabled={ loading }
                            onPress={ onCheckValidation }
                        >
                            {
                                loading ? (
                                    <View style={ { paddingVertical : 10 } }>
                                        <Ellipsis color="#fff" size={ 10 }/>
                                    </View>

                                ) : (
                                    <View>
                                        <Text style={ styles.boldText } color={ isValid ? "#fff" : text.disabled }
                                              size={ 18 }>Login</Text>
                                    </View>

                                )
                            }
                        </Button>
                    </View>
                    { !isMobile && <View style={ [{ paddingTop : 15 , justifyContent : 'flex-start' }] }>
                        <TouchableOpacity onPress={ () => {
                            setForgotPasswordModal(true)
                        } }>
                            <Text
                                style={ [{ fontSize : 18 , fontFamily : Regular500 , color : text.info }] }

                            >
                                Forgot your password?
                            </Text>
                        </TouchableOpacity>
                    </View> }

                </View>
            </View>
            <View style={ [styles.footerContainer, {gap: 40}] }>
                <View style={styles.edgeFooter}><EdgeBlue width={ 93 } height={ 21 }/>
                    <View><Text style={ [styles.footer] }> © { new Date().getFullYear() } </Text></View></View>

                <Text style={ styles.footer }>User Agreement</Text>
                <Text style={ styles.footer }>Privacy Policy</Text>
                <Text style={ styles.footer }>Community Guidelines</Text>
                <Text style={ styles.footer }>Cookie Policy</Text>
                <Text style={ styles.footer }>Send Feedback</Text>
                <Text style={ styles.footer }>Help Center</Text>
            </View>
        <Modal transparent={true} visible={forgotPasswordModal}>

            <View style={{  flex: 1, justifyContent: "center", alignItems: "center",}}>
                <TouchableWithoutFeedback onPress={ () => {setForgotPasswordModal(false)} }>
                    <View style={ [{
                        width : "100%" ,
                        height : "100%" ,
                        alignItems : "center" ,
                        justifyContent : "flex-end" ,
                        position : "absolute" ,
                        backgroundColor : "rgba(0,0,0, 0.5)"
                    }] }/>
                </TouchableWithoutFeedback>;
                <View style={{padding: 20,  backgroundColor: "#fff", borderColor: "#E5E5E5", borderRadius: 10, width: width * 0.28, flex:  0.77}}>
                    <TouchableOpacity onPress={() => setForgotPasswordModal(false)} >
                        <View style={{paddingRight: 20,alignItems: "flex-end"}}><CloseIcon/></View>
                    </TouchableOpacity>

                    <ForgotPassword/>
                </View>
            </View>
        </Modal>
        </ImageBackground>)
};

export default Login;