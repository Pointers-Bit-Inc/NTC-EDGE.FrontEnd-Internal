import React, {useEffect, useMemo, useState} from "react";
import FormField from "@organisms/forms/form";
import InputStyles from "@styles/input-style";
import Text from '@atoms/text';
import {primaryColor, text} from "@styles/color";
import {Image, ScrollView, StyleSheet, View,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import Button from "@atoms/button";
import {Ionicons} from "@expo/vector-icons";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {setUser} from "../../../reducers/user/actions";

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    headerPadding: {
        paddingHorizontal: 18,
        paddingTop: 32,
    },
    container: {
        flex: 1,
    },
    profile: {
        flexDirection: 'row',
        marginTop: 20
    },
    name: {
        fontSize: 22,
        color: primaryColor,
        fontWeight: '600',
        alignSelf: 'center',
        marginLeft: 10
    },
    shareButton: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primaryColor,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 35,
        borderWidth: 4,
        borderColor: primaryColor,
    },
    shareButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
    }
})
const UserProfile = ({ navigation }: any) => {
    const FIRST_NAME_LABEL = "First Name",
        MIDDLE_NAME_LABEL = "Middle Name",
        LAST_NAME_LABEL = "Last Name",
        FIRST_NAME_INDEX = 5,
        MIDDLE_NAME_INDEX = 6,
        LAST_NAME_INDEX = 7,
        PROFILE_IMAGE_INDEX = 10;
    const dispatch = useDispatch();
    const [profileImage, setProfile] = useState("")
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [userProfile, setUserProfile] = useState()
    const [userProfileForm, setUserProfileForm] = useState([
        {
            id: 1,
            key: 1,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "User Name",
            type: "input",
            placeholder: "User Name",
            value: user.username || '',
            stateName: 'username',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'email',
            id: 2,
            key: 2,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Email",
            type: "input",
            placeholder: "Email",
            value: user.email || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'password',
            id: 3,
            key: 3,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Password",
            secureTextEntry: true,
            type: "password",
            placeholder: "Password",
            value: user.password || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'userType',
            id: 4,
            key: 4,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "User Type",
            type: "input",
            placeholder: "User Type",
            value: user.userType || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'permitType',
            id: 5,
            key: 5,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Permit Type",
            type: "input",
            placeholder: "Permit Type",
            value: user.permitType || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: "firstname",
            id: 6,
            key: 6,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: FIRST_NAME_LABEL,
            type: "input",
            placeholder: "First Name",
            value: user.firstname || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'middlename',
            id: 7,
            key: 7,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: MIDDLE_NAME_LABEL,
            type: "input",
            placeholder: "Middle Name",
            value: user.middlename || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'lastname',
            id: 8,
            key: 8,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: LAST_NAME_LABEL,
            type: "input",
            placeholder: "Last Name",
            value: user.lastname || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'phone',
            id: 9,
            key: 9,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Phone",
            type: "input",
            placeholder: "Phone",
            value: user.phone || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'address',
            id: 10,
            key: 10,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Address",
            type: "input",
            placeholder: "Address",
            value: user.address || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            id: 11,
            stateName: 'profileImage',
            value: user.profileImage
        },
    ])


    const onChangeUserProfile = (id: number, text: any, element?: string) => {

        const index = userProfileForm.findIndex(app => app.id == id)
        let newArr = [...userProfileForm];
        if (element == 'password' && !text.trim.length) {
            newArr[index]["error"] = false
            newArr[index]['value'] = text;
        } else if (element == "input" && !text.trim.length ) {
            newArr[index]["error"] = false
            newArr[index]['value'] = text;

        }
        setUserProfileForm(newArr);
    }

    const onPressed = (id?: number, type?: string | number) => {
        let index, newArr:any[]= [];

        if (type === 'image-picker') {

                newArr = [...userProfileForm]
                for (let i = 0; i < newArr.length; i++) {
                    if (newArr[i].stateName == "profileImage" && newArr[i].id == id) {

                        openImagePickerAsync().then((r: any) => {
                            newArr[i].value = r?.uri
                            setUserProfileForm(newArr)
                        })
                    }
            }


        }
    }
    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let picker = await ImagePicker.launchImageLibraryAsync()
        return picker
    }

    const onUserSubmit = () =>{
        let userInput = {} as any, error = [];
        let newArr = [...userProfileForm];
        for (let i = 0; i < newArr.length; i++) {
            if (!newArr[i].value) {
                newArr[i].error = true
            }
            userInput[`${userProfileForm[i]?.stateName}`] = userProfileForm[i].value
        }
        setUserProfileForm(newArr)
        if(!error.length){
            dispatch(setUser(userInput))
        }
    }
    
    
    return <>

            <View style={{ flex: 1, backgroundColor: "white",   padding: 20}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.profile}>
                        {userProfileForm[PROFILE_IMAGE_INDEX].value ? <Image
                                style={styles.avatar}
                                source={{uri: userProfileForm[PROFILE_IMAGE_INDEX].value}}
                                resizeMode={"cover"}/>
                            : <Image style={styles.avatar}
                                     source={require('@assets/favicon.png')}/>}

                        <Text style={styles.name}>
                           {userProfileForm[FIRST_NAME_INDEX].value + " " + userProfileForm[MIDDLE_NAME_INDEX].value + " " + userProfileForm[LAST_NAME_INDEX].value}
                        </Text>

                    </View>
                    <Button style={styles.shareButton} onPress={() => onPressed(11, 'image-picker')}>
                        <Text fontSize={16} color={'white'}>Pick an image</Text>
                    </Button>

                    <FormField formElements={userProfileForm} onChange={onChangeUserProfile} onSubmit={onPressed}/>
                </ScrollView>
            </View>
            <View style={bottom.bottomView}>
                <Button onPress={()=>{
                    onUserSubmit()
                }} style={[button.color, button.borderRadius]}>
                    <Text fontSize={16} color={'white'}>
                        Submit
                    </Text>
                </Button>
            </View>


    </>
}
const bottom = StyleSheet.create({

    bottomView: {
        width: '100%',
        backgroundColor: '#fff',
        bottom: 0,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        },
        padding: 20
    },
});
const button = StyleSheet.create({
    color: {
        backgroundColor: primaryColor
    },
    borderRadius: {

        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
})

export default UserProfile
