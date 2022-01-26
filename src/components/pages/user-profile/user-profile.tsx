import React, { useState, useEffect } from 'react';
import FormField from '@organisms/forms/form';
import InputStyles from '@styles/input-style';
import Text from '@atoms/text';
import { DrawerActions } from '@react-navigation/native';
import { defaultColor, errorColor, successColor, text, warningColor} from '@styles/color';
import {Image, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator, StatusBar, Dimensions, BackHandler} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import { setUser } from '../../../reducers/user/actions';
import {Ionicons} from '@expo/vector-icons';
import ProfileImage from '@components/atoms/image/profile';
import axios from 'axios';
import {BASE_URL} from '../../../services/config';
import AwesomeAlert from 'react-native-awesome-alerts';
import { validateEmail, validatePassword, validatePhone, validateText } from 'src/utils/form-validations';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const { width, height } = Dimensions.get('window');

const UserProfileScreen = ({navigation}: any) => {
    const dispatch = useDispatch();

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
                // let picker = await DocumentPicker.getDocumentAsync({
                //     type: 'image/*',
                // });
                let picker = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: false,
                    aspect: [4, 3],
                    quality: 0,
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
    const openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            setAlert({
                title: 'Permission Denied',
                message: 'Permission to access camera roll is required.',
                color: warningColor
            });
            setShowAlert(true);
            return;
        }
        let picker = await ImagePicker.launchImageLibraryAsync();
        return picker;
    };
    const save = ({ dp = false }) => {
        var isValid = true, updatedUser = {}, formData = new FormData();
        userProfileForm?.forEach((up: any) => {
            updatedUser = { ...updatedUser, [up?.stateName]: up?.value };
            if (dp && up?.stateName === 'profilePicture' && up?.file?.uri) {
                formData.append('profilePicture', {
                    name: up?.file?.name,
                    type: up?.file?.mimeType,
                    uri: up?.file?.uri,
                });
            }
            if (
                up?.stateName !== 'userType' &&
                up?.stateName !== 'profilePicture' &&
                (!up?.value || up?.error)
            ) {
                isValid = false;
                return;
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
        if (isValid) {
            setLoading({
                photo: dp,
                basic: !dp
            });
            axios
                .patch(
                    `${BASE_URL}/user/profile/${user._id}`,
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
                    setEditable(false);
                    if (res?.status === 200) {
                        setAlert({
                            title: 'Success',
                            message: 'Your profile has been updated!',
                            color: successColor
                        });
                        dispatch(setUser({...user, ...res?.data?.doc}));
                    }
                    else {
                        console.log('or here?');
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
                    console.log('here?', err);
                    setLoading({
                        photo: false,
                        basic: false
                    });
                    setEditable(false);
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
    const onSave = () => {
        if (editable) save({dp: false});
        else setEditable(true);
    };

    const [alert, setAlert] = useState({
        title: '',
        message: '',
        color: defaultColor,
    });
    const [showAlert, setShowAlert] = useState(false);
    const [editable, setEditable] = useState(false);
	const [loading, setLoading] = useState({
        photo: false,
        basic: false,
    });
    const [userProfileForm, setUserProfileForm] = useState([
        {
            stateName: 'userType',
            id: 1,
            key: 1,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            disabledColor: text.disabled,
            label: 'User Type',
            type: 'input',
            placeholder: 'User Type',
            value: user?.role?.name || '',
            inputStyle: InputStyles.text,
            error: false,
            editable: false,
        },
        {
            stateName: 'firstName',
            id: 2,
            key: 2,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            disabledColor: text.disabled,
            label: 'First Name',
            type: 'input',
            placeholder: 'First Name',
            value: user?.firstName || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'lastName',
            id: 3,
            key: 3,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            disabledColor: text.disabled,
            label: 'Last Name',
            type: 'input',
            placeholder: 'Last Name',
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
            disabledColor: text.disabled,
            label: 'Email',
            type: 'input',
            placeholder: 'Email',
            value: user?.email || '',
            inputStyle: InputStyles.text,
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
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            disabledColor: text.disabled,
            label: 'Contact Number',
            type: 'input',
            placeholder: 'Contact Number',
            value: user?.contactNumber || '',
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
            disabledColor: text.disabled,
            label: 'Address',
            type: 'input',
            placeholder: 'Address',
            value: user?.address || '',
            inputStyle: InputStyles.text,
            error: false,
        },
    ]);

    const handleBackButtonClick = () => {
        navigation.dispatch(DrawerActions.jumpTo('Home'))
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);

    const MyStatusBar = ({backgroundColor, ...props}: any) => (
        <View style={[styles.statusBar, { backgroundColor }]}>
          <SafeAreaView>
            <StatusBar translucent backgroundColor={backgroundColor} {...props} />
          </SafeAreaView>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* <MyStatusBar backgroundColor='rgba(0,65,172,1)' barStyle='light-content' /> */}
            <View style={styles.group}>
                <TouchableOpacity onPress={handleBackButtonClick} >
                    <Ionicons name='md-close' style={styles.icon}></Ionicons>
                </TouchableOpacity>

                <Text style={styles.profileName}>Profile</Text>
                <TouchableOpacity onPress={onSave} disabled={loading?.photo || loading?.basic}>
                    {
                        loading?.basic
                            ? <ActivityIndicator size='small' color='#fff' />
                            : <Text style={styles?.edit}>{editable ? 'Save' : 'Edit'}</Text>
                    }
                </TouchableOpacity>
            </View>

            <View style={styles.rect2}></View>
            <TouchableOpacity onPress={() => onPress(11, 'image-picker')}>
                <View style={styles.rect3}>
                    <ProfileImage
                        size={width / 4}
                        textSize={25}
                        image={photo}
                        name={`${user.firstName} ${user.lastName}`}
                    /> 
                    <Text style={styles.change2}>Change</Text>
                    { loading?.photo && <ActivityIndicator style={styles.activityIndicator} size='large' color='#fff' /> }
                </View>
            </TouchableOpacity>

            <ScrollView style={styles.scrollview} showsVerticalScrollIndicator={false}>
                <FormField
                    formElements={userProfileForm}
                    onChange={onUpdateForm}
                    onSubmit={onPress}
                    editable={editable}
                />
                <TouchableOpacity onPress={ () =>  navigation.navigate('ResetPassword')} >
                    <Text style={styles.changePassword}>Change Password</Text>
                </TouchableOpacity>
            </ScrollView>

            <AwesomeAlert
                actionContainerStyle={{ flexDirection: 'row-reverse' }}
                show={showAlert}
                showProgress={false}
                title={alert?.title}
                message={alert?.message}
                messageStyle={{ textAlign: 'center' }}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText='OK'
                confirmButtonColor={alert?.color}
                onConfirmPressed={() => setShowAlert(false)}
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
        paddingTop: 30,
        paddingHorizontal: 15,
    },
    group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,65,172,1)',
        padding: 15,
        paddingTop: height * 0.05,
    },
    icon: {
        color: 'rgba(255,255,255,1)',
        fontSize: 25,
        alignSelf: 'center'
    },
    profileName: {
        color: 'rgba(249,248,248,1)',
        fontSize: 20,
        alignSelf: 'center'
    },
    edit: {
        color: 'rgba(255,255,255,1)',
        fontSize: 18,
        alignSelf: 'center'
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
        color: 'rgba(255,255,255,1)',
        marginTop: -(width * .07),
        fontSize: 12,
    },
    activityIndicator: {
        marginTop: -(width / 7),
        marginBottom: width * .047,
    },
    divider: {
        backgroundColor: '#E6E6E6',
    },
    changePassword: {
        color: 'rgba(0,74,215,1)',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginHorizontal: 10,
    },
    button: {
        borderRadius: 5,
    },
});
export default UserProfileScreen;