import {Dimensions , Image , ImageBackground , Platform , ScrollView , StatusBar , View} from "react-native";
import Text from "@atoms/text";
import LoginForm from "@organisms/forms/login";
import Button from "@atoms/button";
import {button , text} from "@styles/color";
import Ellipsis from "@atoms/ellipsis";
import React from "react";
import {styles} from "@screens/login/styles";
const logo = require('@assets/ntc-edge-horizontal.png');
const background = require('@assets/background.png');
const { height } = Dimensions.get('screen');
const navigationBarHeight = height - Dimensions.get('window').height;
export const LoginNative = (props: { onChangeValue: (key: string , value: any) => (void), form: { password: { strength: string; isValid: boolean; upperAndLowerCase: boolean; characterLength: boolean; atLeastOneNumber: boolean; error: string; value: string }; keepLoggedIn: { value: boolean }; showPassword: { value: boolean }; email: { isValid: boolean; error: string; value: string } }, loading: boolean, valid: boolean, onPress: () => (any) }) =>
    <ImageBackground
        resizeMode="stretch"
        source={ background }
        style={ styles.bgImage }
        imageStyle={ { flex : 1 } }
    >
        <StatusBar barStyle="dark-content"/>

        <ScrollView
            contentContainerStyle={ { flexGrow : 1 } }
            showsVerticalScrollIndicator={ false }
        >

            <Image
                resizeMode="contain"
                source={ logo }
                style={ styles.image }
            />

            <View style={ styles.formContainer }>

                <Text style={ styles.formTitleText }>Login</Text>

                <LoginForm onChangeValue={ props.onChangeValue } form={ props.form }/>

                <View style={ styles.bottomContainer }>
                    <Button
                        style={ [
                            styles.loginButton ,
                            {
                                backgroundColor : props.loading
                                                  ? button.info
                                                  : props.valid
                                                    ? button.primary
                                                    : button.default
                            }
                        ] }
                        disabled={ props.loading }
                        onPress={ props.onPress }
                    >
                        {
                            props.loading ? (
                                <View style={ { paddingVertical : 10 } }>
                                    <Ellipsis color="#fff" size={ 10 }/>
                                </View>

                            ) : (
                                <View>
                                    <Text style={ styles.boldText } color={ props.valid ? "#fff" : text.disabled }
                                          size={ 18 }>Login</Text>
                                </View>

                            )
                        }
                    </Button>
                    {
                        Platform.OS === "android" && <View style={ { height : navigationBarHeight } }/>
                    }
                </View>

            </View>

        </ScrollView>

    </ImageBackground>;