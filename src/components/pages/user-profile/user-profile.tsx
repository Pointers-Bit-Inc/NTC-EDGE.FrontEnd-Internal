import React, { useState, useEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator, StatusBar, Dimensions, BackHandler } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import * as ImagePicker from 'expo-image-picker';

import Text from '@atoms/text';
import Left from '@atoms/icon/left';
import NavBar from '@molecules/navbar';
import { UploadIcon } from '@atoms/icon';
import Button from '@atoms/button';
import Alert from '@atoms/alert';
import ProfileImage from '@atoms/image/profile';
import FormField from '@organisms/forms/form';

import { button, defaultColor, errorColor, successColor, text, warningColor} from '@styles/color';

import { BASE_URL, BASE_URL_NODE } from '../../../services/config';
import { validateEmail, validatePassword, validatePhone, validateText } from 'src/utils/form-validations';
import { setUser } from '../../../reducers/user/actions';
import { Bold } from '@styles/font';
import {fontValue} from "@pages/activities/script";

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const { width, height } = Dimensions.get('window');

const UserProfileScreen = ({navigation}: any) => {
    const dispatch = useDispatch();
    const routeIsFocused = navigation.isFocused();
    const user = useSelector((state: RootStateOrAny) => state.user) || {};
    const { profilePicture = {} } = user;
    const photo = profilePicture?.small;

    const onUpdateForm = (id: number, text: any, element?: string, _key?: string) => {
        let index = userProfileForm?.findIndex(app => app?.id == id);
        let newArr = [...userProfileForm];
        newArr[index]['value'] = text;
        if (_key == 'password') newArr[index]['error'] = !validatePassword(text)?.isValid;
        else if (_key === 'email') newArr[index]['error'] = !validateEmail(text);
        else if (_key === 'contactNumber') newArr[index]['error'] = !validatePhone(text);
        else newArr[index]['error'] = !validateText(text);
        setUserProfileForm(newArr);
    };
    const onPress = async (id?: number, type?: string | number) => {
        if (type === 'image-picker') {
            let index = userProfileForm?.findIndex(u => u?.id === id);
            if (index > -1) {
                let picker = await ImagePicker.launchImageLibraryAsync({
                    presentationStyle: 0
                });
                if (!picker.cancelled) {
                    let uri = picker?.uri;
                    let split = uri?.split('/');
                    let name = split?.[split?.length - 1];
                    let mimeType = picker?.type || name?.split('.')?.[1];
                    let _file = {
                        name,
                        mimeType,
                        uri,
                    };
                    userProfileForm[index].file = _file;
                    userProfileForm[index].value = _file?.uri;
                    setUserProfileForm(userProfileForm);
                    save({dp: true});
                }
            }
        }
    };
    const save = ({ dp = false }) => {
        var updatedUser = {}, formData = new FormData();
        userProfileForm?.forEach((up: any) => {
            updatedUser = { ...updatedUser, [up?.stateName]: up?.value };
            if (dp && up?.stateName === 'profilePicture' && up?.file?.uri) {
                formData.append('profilePicture', {
                    name: up?.file?.name,
                    type: up?.file?.mimeType,
                    uri: up?.file?.uri,
                });
            }
        });
        if (!dp) {
            formData.append('data', JSON.stringify({
                firstName: updatedUser?.firstName,
                lastName: updatedUser?.lastName,
                email: updatedUser?.email,
                contactNumber: updatedUser?.contactNumber,
                address: updatedUser?.address,
            }));
        }
        if (isValid()) {
            setLoading({
                photo: dp,
                basic: !dp
            });
            axios
                .patch(
                    `${dp ? BASE_URL_NODE : BASE_URL}/user/profile/${user._id}`,
                    formData,
                    {headers: {
                        'Authorization': `Bearer ${user?.sessionToken}`,
                        'Content-type': 'multipart/form-data',
                    }},
                )
                .then((res: any) => {
                    setLoading({
                        photo: false,
                        basic: false
                    });
                    // setEditable(false);
                    if (res?.status === 200) {
                        setAlert({
                            title: 'Success',
                            message: 'Your profile has been updated!',
                            color: successColor
                        });
                        dispatch(setUser({...user, ...res?.data?.doc}));
                    }
                    else {
                        setAlert({
                            title: 'Failure',
                            message: (res?.statusText || res?.message) || 'Your profile was not edited.',
                            color: errorColor
                        });
                    }
                    setShowAlert(true);
                })
                .catch((err: any) => {
                    err = JSON.parse(JSON.stringify(err));
                    setLoading({
                        photo: false,
                        basic: false
                    });
                    // setEditable(false);
                    if (err?.status === 413) {
                        setAlert({
                            title: 'File Too Large',
                            message: 'File size must be lesser than 2 MB.',
                            color: warningColor
                        });
                    }
                    else {
                        setAlert({
                            title: err?.title || 'Failure',
                            message: err?.message || 'Your profile was not edited.',
                            color: errorColor
                        });
                    }
                    setShowAlert(true);
                });
        }
    };

    const [alert, setAlert] = useState({
        title: '',
        message: '',
        color: defaultColor,
    });
    const [showAlert, setShowAlert] = useState(false);
    const [discardAlert, setDiscardAlert] = useState(false);
	const [loading, setLoading] = useState({
        photo: false,
        basic: false,
    });

    const originalForm = [
        {
            stateName: 'userType',
            id: 1,
            key: 1,
            required: true,
            label: 'User Type',
            type: 'input',
            placeholder: 'User Type',
            value: user?.role?.name || '',
            error: false,
            editable: false,
            disabledColor: text.disabled,
        },
        {
            stateName: 'firstName',
            id: 2,
            key: 2,
            required: true,
            label: 'First Name',
            type: 'input',
            placeholder: 'First Name',
            value: user?.firstName || '',
            error: false,
        },
        {
            stateName: 'lastName',
            id: 3,
            key: 3,
            required: true,
            label: 'Last Name',
            type: 'input',
            placeholder: 'Last Name',
            value: user?.lastName || '',
            error: false,
        },
        {
            stateName: 'email',
            id: 4,
            key: 4,
            required: true,
            label: 'Email',
            type: 'input',
            placeholder: 'Email',
            value: user?.email || '',
            error: false,
        },
        {
            stateName: 'profilePicture',
            id: 11,
            file: {},
        },
        {
            stateName: 'contactNumber',
            id: 9,
            key: 9,
            required: true,
            label: 'Contact Number',
            type: 'input',
            placeholder: 'Contact Number',
            value: user?.contactNumber || '',
            error: false,
        },
        {
            stateName: 'address',
            id: 10,
            key: 10,
            required: true,
            label: 'Address',
            type: 'input',
            placeholder: 'Address',
            value: user?.address || '',
            error: false,
        },
    ];
    const [userProfileForm, setUserProfileForm] = useState(originalForm);
    
    const isValid = () => {
        var valid = true;
        userProfileForm?.forEach((up: any) => {
            if (
                up?.stateName !== 'userType' &&
                up?.stateName !== 'profilePicture' &&
                (!up?.value || up?.error)
            ) {
                valid = false;
                return;
            }
        });
        return valid;
    };
    const hasChanges = () => {
        var hasChanges = false;
        originalForm.forEach(of => {
            if (
                of.stateName === 'firstName' ||
                of.stateName === 'lastName' ||
                of.stateName === 'email' ||
                of.stateName === 'contactNumber' ||
                of.stateName === 'address'
            ) {
                let index = userProfileForm.findIndex(uf => uf.stateName === of.stateName);
                if (index > -1) {
                    if (userProfileForm?.[index]?.value !== of?.value) {
                        hasChanges = true;
                        return;
                    }
                }
            }
        });
        return hasChanges;
    };
    const disabled = loading?.basic || !isValid() || !hasChanges();

    const handleBackButtonClick = () => {
        if (hasChanges()) setDiscardAlert(true);
        else {
            navigation.goBack();
            return true;
        }
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [routeIsFocused]);

    return (
        <View style={styles.container}>
            <NavBar
                title='Profile'
                leftIcon={<Left color='#fff' />}
                onLeft={() => {
                    if (hasChanges()) setDiscardAlert(true);
                    else navigation.pop();
                }}
            />

            <ScrollView style={styles.scrollview} showsVerticalScrollIndicator={false}>
                <View style={[styles.row, {marginBottom: 20}]}>
                    <View>
                        <ProfileImage
                            size={width / 4}
                            textSize={25}
                            image={photo}
                            name={`${user.firstName} ${user.lastName}`}
                        />
                        { loading?.photo && <ActivityIndicator style={styles.activityIndicator} size='large' color='#fff' /> }
                    </View>
                    <TouchableOpacity onPress={() => onPress(11, 'image-picker')}>
                        <View style={styles.row}>
                            <UploadIcon color={text.info} />
                            <Text style={styles.change2}>Upload image</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <FormField
                    formElements={userProfileForm}
                    onChange={onUpdateForm}
                    onSubmit={onPress}
                    // editable={editable}
                />
                <TouchableOpacity onPress={ () =>  navigation.navigate('ResetPassword')} >
                    <Text style={styles.changePassword}>Change Password</Text>
                </TouchableOpacity>
                <View style={{ height: width / 3 }} />
            </ScrollView>

            <Button
                style={[styles.bottomButton, disabled && {backgroundColor: button.disabled}]}
                disabled={disabled}
                onPress={() => save({dp: false})}
            >
                {
                    loading?.basic
                        ?   <ActivityIndicator size='small' color='#fff' />
                        :   <Text style={styles.bottomButtonText}>
                                Save
                            </Text>
                }
            </Button>

            <Alert
                visible={discardAlert}
                title='Discard Changes'
                message='Any unsaved changes will not be saved. Continue?'
                confirmText='OK'
                cancelText='Cancel'
                onConfirm={() => navigation.pop()}
                onCancel={() => setDiscardAlert(false)}
            />

            <Alert
                visible={showAlert}
                title={alert?.title}
                message={alert?.message}
                confirmText='OK'
                onConfirm={() => setShowAlert(false)}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    statusBar: {
        height: STATUSBAR_HEIGHT,
    },
    scrollview: {
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#041B6E',
        padding: 15,
        paddingTop: height * 0.05,
    },
    icon: {
        color: 'rgba(255,255,255,1)',
        fontSize: 25,
        marginLeft: -5,
    },
    profileName: {
        color: 'rgba(249,248,248,1)',
        fontSize: 20,
        alignSelf: 'center'
    },
    touchable: {
        width: '15%',
    },
    edit: {
        color: 'rgba(255,255,255,1)',
        fontSize: 18,
    },
    profilecontainer: {
        backgroundColor: 'yellow',
        height: 100,
    },
    rect2: {
        height: width / 6,
        backgroundColor: 'rgba(219,234,254,1)',
    },
    rect3: {
        alignItems: 'center',
        marginTop: -((width / 4) / 2)
    },
    change2: {
        color: text.info,
        fontSize: fontValue(16),
        marginLeft: 5,
    },
    activityIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        marginTop: '27%'
    },
    divider: {
        backgroundColor: '#E6E6E6',
    },
    changePassword: {
        color: 'rgba(0,74,215,1)',
        fontSize: fontValue(16),
        marginTop: 20,
        marginHorizontal: 10,
        fontFamily: Bold,
    },
    button: {
        borderRadius: 5,
    },
    bottomButton: {
        backgroundColor: button.primary,
        alignSelf: 'center',
        width: '50%',
        borderRadius: 30,
        marginVertical: 20,
    },
    bottomButtonText: {
        color: '#fff',
        fontSize: fontValue(16),
    }
});

export default UserProfileScreen;