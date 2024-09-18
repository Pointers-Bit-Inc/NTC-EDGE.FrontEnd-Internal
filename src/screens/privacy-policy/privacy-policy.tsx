import {
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    ScrollView,
    StatusBar, useWindowDimensions
} from "react-native";
import Text from "@atoms/text";
import React,{useEffect} from "react";
import {styles} from "@screens/login/styles";
import { RootStateOrAny, useSelector } from "react-redux";
const logo = require('@assets/ntc-edge-horizontal.png');
const background = require('@assets/loginbackground.png');
const { height } = Dimensions.get('screen');
const navigationBarHeight = height - Dimensions.get('window').height;
const PrivacyPolicy = ({ navigation }: any) => {
    const user = useSelector((state: RootStateOrAny) => state.user) || {};
    const dimension = useWindowDimensions()


    return (
        <ImageBackground
            resizeMode="stretch"
            source={ background }
            style={[ styles.bgImage, {width: dimension.width, height: height}] }
            imageStyle={ { flex : 1 } }
        >
            <StatusBar barStyle="light-content"/>

            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={ { flex: 1 } }
                showsVerticalScrollIndicator={ false }
            >

                <Image
                    resizeMode="contain"
                    source={ logo }
                    style={ styles.image }
                />

                <ScrollView style={style.container}>
                    <Text style={style.title}>Privacy Policy</Text>
                    <Text style={style.paragraph}>Effective Date: [Insert Date]</Text>

                    <Text style={style.heading}>1. Introduction</Text>
                    <Text style={style.paragraph}>
                        We at [Your Company Name] ("we," "us," or "our") are committed to
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

            </ScrollView>

        </ImageBackground>);
};
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
export default PrivacyPolicy
