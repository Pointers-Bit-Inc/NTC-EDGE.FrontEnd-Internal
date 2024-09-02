import React, {useState} from 'react';
import {Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from 'react-native';
import Text from '@components/atoms/text';
import {validatePassword,} from 'src/utils/form-validations';
import {PasswordField} from '@molecules/form-fields';
import Button from '@components/atoms/button';
import PasswordForm from '@components/organisms/forms/reset-password';
import {button, defaultColor, errorColor, successColor} from 'src/styles/color';
import axios from "axios";
import {BASE_URL} from "../../../services/config";
import {RootStateOrAny, useSelector} from "react-redux";
import NavBar from '@components/molecules/navbar';
import Left from '@components/atoms/icon/left';
import Loading from '@components/atoms/loading';
import {Bold} from '@styles/font';
import Alert from '@components/atoms/alert';
import {fontValue} from "@pages/activities/fontValue";

const {height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        marginTop: 10,
        padding: 20,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    content: {
        padding: 20,
    },
    description: {
        paddingVertical: 25,
    },
    button: {
        backgroundColor: button.primary,
        borderRadius: 10,
        width: '100%',
        padding: 0,
        height: fontValue(50),
        justifyContent: 'center',
    },
    keyboardAvoiding: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
    },
    boldText: {
        fontFamily: Bold,
    }
})

const errorResponse = {
    password: 'Password must be atleast 6 characters',
    confirm: 'Passwords do not match',
};

