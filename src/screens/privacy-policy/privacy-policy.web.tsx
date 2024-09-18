import React, { useState, useEffect, useRef } from 'react';
import {
  Easing,
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar, StyleSheet,
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

import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { isMobile } from "@/src/utils/formatting";
import { useAuth } from '@/src/hooks/useAuth';

const background = require("@assets/webbackground.png");
const style = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 10,
  },
});
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
  const translateY = useSharedValue(height); // Start with the footer off-screen

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 100,
      stiffness: 100,
      mass: 1,
    });
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
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
                <ScrollView style={style.container}>
                  <Text style={style.title}>Privacy Policy</Text>

                  <Text style={style.heading}>1. Introduction</Text>
                  <Text style={style.paragraph}>
                    We at NTC EDGE ("we," "us," or "our") are committed to
                    protecting your privacy. This Privacy Policy explains how we collect,
                    use, and safeguard your personal information when you use our mobile
                    application.
                  </Text>

                  <Text style={style.heading}>2. Information We Collect</Text>
                  <Text style={style.paragraph}>
                    When you use our app, we may collect personal information such as:
                  </Text>
                  <Text style={style.listItem}>- Name</Text>
                  <Text style={style.listItem}>- Email address</Text>
                  <Text style={style.listItem}>- Biometric data</Text>
                  <Text style={style.listItem}>- Device information</Text>

                  <Text style={style.heading}>3. How We Use Your Information</Text>
                  <Text style={style.paragraph}>
                    We use the collected information to authenticate users, improve user
                    experience, and ensure security.
                  </Text>

                  <Text style={style.heading}>4. Your Choices and Rights</Text>
                  <Text style={style.paragraph}>
                    You have the right to access, modify, or delete your personal
                    information. You can also opt out of receiving certain notifications.
                  </Text>
                </ScrollView>
              </View>

              <Animated.View style={[styles.footerContainer , { gap: 40},  animatedStyle]}>
                  <View style={styles.edgeFooter}>
                      <EdgeBlue width={93} height={21} />
                      <View>
                          <Text style={[styles.footer]}> © {new Date().getFullYear()} </Text>
                      </View>
                  </View>

                  <Text style={styles.footer}>User Agreement</Text>
                  <Text style={styles.footer}>Privacy Policy</Text>
                  <Text style={styles.footer}>Community Guidelines</Text>
                  <Text style={styles.footer}>Cookie Policy</Text>
                  <Text style={styles.footer}>Send Feedback</Text>
                  <Text style={styles.footer}>Help Center</Text>
              </Animated.View>
          </ImageBackground>
    );
};

export default Login;
