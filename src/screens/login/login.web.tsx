import React, { useState, useEffect, useRef } from 'react';
import {
  Easing,
  ImageBackground,
  Modal,
  Animated,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from 'react-native';
import EdgeBlue from "@assets/svg/edgeBlue";
import { styles } from "@screens/login/styles";
import Text from "@atoms/text";
import LoginForm from "@organisms/forms/login";
import Button from "@atoms/button";
import { button, text } from "@styles/color";
import Ellipsis from "@atoms/ellipsis";
import { Regular500 } from "@styles/font";
import ForgotPassword from "./../../navigations/forgot-password";
import CloseIcon from "@assets/svg/close";

import { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { isMobile } from "@/src/utils/formatting";
import { useAuth } from '@/src/hooks/useAuth';
import Footer from '@atoms/footer';

const background = require("@assets/webbackground.png");


const Login = ({ navigation }: any) => {
    const { width, height } = useWindowDimensions();
    const { loading, formValue, onChangeValue, onCheckValidation, isValid } = useAuth(navigation);
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);

    // Shared values for animations
    const logoScale = useSharedValue(0);
    const formOpacity = useSharedValue(0);
    const formTranslateY = useSharedValue(50);

    // Apply animations on component mount
    useEffect(() => {
        logoScale.value = withTiming(1, { duration: 800 });
        formOpacity.value = withTiming(1, { duration: 1000 });
        formTranslateY.value = withTiming(0, { duration: 1000 });
    }, []);

    // Animated styles for logo and form
    const logoAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: logoScale.value }],
        };
    });

    const formAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: formOpacity.value,
            transform: [{ translateY: formTranslateY.value }],
        };
    });


  return (
          <ImageBackground
            resizeMode="cover"
            source={background}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
            imageStyle={{ flex: 1 }}
          >
            <StatusBar barStyle="dark-content" />

            <View style={{ transform: [{ scale: 0.90 }], flex: 1, justifyContent: "center", alignItems: "center" }}>
              {/* Animated logo */}
              <Animated.View style={[{ paddingBottom: 40 }, logoAnimatedStyle]}>
                <EdgeBlue width={342} height={78} />
              </Animated.View>

              {/* Animated form */}
              <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
                <Text style={[styles.formTitleText]}>Login</Text>

                <LoginForm onChangeValue={onChangeValue} form={formValue} />

                <View style={styles.bottomContainer}>
                  <Button
                    testID={"login-button"}
                    style={[
                      styles.loginButton,
                      {
                        backgroundColor: loading ? button.info : isValid ? button.primary : button.default,
                      },
                    ]}
                    disabled={loading}
                    onPress={onCheckValidation}
                  >
                    {loading ? (
                      <View style={{ paddingVertical: 10 }}>
                        <Ellipsis color="#fff" size={10} />
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.boldText} color={isValid ? "#fff" : text.disabled} size={18}>
                          Login
                        </Text>
                      </View>
                    )}
                  </Button>
                </View>

                {!isMobile && (
                  <View style={[{ paddingTop: 15, justifyContent: "flex-start" }]}>
                    <TouchableOpacity onPress={() => setForgotPasswordModal(true)}>
                      <Text style={[{ fontSize: 18, fontFamily: Regular500, color: text.info }]}>Forgot your
                        password?</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </View>


            <Footer/>
            <Modal transparent={true} visible={forgotPasswordModal}>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <TouchableWithoutFeedback onPress={() => setForgotPasswordModal(false)}>
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      position: "absolute",
                      backgroundColor: "rgba(0,0,0, 0.5)",
                    }}
                  />
                </TouchableWithoutFeedback>
                <View style={{
                  padding: 20,
                  backgroundColor: "#fff",
                  borderColor: "#E5E5E5",
                  borderRadius: 10,
                  width: width * 0.28,
                  flex: 0.77
                }}>
                  <TouchableOpacity onPress={() => setForgotPasswordModal(false)}>
                    <View style={{ paddingRight: 20, alignItems: "flex-end" }}>
                      <CloseIcon />
                    </View>
                  </TouchableOpacity>

                  <ForgotPassword />
                </View>
              </View>
            </Modal>
          </ImageBackground>
    );
};

export default Login;