const ResetPassword = ({navigation}: any) => {
    const user = useSelector((state: RootStateOrAny) => state.user);
    const config = {
        headers: {
            Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: user?.createdAt
        }
    }
    const [formValue, setFormValue] = useState({
        oldPassword: {
            value: '',
        },
        password: {
            value: '',
            isValid: false,
            error: '',
            characterLength: false,
            upperAndLowerCase: false,
            atLeastOneNumber: false,
            strength: 'Weak',
        },
        confirmPassword: {
            value: '',
            isValid: false,
            error: '',
        },
        showPassword: {
            value: false,
        }
    });
    const [loading, setLoading] = useState(false);

    const onChangeText = (key: string, value: any) => {
        switch (key) {
            case 'password': {
                const passwordTest = validatePassword(value);
                const checked = validatePasswordMatch(value, formValue.confirmPassword.value);
                return setFormValue({
                    ...formValue,
                    [key]: {
                        value: value,
                        isValid: passwordTest?.isValid,
                        error: !passwordTest?.isValid ? errorResponse['password'] : '',
                        characterLength: passwordTest.characterLength,
                        upperAndLowerCase: passwordTest.upperAndLowerCase,
                        atLeastOneNumber: passwordTest.atLeastOneNumber,
                        strength: passwordTest.strength,
                    },    //013021
                    'confirmPassword': {
                        ...formValue.confirmPassword,
                        isValid: checked,
                        error: !checked ? errorResponse['confirm'] : ''
                    }
                });
            }
            case 'confirmPassword': {
                const checked = validatePasswordMatch(value, formValue.password.value);
                return setFormValue({
                    ...formValue,
                    [key]: {
                        value: value,
                        isValid: checked,
                        error: !checked ? errorResponse['confirm'] : ''
                    }
                });
            }
            case 'oldPassword' : {
                return setFormValue({
                    ...formValue,
                    [key]: {
                        value: value,
                        isValid: value.length
                    }
                });
            }
            case 'showPassword': {
                return setFormValue({
                    ...formValue,
                    [key]: {
                        value: value,
                    }
                });
            }
            case "resetPassword": {
                onCheckValidation()
            }
            default:
                return setFormValue({
                    ...formValue,
                    [key]: {
                        value: value,
                        isValid: !!value,
                        error: '',
                    }
                });
        }
    };

    const validatePasswordMatch = (value: string, password: string) => {
        return value === password;
    }
    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState({
        title: '',
        message: '',
        color: defaultColor,
    });
    const onCheckValidation = () => {
        if (!formValue.password.isValid) {
            return onChangeText('password', formValue.password.value);
        } else if (!formValue.confirmPassword.isValid) {
            return onChangeText('confirmPassword', formValue.confirmPassword.value);
        } else {
            setLoading(true);

            const params = {
                oldPassword: formValue.oldPassword.value,
                newPassword: formValue.password.value
            }

            axios.patch(BASE_URL + `/users/${user._id}/change-password`, params, config).then((response) => {

                setFormValue({
                    ...formValue,
                    ['oldPassword']: {
                        ...formValue.oldPassword,
                        value: "",
                    },
                    ['password']: {
                        ...formValue.password,
                        value: '',
                        isValid: false,
                        error: '',
                        characterLength: false,
                        upperAndLowerCase: false,
                        atLeastOneNumber: false,
                    },
                    ['confirmPassword']: {
                        ...formValue.confirmPassword,
                        value: "",
                    }

                })


                setAlert({
                    title: response?.status === 200 ? 'Success' : 'Failure',
                    message: response?.data?.message || '',
                    color: response?.status === 200 ? successColor : errorColor,
                });

                setShowAlert(true);
                setLoading(false);
            }).catch((err) => {
                setAlert({
                    title: err?.title || 'Failure',
                    message: err?.message || 'Your password was not updated.',
                    color: errorColor,
                });
                setShowAlert(true);
                setLoading(false);
            })
        }
    };

    const isValid = formValue.password.isValid && formValue.confirmPassword.isValid;

    return (
        <View style={styles.container}>

            {/* <AwesomeAlert
                actionContainerStyle={{ flexDirection: "row-reverse" }}
                show={showAlert}
                showProgress={false}
                title={alert?.title}
                message={alert?.message}
                messageStyle={{ textAlign: 'center' }}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor={alert?.color}
                onConfirmPressed={() => setShowAlert(false)}
            /> */}
            <NavBar
                title='Change Password'
                leftIcon={<Left color='#fff'/>}
                onLeft={() => navigation.goBack()}
            />
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon
                        size={26}
                        color={text.default}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Text
                        size={18}
                        color={text.default}
                    >
                        Close
                    </Text>
                </TouchableOpacity>
            </View> */}
            <ScrollView keyboardShouldPersistTaps={Platform.OS == "ios" ? "handled" : "always"} style={styles.content}>
                <PasswordField

                    label={'Old password'}
                    placeholder="Old password"
                    textContentType="oneTimeCode"
                    required={true}
                    hasValidation={true}
                    secureTextEntry={!formValue?.showPassword?.value}
                    value={formValue?.oldPassword?.value}
                    onChangeText={(value: string) => onChangeText('oldPassword', value)}
                    onSubmitEditing={(event: any) => onChangeText('oldPassword', event.nativeEvent.text)}
                    showPassword={() => onChangeText('showPassword', !formValue?.showPassword?.value)}
                />
                <PasswordForm onChangeValue={onChangeText} form={formValue}/>
            </ScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'position' : 'height'}
                // keyboardVerticalOffset={height * 0.12}
                style={styles.keyboardAvoiding}
            >
                <Button
                    style={[styles.button, {backgroundColor: isValid ? button.primary : button.default}]}
                    onPress={onCheckValidation}
                >
                    {
                        loading
                            ? <Loading color='#fff' size={10}/>
                            : <Text
                                color="white"
                                size={16}
                                style={styles.boldText}
                            >
                                Submit
                            </Text>
                    }
                </Button>
            </KeyboardAvoidingView>
            <Alert
                visible={showAlert}
                title={alert?.title}
                message={alert?.message}
                confirmText='OK'
                onConfirm={() => {
                    setShowAlert(false)
                    navigation?.goBack()
                }}
            />
        </View>
    )
}

export default ResetPassword
