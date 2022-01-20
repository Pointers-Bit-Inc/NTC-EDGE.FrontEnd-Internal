import React, {useEffect, useMemo, useState} from "react";
import FormField from "@organisms/forms/form";
import InputStyles from "@styles/input-style";
import Text from '@atoms/text';
import {button, primaryColor, text} from "@styles/color";
import {Image, ScrollView, StyleSheet, TouchableOpacity, View,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setUser, updateUser} from "../../../reducers/user/actions";
import {Ionicons} from "@expo/vector-icons";
import ProfileImage from "@components/atoms/image/profile";
import CustomDropdown from "@pages/user-profile/custom-dropdown";
import Button from "@atoms/button";
import axios from "axios";
import {BASE_URL} from "../../../services/config";

const UserProfileScreen = ({navigation}) => {

    const FIRST_NAME_LABEL = "First Name",
        MIDDLE_NAME_LABEL = "Middle Name",
        LAST_NAME_LABEL = "Last Name",
        FIRST_NAME_INDEX = 5,
        MIDDLE_NAME_INDEX = 6,
        LAST_NAME_INDEX = 7,
        PROFILE_IMAGE_INDEX = 3;
    const dispatch = useDispatch();
    const [profileImage, setProfile] = useState("")
    const user = useSelector((state: RootStateOrAny) => state.user);
    useEffect(()=>{
        console.log(user)
    }, [])
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
            label: "User Type",
            type: "input",
            placeholder: "User Type",
            value: user?.role?.name || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'firstName',
            id: 2,
            key: 2,
            required: false,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "First Name",
            type: "input",
            placeholder: "First Name",
            value: user?.firstName || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'lastName',
            id: 3,
            key: 3,
            required: false,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Last Name",
            type: "input",
            placeholder: "Last Name",
            value: user?.lastName || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'email',
            id: 4,
            key: 4,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Email",
            type: "input",
            placeholder: "Email",
            value: user?.email || '',
            inputStyle: InputStyles.text,
            error: false,
        },



        {
            id: 11,

            value: user?.image
        },
        {
            stateName: 'contactNumber',
            id: 9,
            key: 9,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Contact Number",
            type: "input",
            placeholder: "Contact Number",
            value: user?.contactNumber || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            id: 10,
            key: 10,
            required: false,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Address",
            type: "input",
            placeholder: "Address",
            value: user?.address || '',
            inputStyle: InputStyles.text,
            error: false,
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
                        if(r?.uri){
                            setUserProfileForm(newArr)
                        }

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
            if (!newArr[i].value && newArr[i].required) {
                newArr[i].error = true
            }
            if(userProfileForm[i]?.stateName) userInput[`${userProfileForm[i]?.stateName}`] = userProfileForm[i].value

        }
        setUserProfileForm(newArr)
        if(!error.length){
            const config = {
                headers: {
                    Authorization: "Bearer ".concat(user.sessionToken)
                }
            }

            axios.patch(BASE_URL + `/user/profile/${user._id}`, userInput, config).then((response) =>{
                            console.log(response.data)
                dispatch(updateUser(userInput))
            }).catch((err) => {
                console.warn(err)
            })

        }
    }


    return  <View style={styles.container}>

        <View style={styles.toolbar}>
            <View style={styles.rect}>
                <View style={styles.group}>
                    <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
                        <Ionicons name="md-close" style={styles.icon}></Ionicons>
                    </TouchableOpacity>

                    <Text style={styles.profileName}>Profile</Text>
                    <TouchableOpacity onPress={onUserSubmit}>
                        <Text style={styles.edit}>Edit</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
        <View style={styles.profilecontainer}>

            <View style={styles.rect2Stack}>
                <View style={styles.rect2}></View>
                <TouchableOpacity onPress={() => onPressed(11, 'image-picker')}>
                    <View style={styles.rect3}>
                        {userProfileForm[PROFILE_IMAGE_INDEX].value ? <Image
                                style={{width: 100, height: 100, borderRadius: 50}}
                                source={{uri: userProfileForm[PROFILE_IMAGE_INDEX].value}}
                                resizeMode={"cover"}/>
                            : <ProfileImage
                                size={100}
                                textSize={26}
                                image={user.image}
                                name={`${user.firstName} ${user.lastName}`}
                            />}
                        <Text style={[styles.change2]}>Change</Text>
                    </View>
                </TouchableOpacity>

            </View>
        </View>

        <View>
            {/* <CustomDropdown items={[
                {id: 1, name: "evaluator"},
                {id: 2, name: "director"},
                {id: 3, name: "cashier"},
            ]}/>*/}
            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <View style={{padding: 10}}>

                    <FormField
                        formElements={userProfileForm}
                        onChange={onChangeUserProfile}
                        onSubmit={onPressed}/>

                </View>


            </ScrollView>

        </View>

        <View style={styles.divider}></View>
        <TouchableOpacity onPress={ () =>  navigation.navigate('ResetPassword')} >
            <Text style={styles.changePassword}>Change Password</Text>
        </TouchableOpacity>

    </View>
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 5,
        paddingVertical: 12,
    },
    container: {
        backgroundColor: "#fff",
        flex: 1
    },
    toolbar: {
        height: 100
    },
    rect: {
        height: 100,
        backgroundColor: "rgba(0,65,172,1)"
    },
    group: {
        width: '100%',
        height: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 54,
        paddingHorizontal: 15,
    },
    icon: {
        color: "rgba(255,255,255,1)",
        fontSize: 20,
        height: 23,
        alignSelf: "center"
    },
    profileName: {
        color: "rgba(249,248,248,1)",
        fontSize: 20,
        alignSelf: "center"
    },
    edit: {
        color: "rgba(255,255,255,1)",
        fontSize: 18,
        alignSelf: "center"
    },
    profilecontainer: {
        height: 115
    },
    rect2: {
        top: 0,
        left: 0,
        height: 65,
        position: "absolute",
        backgroundColor: "rgba(219,234,254,1)",
        right: 0
    },
    rect3: {
        borderRadius: 50,
        top: 15,
        alignSelf: "center",
        width: 100,
        height: 100,
        position: "absolute",
        backgroundColor: "#E6E6E6"
    },
    change2: {
        position: "absolute",
        color: "rgba(255,255,255,1)",
        bottom: 15,
        marginLeft: 26
    },
    rect2Stack: {

        height: 115
    },
    divider: {
        height: 10,
        backgroundColor: "#E6E6E6",
    },
    changePassword: {
        color: "rgba(0,74,215,1)",
        fontSize: 15,
        paddingTop: 20,
        paddingLeft: 31
    }
});
export default UserProfileScreen