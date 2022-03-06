import {
    Dimensions ,
    Image ,
    ImageBackground ,
    Platform ,
    ScrollView ,
    StatusBar ,
    TouchableOpacity ,
    View
} from "react-native";
import Text from "@atoms/text";
import LoginForm from "@organisms/forms/login";
import Button from "@atoms/button";
import {button , text} from "@styles/color";
import Ellipsis from "@atoms/ellipsis";
import React from "react";
import {styles} from "@screens/login/styles";
import EdgeBlue from "@assets/svg/edgeBlue";
import {fontValue} from "@pages/activities/fontValue";
import {Regular500} from "@styles/font";
import {isMobile} from "@pages/activities/script";
const background = require('@assets/webbackground.png');
export const LoginWeb = (props: { onChangeValue: (key: string , value: any) => (void), form: { password: { strength: string; isValid: boolean; upperAndLowerCase: boolean; characterLength: boolean; atLeastOneNumber: boolean; error: string; value: string }; keepLoggedIn: { value: boolean }; showPassword: { value: boolean }; email: { isValid: boolean; error: string; value: string } }, loading: boolean, valid: boolean, onPress: () => (any) }) =>
    <ImageBackground
        resizeMode="cover"
        source={ background }
        style={{ flex: 1,
            justifyContent: "center"}}
        imageStyle={ { flex : 1 } }
    >
        <StatusBar barStyle="dark-content"/>

              <View style={{  flex: 1, justifyContent: "center", alignItems: "center"}}>
                  <View style={{paddingBottom: 40}}>
                      <EdgeBlue width={342} height={78}></EdgeBlue>
                  </View>
                  <View style={ styles.formContainer }>

                      <Text style={ [styles.formTitleText] }>Login</Text>

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
                      </View>
                      { !isMobile && <View style={[{ paddingTop: 15, justifyContent: 'flex-start' }]}>
                          <TouchableOpacity onPress={() => { props.onChangeValue('forgotPassword')}}>
                              <Text
                                  style={[ { fontSize:  18,   fontFamily: Regular500  , color: text.info }]}

                              >
                                  Forgot your password?
                              </Text>
                          </TouchableOpacity>
                      </View>}

                  </View>
              </View>


    </ImageBackground>;