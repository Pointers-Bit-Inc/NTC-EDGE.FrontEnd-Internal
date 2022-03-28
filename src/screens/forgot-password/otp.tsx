import React , {useCallback , useEffect , useState} from 'react';
import {Alert , KeyboardAvoidingView , Platform , ScrollView , View} from 'react-native';
import Text from '@atoms/text';
import * as Progress from 'react-native-progress';
import {OTPField} from '@molecules/form-fields';
import Button from '@atoms/button';
import {button , text} from 'src/styles/color';
import useKeyboard from 'src/hooks/useKeyboard';
import Ellipsis from '@atoms/ellipsis';
import styles from './styles';
import NavBar from "@molecules/navbar";
import Left from "@atoms/icon/left";
import api from 'src/services/api';
import {Bold} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";

const timerLimit = 90;
const errorResponse = 'Invalid verification code. Please try again';
const code = '1234';

const OneTimePin = ({ navigation , route }: any) => {
    const {
        account ,
        accountType ,
        token ,
    } = route.params;
    const isKeyboardVisible = useKeyboard();
    const [timer , setTimer] = useState(timerLimit);
    const [started , setStarted] = useState(false);
    const [ended , setEnded] = useState(false);
    const [loading , setLoading] = useState(false);
    const [otp , setOtp] = useState('');
    const [otpId , setOtpId] = useState(token);
    const [error , setError] = useState('');
    const onSubmit = () => {
        setLoading(true);
        api(null , '')
            .post(`/${ otpId }/{id}/otp-validate` , {
                'code' : otp ,
                'otpId' : otpId
            })
            .then((res: any) => {
                setLoading(false);
                if (res?.data?.success) {
                    setEnded(true);
                    navigation.navigate('ForgotPasswordReset' , { otpId , otp });
                } else {
                    setError(errorResponse);
                }
            })
            .catch((err: any) => {
                setLoading(false);
                Alert.alert('Alert' , err?.message);
            });

    };

    const onResend = useCallback(() => {
        setLoading(true);
        api(null , '')
            .post(`/resend-reset-password-otp` , {
                email : account ,
                otpId
            })
            .then((res: any) => {
                setLoading(false);
                if (res?.data?.success) {
                    resetTimer();
                    Alert.alert(res.data.message);
                    setOtpId(res?.data?.otpId);
                } else {
                    Alert.alert('Alert' , res?.data?.message || 'Cannot process forgot password.');
                }
            })
            .catch((err: any) => {
                setLoading(false);
                Alert.alert('Alert' , err?.message);
            });
    } , [otpId]);

    const resetTimer = () => {
        setStarted(true);
        setEnded(false);
        setTimer(timerLimit);
        setError('');
        setOtp('');
    };

    const format = (time: number) => {
        var mins = ~~(
            (
                time % 3600) / 60);
        var secs = ~~time % 60;
        var format = "";
        format += (
            mins < 10 ? "0" : "") + mins + ":" + (
            secs < 10 ? "0" : "");
        format += "" + secs;
        return format;
    };

    useEffect(() => {
        resetTimer();
    } , []);

    useEffect(() => {
        let interval: any = null;
        if (started && !ended) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            } , 1000);
        }
        return () => clearInterval(interval);
    } , [started , ended]);

    useEffect(() => {
        if (timer === 0) {
            setStarted(false);
            setEnded(true);
        }
    } , [timer]);

    const renderDetail = () => {
        if (accountType === 'phone') {
            const lastFour = account.substr(account.length - 4);
            return `**** ${ lastFour }`;
        }
        const email = account.split('@');
        return `****@${ email[1] }`;
    };

    const onChangeText = (value: string) => {
        if (!!error) {
            setError('');
        }
        setOtp(value);
    };

    return (
        <View style={ styles.container }>
            <NavBar
                title={ 'Forgot Password' }
                rightIcon={ <Text size={ 16 } color='#fff'>Close</Text> }
                onRight={ () => navigation.navigate('Login') }
                leftIcon={ <Left color='#fff' size={ 17 }/> }
                onLeft={ () => navigation.pop() }
            />

            <KeyboardAvoidingView
                behavior={ Platform.select({ ios : 'padding' , android : undefined }) }
                keyboardVerticalOffset={ Platform.select({ ios : 75 , android : undefined }) }
                style={ styles.container }
            >
                <ScrollView
                    style={ styles.scrollview }
                    showsVerticalScrollIndicator={ false }
                >
                    <Text
                        family={ Bold }
                        size={ 22 }
                        color={ text.primary }
                    >
                        OTP code sent!
                    </Text>
                    <View style={ styles.description }>
                        <Text
                            size={ 16 }
                            color={ text.default }
                        >
                            { accountType === 'phone' ?
                              `Enter the OTP code sent via SMS to your registered phone number ${ renderDetail() }.` :
                              `Enter the OTP code sent via EMAIL to your registered email address ${ renderDetail() }.`
                            }
                        </Text>
                    </View>
                    <OTPField
                        style={ [
                            styles.input ,
                            { color : text.primary } ,
                            !!error && {
                                color : text.error
                            } ,

                        ] }

                        maxLength={ 6 }
                        placeholder="••••••"
                        label={ 'OTP' }

                        labelStyle={ [ styles.labelStyle , {  color : text.primary,  fontSize : fontValue(16), fontFamily: "Poppins_600SemiBold" }] }
                        required={ true }
                        hasValidation={ true }
                        outlineStyle={ styles.outlineStyle }
                        errorColor={ text.error }
                        requiredColor={ text.error }
                        error={ error }
                        value={ otp }
                        keyboardType={ 'number-pad' }
                        onChangeText={ onChangeText }
                    >
                        {
                            !ended && (
                                <View style={ { flexDirection : 'row' , alignItems : 'center' } }>
                                    <Progress.Pie
                                        style={ {
                                            transform : [
                                                { scaleX : -1 } ,
                                            ]
                                        } }
                                        color={ text.primary }
                                        borderWidth={ 0 }
                                        progress={ timer / timerLimit }
                                        size={ 16 }
                                    />
                                    <Text
                                        style={ { marginLeft : 5 } }
                                        size={ 16 }
                                        color={ text.default }
                                    >
                                        { format(timer) }
                                    </Text>
                                </View>
                            )
                        }
                    </OTPField>
                </ScrollView>
            </KeyboardAvoidingView>

            <KeyboardAvoidingView
                behavior={ Platform.select({ ios : 'position' , android : undefined }) }
                style={ styles.keyboardAvoiding }
            >
                <View style={ isKeyboardVisible && styles.shadow }>
                    <Button
                        disabled={ loading }
                        style={ [
                            styles.button ,
                            {
                                backgroundColor : (
                                                      ended || error)
                                                  ? loading
                                                    ? '#2F5BFA'
                                                    : button.primary
                                                  : loading
                                                    ? '#2F5BFA'
                                                    : otp.length < 4
                                                      ? button.default
                                                      : button.primary
                            } ,
                        ] }
                        onPress={ (
                                      ended || error) ? onResend : onSubmit }
                    >
                        {
                            loading
                            ? <Ellipsis color='#fff' size={ 10 }/>
                            : <Text
                                color={ (
                                            ended || error)
                                        ? '#fff'
                                        : loading
                                          ? '#fff'
                                          : otp.length < 4
                                            ? text.disabled
                                            : '#fff'
                                }
                                size={ 16 }
                                style={ styles.boldText }
                            >
                                {
                                    (
                                        ended || error)
                                    ? loading
                                      ? 'Resending code...'
                                      : 'Resend code'
                                    : loading
                                      ? 'Confirming...'
                                      : 'Confirm'
                                }
                            </Text>
                        }
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
};

export default OneTimePin;