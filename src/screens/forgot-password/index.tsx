

import React, { useState } from 'react';
import { Platform, KeyboardAvoidingView, View, StyleSheet, Alert } from 'react-native';
import Text from '@atoms/text';
import { InputField } from '@molecules/form-fields';
import Button from '@atoms/button';
import { text, button } from 'src/styles/color';
import { validateEmail } from 'src/utils/form-validations';
import { ScrollView } from 'react-native-gesture-handler';
import Ellipsis from '@atoms/ellipsis';
import styles from './styles';
import api from "../../services/api";
import NavBar from "@molecules/navbar";

const errorResponse = {
    account: 'Enter a valid email address',
};


const ForgotPassword = ({ navigation }:any) => {
    const [account, setAccount] = useState({
        value: '',
        error: '',
        isValid: false
    });
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
        setLoading(true);
        api(null, '')
            .post(`/account/reset-password-request`, {email: account?.value})
            .then((res: any) => {
                setLoading(false);
                if (res?.data?.success) {
                    navigation.navigate('ForgotPasswordOTP', {
                        account: account.value,
                        accountType: 'email',
                        token: res?.data?.token,
                    });
                }
                else {
                    setAccount({
                        value: account?.value,
                        error: res?.data?.message || 'Cannot process forgot password.',
                        isValid: true,
                    });
                }
            })
            .catch((err: any) => {
                setLoading(false);
                Alert.alert('Alert', err?.message);
            });
    };

    const onChangeText = (value: string) => {
        const valid = validateEmail(value);
        setAccount({
            value: value,
            isValid: valid,
            error: !valid ? errorResponse['account'] : '',
        });
    }

    return (
        <View style={styles.container}>
            <NavBar
                title=''
                rightIcon={<Text size={16} color='#fff'>Close</Text>}
                onRight={() => navigation.navigate('Login')}
            />
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: 'padding', android: undefined })}
                keyboardVerticalOffset={Platform.select({ ios: 75, android: undefined })}
                style={styles.container}
            >
                <ScrollView
                    style={styles.scrollview}
                    showsVerticalScrollIndicator={false}
                >
                    <Text
                        size={22}
                        color={text.primary}
                        style={styles.boldText}
                    >
                        Forgot password?
                    </Text>
                    <View style={styles.description}>
                        <Text
                            size={14}
                            color={text.default}
                        >
                            {`Don't worry, it happens!\nPlease enter the email address associated with your account.`}
                        </Text>
                    </View>
                    <InputField
                        label='Email Address'
                        placeholder='Email Address'
                        required={true}
                        hasValidation={true}
                        error={account.error}
                        value={account.value}
                        onChangeText={onChangeText}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: 'position', android: undefined })}
                style={styles.keyboardAvoiding}
            >
                <Button
                    disabled={!account.isValid || loading}
                    style={[
                        styles.button,
                        !account.isValid && {
                            backgroundColor: button.default
                        },
                        loading && {
                            backgroundColor: '#60A5FA'
                        }
                    ]}
                    onPress={onSubmit}
                >
                    {
                        loading
                        ? <Ellipsis color='#fff' size={10} />
                        : <Text
                            color='#fff'
                            size={16}
                            style={styles.boldText}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Text>
                    }

                </Button>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ForgotPassword