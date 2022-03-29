import React , {useEffect , useState} from 'react';
import {RootStateOrAny , useDispatch , useSelector} from 'react-redux';
import axios from 'axios';
import {
    ActivityIndicator ,
    BackHandler ,
    Dimensions ,
    ScrollView ,
    StatusBar ,
    StyleSheet ,
    TouchableOpacity ,
    View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Text from '@atoms/text';
import Left from '@atoms/icon/left';
import NavBar from '@molecules/navbar';
import {UploadIcon} from '@atoms/icon';
import Button from '@atoms/button';
import Alert from '@atoms/alert';
import ProfileImage from '@atoms/image/profile';
import FormField from '@organisms/forms/form';

import {button , defaultColor , errorColor , successColor , text , warningColor} from '@styles/color';

import {BASE_URL , BASE_URL_NODE} from '../../../services/config';
import {validateEmail , validatePassword , validatePhone , validateText} from 'src/utils/form-validations';
import {setUser} from '../../../reducers/user/actions';
import {Bold} from '@styles/font';
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";

const STATUSBAR_HEIGHT = StatusBar?.currentHeight;
const { width , height } = Dimensions.get('window');

const UserProfileScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const routeIsFocused = navigation.isFocused();
    const user = useSelector((state: RootStateOrAny) => state.user) || {};
    const { profilePicture = {} } = user;
    const photo = profilePicture?.small;

    const onUpdateForm = (id: number , text: any , element?: string , _key?: string) => {
        let index = userProfileForm?.findIndex(app => app?.id == id);
        let newArr = [...userProfileForm];
        newArr[index]['value'] = text;
        if (_key == 'password') newArr[index]['error'] = !validatePassword(text)?.isValid;
        else if (_key === 'email') newArr[index]['error'] = !validateEmail(text);
        else if (_key === 'contactNumber') newArr[index]['error'] = !validatePhone(text);
        else newArr[index]['error'] = !validateText(text);
        setUserProfileForm(newArr);
    };
    const onPress = async (id?: number , type?: string | number) => {
        if (type === 'image-picker') {
            let index = userProfileForm?.findIndex(u => u?.id === id);
            if (index > -1) {
                let picker = await ImagePicker.launchImageLibraryAsync({
                    presentationStyle : 0
                });
                if (!picker.cancelled) {

                    let uri = picker?.uri;
                    console.log("uri", uri)
                    let split = uri?.split('/');
                    console.log("slit", split)
                    let name = split?.[split?.length - 1];
                    console.log("namr", name)
                    let mimeType =name?.split('.')?.[1] ||  picker?.type ;
                    console.log("mime", mimeType)
                    let _file = {
                        name ,
                        mimeType ,
                        uri ,
                    };
                    console.log(_file)
                    userProfileForm[index].file = _file;
                    userProfileForm[index].value = _file?.uri;
                    setUserProfileForm(userProfileForm);
                    save({ dp : true });
                }
            }
        }
    };

    const save = ({ dp = false }) => {
        var updatedUser = {} , formData = {};
        userProfileForm?.forEach(async (up: any) => {
            updatedUser = { ...updatedUser , [up?.stateName] : up?.value };
            if (dp && up?.stateName === 'profilePicture' && up?.file?.uri) {

                let base64 = up?.file?.uri;
                let mime = isMobile ?up?.file?.mimeType :  base64?.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
                console.log(base64)
                let mimeResult: any = null
                if (mime && mime.length) {
                    mimeResult = isMobile ? mime :mime[1];
                }
                let mimeType = isMobile ? mime : mimeResult?.split("/")?.[1]
                console.log("blob", base64 )
                await fetch(base64)
                    .then(res => {
                        console.log("blob", "asda" )
                        return res?.blob()
                    })
                    .then(blob => {

                        const fd = new FormData();
                        const file =  isMobile ? {
                            name: up?.file?.name,
                            type: 'application/octet-stream',
                            uri: up?.file?.uri,
                        } : new File([ blob] , (up?.file?.name + "." +  mimeType || up?.file?.mimeType) );

                        fd.append('profilePicture' , file, (up?.file?.name + "." + mimeType || up?.file?.mimeType)  );
                        console.log("before api")
                        const API_URL = `${ BASE_URL_NODE }/users/upload-photo`;
                        console.log("after api", API_URL)

                        fetch(API_URL , {
                            method : 'POST' , body : fd , headers : {
                                'Authorization' : `Bearer ${ user?.sessionToken }`,

                            }
                        })
                            .then(res => {
                                console.log(res, "API_URL")
                                return res?.json()
                            })
                            .then(res => {
                                console.log(res)
                                if(res?.success){
                                    console.log(res?.success)
                                    updateUserProfile(dp , res?.doc)
                                }

                            }) .catch((err: any) => {

                            err = JSON.parse(JSON.stringify(err));

                            setLoading({
                                photo : false ,
                                basic : false
                            });
                            // setEditable(false);
                            if (err?.status === 413) {
                                setAlert({
                                    title : 'File Too Large' ,
                                    message : 'File size must be lesser than 2 MB.' ,
                                    color : warningColor
                                });
                            } else {
                                setAlert({
                                    title : err?.title || 'Failure' ,
                                    message : err?.message || 'Your profile was not edited.' ,
                                    color : errorColor
                                });
                            }
                            setShowAlert(true);
                        })
                    }) .catch((err: any) => {

                        err = JSON.parse(JSON.stringify(err));
                        setLoading({
                            photo : false ,
                            basic : false
                        });
                        // setEditable(false);
                        if (err?.status === 413) {
                            setAlert({
                                title : 'File Too Large' ,
                                message : 'File size must be lesser than 2 MB.' ,
                                color : warningColor
                            });
                        } else {
                            setAlert({
                                title : err?.title || 'Failure' ,
                                message : err?.message || 'Your profile was not edited.' ,
                                color : errorColor
                            });
                        }
                        setShowAlert(true);
                    });

            }
        });
        if (!dp) {
            formData = {
                firstName : updatedUser?.firstName ,
                lastName : updatedUser?.lastName ,
                email : updatedUser?.email ,
                contactNumber : updatedUser?.contactNumber ,
                address : updatedUser?.address ,
                profilePicture : user?.profilePictureObj
            }

            updateUserProfile(dp , formData);

        }

    };

    const [alert , setAlert] = useState({
        title : '' ,
        message : '' ,
        color : defaultColor ,
    });
    const [showAlert , setShowAlert] = useState(false);
    const [discardAlert , setDiscardAlert] = useState(false);
    const [loading , setLoading] = useState({
        photo : false ,
        basic : false ,
    });

    const originalForm = [
        {
            stateName : 'userType' ,
            id : 1 ,
            key : 1 ,
            required : true ,
            label : 'User Type' ,
            type : 'input' ,
            placeholder : 'User Type' ,
            value : user?.role?.name || '' ,
            error : false ,
            editable : false ,
            disabledColor : text.disabled ,
        } ,
        {
            stateName : 'firstName' ,
            id : 2 ,
            key : 2 ,
            required : true ,
            label : 'First Name' ,
            type : 'input' ,
            placeholder : 'First Name' ,
            value : user?.firstName || '' ,
            error : false ,
        } ,
        {
            stateName : 'lastName' ,
            id : 3 ,
            key : 3 ,
            required : true ,
            label : 'Last Name' ,
            type : 'input' ,
            placeholder : 'Last Name' ,
            value : user?.lastName || '' ,
            error : false ,
        } ,
        {
            stateName : 'email' ,
            id : 4 ,
            key : 4 ,
            required : true ,
            label : 'Email' ,
            type : 'input' ,
            placeholder : 'Email' ,
            value : user?.email || '' ,
            error : false ,
        } ,
        {
            stateName : 'profilePicture' ,
            id : 11 ,
            file : {} ,
        } ,
        {
            stateName : 'contactNumber' ,
            id : 9 ,
            key : 9 ,
            required : true ,
            label : 'Contact Number' ,
            type : 'input' ,
            placeholder : 'Contact Number' ,
            value : user?.contactNumber || '' ,
            error : false ,
        } ,
        {
            stateName : 'address' ,
            id : 10 ,
            key : 10 ,
            required : true ,
            label : 'Address' ,
            type : 'input' ,
            placeholder : 'Address' ,
            value : user?.address || '' ,
            error : false ,
        } ,
    ];
    const [userProfileForm , setUserProfileForm] = useState(originalForm);

    const isValid = () => {
        var valid = true;

        userProfileForm?.forEach((up: any) => {
            if (
                up?.stateName !== 'address' &&
                up?.stateName !== 'contactNumber' &&
                up?.stateName !== 'userType' &&
                up?.stateName !== 'profilePicture' &&
                (
                    !up?.value || up?.error)
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
    const removeEmpty = obj => {
        if (Array.isArray(obj)) {
            return obj.map(v => (v && !(v instanceof Date) && typeof v === 'object' ? removeEmpty(v) : v)).filter(v => v)
        } else {
            return Object.entries(obj)
                .map(([k, v]) => [k, v && !(v instanceof Date) && typeof v === 'object' ? removeEmpty(v) : v])
                .reduce((a, [k, v]) => (typeof v !== 'boolean' && !v ? a : ((a[k] = v), a)), {})
        }
    }
    function updateUserProfile(dp: boolean , formData: {}) {
        console.log("outside isValid")
        if (isValid()) {
            console.log("inside isValid")
            setLoading({
                photo : dp ,
                basic : !dp
            });

            axios
                .patch(
                    dp ? `${ BASE_URL_NODE }/users/${ user._id }` : `${ BASE_URL }/users/${ user._id }` ,
                    formData  ,
                    {
                        headers : {
                            'Authorization' : `Bearer ${ user?.sessionToken }` ,
                        }
                    } ,
                )
                .then((res: any) => {
                    console.log("response: ", res?.data?.doc)
                    setLoading({
                        photo : false ,
                        basic : false
                    });

                    if (res?.status === 200) {
                        setAlert({
                            title : 'Success' ,
                            message : 'Your profile has been updated!' ,
                            color : successColor
                        });
                        if (dp) {

                            dispatch(setUser({
                                ...user , ...removeEmpty(res?.data?.doc),
                                profilePictureObj : res?.data?.doc?.profilePicture
                            }));

                        } else {

                            dispatch(setUser({ ...user ,  ...removeEmpty(res?.data?.doc) }));
                        }
                    } else {
                        setAlert({
                            title : 'Failure' ,
                            message : (
                                res?.statusText || res?.message) || 'Your profile was not edited.' ,
                            color : errorColor
                        });
                    }
                    setShowAlert(true);
                })
                .catch((err: any) => {
                    err = JSON.parse(JSON.stringify(err));
                    setLoading({
                        photo : false ,
                        basic : false
                    });
                    // setEditable(false);
                    if (err?.status === 413) {
                        setAlert({
                            title : 'File Too Large' ,
                            message : 'File size must be lesser than 2 MB.' ,
                            color : warningColor
                        });
                    } else {
                        setAlert({
                            title : err?.title || 'Failure' ,
                            message : err?.message || 'Your profile was not edited.' ,
                            color : errorColor
                        });
                    }
                    setShowAlert(true);
                });
        }
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress' , handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress' , handleBackButtonClick);
        };
    } , [routeIsFocused]);


    return (
        <View style={ styles.container }>
            <NavBar
                title='Profile'
                leftIcon={ <Left color='#fff'/> }
                onLeft={ () => {
                    if (hasChanges()) setDiscardAlert(true);
                    else navigation.pop();
                } }
            />

            <ScrollView style={ styles.scrollview } showsVerticalScrollIndicator={ false }>
                <View style={ [styles.row , { marginBottom : 20 }] }>
                    <View>

                        <ProfileImage
                            size={ width / 4 }
                            textSize={ 25 }
                            image={ photo }
                            name={ `${ user.firstName } ${ user.lastName }` }
                        />
                        { loading?.photo &&
                        <ActivityIndicator style={ styles.activityIndicator } size='large' color='#fff'/> }
                    </View>
                    <TouchableOpacity onPress={ () => onPress(11 , 'image-picker') }>
                        <View style={ styles.row }>
                            <UploadIcon color={ text.info }/>
                            <Text style={ styles.change2 }>Upload image</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <FormField
                    formElements={ userProfileForm }
                    onChange={ onUpdateForm }
                    onSubmit={ onPress }
                    // editable={editable}
                />
                <TouchableOpacity onPress={ () => navigation.navigate('ResetPassword') }>
                    <Text style={ styles.changePassword }>Change Password</Text>
                </TouchableOpacity>
                <View style={ { height : width / 3 } }/>
            </ScrollView>

            <Button
                style={ [styles.bottomButton , disabled && { backgroundColor : button.disabled }] }
                disabled={ disabled }
                onPress={ () => save({ dp : false }) }
            >
                {
                    loading?.basic
                    ? <ActivityIndicator size='small' color='#fff'/>
                    : <Text style={ styles.bottomButtonText }>
                        Save
                    </Text>
                }
            </Button>

            <Alert
                visible={ discardAlert }
                title='Discard Changes'
                message='Any unsaved changes will not be saved. Continue?'
                confirmText='OK'
                cancelText='Cancel'
                onConfirm={ () => navigation.pop() }
                onCancel={ () => setDiscardAlert(false) }
            />

            <Alert
                visible={ showAlert }
                title={ alert?.title }
                message={ alert?.message }
                confirmText='OK'
                onConfirm={ () => setShowAlert(false) }
            />

        </View>
    )
};

const styles = StyleSheet.create({
    container : {
        backgroundColor : '#fff' ,
        flex : 1
    } ,
    statusBar : {
        height : STATUSBAR_HEIGHT ,
    } ,
    scrollview : {
        padding : 20 ,
    } ,
    row : {
        flexDirection : 'row' ,
        alignItems : 'center' ,
        marginLeft : 15 ,
    } ,
    group : {
        flexDirection : 'row' ,
        justifyContent : 'space-between' ,
        alignItems : 'center' ,
        backgroundColor : '#041B6E' ,
        padding : 15 ,
        paddingTop : height * 0.05 ,
    } ,
    icon : {
        color : 'rgba(255,255,255,1)' ,
        fontSize : 25 ,
        marginLeft : -5 ,
    } ,
    profileName : {
        color : 'rgba(249,248,248,1)' ,
        fontSize : 20 ,
        alignSelf : 'center'
    } ,
    touchable : {
        width : '15%' ,
    } ,
    edit : {
        color : 'rgba(255,255,255,1)' ,
        fontSize : 18 ,
    } ,
    profilecontainer : {
        backgroundColor : 'yellow' ,
        height : 100 ,
    } ,
    rect2 : {
        height : width / 6 ,
        backgroundColor : 'rgba(219,234,254,1)' ,
    } ,
    rect3 : {
        alignItems : 'center' ,
        marginTop : -(
            (
                width / 4) / 2)
    } ,
    change2 : {
        color : text.info ,
        fontSize : fontValue(16) ,
        marginLeft : 5 ,
    } ,
    activityIndicator : {
        position : 'absolute' ,
        alignSelf : 'center' ,
        marginTop : '27%'
    } ,
    divider : {
        backgroundColor : '#E6E6E6' ,
    } ,
    changePassword : {
        color : 'rgba(0,74,215,1)' ,
        fontSize : fontValue(16) ,
        marginTop : 20 ,
        marginHorizontal : 10 ,
        fontFamily : Bold ,
    } ,
    button : {
        borderRadius : 5 ,
    } ,
    bottomButton : {
        backgroundColor : button.primary ,
        alignSelf : 'center' ,
        width : '50%' ,
        borderRadius : 30 ,
        marginVertical : 20 ,
    } ,
    bottomButtonText : {
        color : '#fff' ,
        fontSize : fontValue(16) ,
    }
});

export default UserProfileScreen;