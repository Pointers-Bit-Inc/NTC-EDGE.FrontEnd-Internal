import {
    ActivityIndicator,
    FlatList,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import axios from "axios";
import Highlighter from "@pages/activities/search/highlighter";
import DotHorizontalIcon from "@assets/svg/dotHorizontal";
import {styles} from "@pages/activities/styles";
import SearchIcon from "@assets/svg/search";
import FilterOutlineIcon from "@assets/svg/FilterOutline";
import AddParticipantOutlineIcon from "@assets/svg/addParticipantOutline";
import Pagination from "@atoms/pagination";
import {Bold, Regular500} from "@styles/font";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import ProfileImage from "@atoms/image/profile";
import {fontValue} from "@pages/activities/fontValue";
import {disabledColor, errorColor, infoColor, primaryColor, text} from "@styles/color";
import FormField from "@organisms/forms/form";
import {validateEmail, validatePassword, validatePhone, validateText} from "../../../utils/form-validations";
import useKeyboard from "../../../hooks/useKeyboard";
import {BASE_URL} from "../../../services/config";
import CloseIcon from "@assets/svg/close";
import {removeEmpty} from "@pages/activities/script";
import {ToastType} from "@atoms/toast/ToastProvider";
import {useToast} from "../../../hooks/useToast";
import {Toast} from "@atoms/toast/Toast";
import EmployeeIcon from "@assets/svg/employeeIcon";
import {EMPLOYEES, USERS} from "../../../reducers/activity/initialstate";
import UserIcon from "@assets/svg/userIcon";
import {isMobile} from "@pages/activities/isMobile";
import {isLandscapeSync, isTablet} from "react-native-device-info";
import ProfileData from "@templates/datatable/ProfileData";
import RefreshWeb from "@assets/svg/refreshWeb";
import {setData, setDataId} from "../../../reducers/application/actions";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import ResetPasswordTab from "./ResetPasswordTab";
import tabBarOption from "@templates/datatable/TabBarOptions";
import {generatePassword, recursionObject, regionList} from "../../../utils/ntc";
import {UploadIcon} from "@atoms/icon";
import * as ImagePicker from "expo-image-picker";
import AwesomeAlert from "react-native-awesome-alerts";
import useSafeState from "../../../hooks/useSafeState";
import _ from "lodash";
import UploadQrCode from "@assets/svg/uploadQrCode";

const style = StyleSheet.create({
    row: {
        color: "#606A80",
        fontSize: 16,
        fontFamily: Regular500,
        fontWeight: "500"
    },
    rowStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    cellStyle: {
        flex: 1,
        margin: 10,
    },
    tableHeader: {
        fontSize: 16,
        fontFamily: Regular500,
        fontWeight: "500",
        color: "#606A80"
    },
    container: {
        backgroundColor: "#F8F8F8",
        flex: 1,
        flexDirection: "row"
    },
    title: {
        backgroundColor: "#fff",
        paddingHorizontal: 25,
        paddingVertical: 22,
    },
    text: {
        color: "#113196",
        fontWeight: "600",
        fontSize: 24,
        fontFamily: Bold,

    },
    search: {
        paddingTop: 20,
        paddingBottom: 7,
        alignItems: "center",
        justifyContent: "space-between",

    },
    rightrow: {
        flexDirection: "row"
    },
    filter: {
        borderRadius: 8,
        paddingHorizontal: 22,
        paddingVertical: 9,
        backgroundColor: "#041B6E"
    },
    addParticipant: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 8,
        paddingHorizontal: 22,
        paddingVertical: 11,
        backgroundColor: "#041B6E"
    },
    shadow: {
        flex: 1,
        shadowColor: "rgba(0,0,0,0.1)",
        shadowOffset: {width: 0, height: 4},
        elevation: 30,
        shadowOpacity: 1,
        shadowRadius: 10
    },
    headerTable: {
        marginTop: 35,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        marginHorizontal: 25,
        backgroundColor: "#fff",
    },
    headerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 23
    },
    refresh: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginHorizontal: 10,
        padding: 11,
        borderRadius: 100
    },
    flatlist: {
        marginBottom: 5,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        marginHorizontal: 25,
        flex: 1,
        backgroundColor: "#fff",
    },
    textTable: {
        fontFamily: Bold,
        color: "#606A80",
        fontSize: 20,
        fontWeight: "600"
    },
    contentContainer: {
        borderBottomColor: "#F0F0F0",
        borderBottomWidth: 1
    },
    pagination: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    subtitle: {paddingVertical: 10, paddingHorizontal: 10, fontSize: 18, fontFamily: Bold, color: infoColor}

});
import {useFocusEffect,} from '@react-navigation/native';

const DataTable = (props) => {

    const user = useSelector((state: RootStateOrAny) => state.user);
    const dispatch = useDispatch();
    const dimensions = useWindowDimensions();
    const [value, setValue] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(12);
    const [total, setTotal] = useState(10);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState([]);
    const [role, setRole] = useState('');
    const flatListRef = useRef();
    const [modalView, setModalView] = useState(false)
    const [alert, setAlert] = useState();
    const data = useSelector((state: RootStateOrAny) => {
        return state.application.data
    });
    const resetPasswordPermission = useSelector((state: RootStateOrAny) => state.user?.role?.permission?.resetPasswordPermission);
    const originalForm = [
        {
            label: "Role",
            type: 'text',
            style: style.subtitle,
        },
        {
            stateName: 'role',
            id: 6,
            key: 6,
            subStateName: 'key',
            required: true,
            data: props.filter,
            label: 'Role',
            type: 'select',
            placeholder: 'Role',
            value: user.employeeDetails?.region || '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            label: "Basic Info",
            type: 'text',
            style: style.subtitle,
        },
        {
            stateName: '_id',
            id: 0,
            key: 0,
            required: false,
            label: 'Id',
            type: 'input',
            placeholder: 'Id',
            value: '',
            error: false,
            description: false,
            hasValidation: true,
            hidden: true
        }, {
            stateName: 'firstName',
            id: 1,
            key: 1,
            required: true,
            label: 'First Name',
            type: 'input',
            placeholder: 'First Name',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'middleName',
            id: 2,
            key: 2,
            required: true,
            label: 'Middle Name',
            type: 'input',
            placeholder: 'Middle Name',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'lastName',
            id: 3,
            key: 3,
            required: true,
            label: 'Last Name',
            type: 'input',
            placeholder: 'Last Name',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'email',
            id: 4,
            key: 4,
            required: true,
            label: 'Email',
            type: 'input',
            placeholder: 'Email',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'suffix',
            id: 5,
            key: 5,
            required: true,
            label: 'Suffix',
            type: 'input',
            placeholder: 'Suffix',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            label: "Address",
            type: 'text',
            style: style.subtitle,
        },
        {
            stateName: 'address',
            subStateName: 'street',
            id: 7,
            key: 7,
            required: true,
            label: 'Street',
            type: 'input',
            placeholder: 'Street',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'address',
            subStateName: 'unit',
            id: 21,
            key: 21,
            required: true,
            label: 'Unit',
            type: 'input',
            placeholder: 'Unit',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'address',
            subStateName: 'barangay',
            id: 22,
            key: 22,
            required: true,
            label: 'Barangay',
            type: 'input',
            placeholder: 'Barangay',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'address',
            subStateName: 'region',
            id: 25,
            key: 25,
            data: regionList,
            required: true,
            label: 'Region',
            type: "select",
            placeholder: 'Region',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'address',
            subStateName: 'province',
            id: 24,
            key: 24,
            required: true,
            label: 'Province',
            type: 'select',
            data: [],
            placeholder: 'Province',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'address',
            subStateName: 'city',
            id: 23,
            key: 23,
            data: [],
            required: true,
            label: 'City',
            type: 'select',
            placeholder: 'City',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'address',
            subStateName: 'zipCode',
            id: 26,
            key: 26,
            required: true,
            label: 'Zipcode',
            type: "input",
            placeholder: 'Zipcode',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'contactNumber',
            id: 8,
            key: 8,
            required: true,
            label: 'Contact Number',
            type: 'input',
            placeholder: 'Contact Number',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },

        {
            stateName: 'dateOfBirth',
            id: 9,
            key: 9,
            required: true,
            label: 'Date of Birth',
            type: 'date',
            placeholder: 'Date of Birth',
            value: '2022-10-07T01:36:36.417Z',
            error: false,
            description: false,
            hasValidation: true
        },

        {
            stateName: 'sex',
            id: 10,
            key: 10,
            required: true,
            data: [
                {value: "male", label: 'Male',},
                {value: "female", label: 'Female',},
            ],
            label: 'Sex',
            type: 'select',
            placeholder: 'Sex',
            value: 'male',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'nationality',
            id: 13,
            key: 13,
            required: true,
            label: 'Nationality',
            type: 'select',
            data: [
                {label: 'Filipino', value: 'Filipino'},
                {label: 'Others', value: 'Others', hasSpecification: true}
            ],
            placeholder: 'Nationality',
            value: 'Filipino',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'userType',
            id: 14,
            key: 14,
            required: true,
            data: [
                {value: "individual", label: 'Individual',},
                {value: "company", label: 'Company',},
            ],
            label: 'User Type',
            type: 'select',
            placeholder: 'User Type',
            value: 'individual',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            label: "Employee Details",
            type: 'text',
            style: style.subtitle,
        },
        {
            stateName: 'employeeDetails',
            subStateName: 'region',
            id: 15,
            key: 15,
            required: true,
            label: 'Region',
            data: regionList,
            type: 'select',
            placeholder: 'Region',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'employeeDetails',
            subStateName: 'level',
            id: 16,
            key: 16,
            required: true,
            label: 'Level',
            type: 'input',

            placeholder: 'Level',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'employeeDetails',
            subStateName: 'title',
            id: 17,
            key: 17,
            required: true,
            label: 'Title',
            type: 'input',
            placeholder: 'Title',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'employeeDetails',
            subStateName: 'division',
            id: 18,
            key: 18,
            required: true,
            label: 'Division',
            type: 'input',
            placeholder: 'Division',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'employeeDetails',
            subStateName: 'position',
            id: 19,
            key: 19,
            required: true,
            label: 'Position',
            type: 'input',
            placeholder: 'Position',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'employeeDetails',
            subStateName: 'designation',
            id: 20,
            key: 20,
            required: true,
            label: 'Designation',
            type: 'input',
            placeholder: 'Designation',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {
            stateName: 'employeeDetails',
            subStateName: 'signature',
            mime: "",
            tempBlob: "",
            file: "",
            mimeResult: "",
            _mimeType: "",
            id: 20,
            key: 20,
            containerStyle: {alignItems: "center"},
            style: { height: 200, width: 200, zIndex: 1, borderWidth: 1, borderStyle: "dotted"},
            type: "image",
            required: true,
            label: 'signature',
            placeholder: 'signature',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
        {

            stateName: 'profilePicture',
            id: 11,
            file: {},
        },
        {
            stateName: 'password',
            id: 12,
            key: 12,
            required: true,
            label: 'Password',
            type: 'password',

            placeholder: 'Password',
            value: "",
            error: false,
            hidden: true,
            description: false,
            hasValidation: true
        },
    ];

    useEffect(() => {
        let _userProfileForm = [...userProfileForm]
        let roleId = 6
        const index = _userProfileForm.findIndex((app) => app.id == roleId)

        if (_userProfileForm[index].hasOwnProperty('data')) {
            _userProfileForm[index].data = props.filter
        }

        setUserProfileForm(_userProfileForm)

    }, [props.filter])

    const [userProfileForm, setUserProfileForm] = useState(originalForm);
    const citiesIndexMemo = useMemo(()=>{
        return userProfileForm.findIndex(u => u.subStateName == "city" && u.stateName == "address" )
    }, [])

    const provincesIndexMemo = useMemo(()=>{
        return userProfileForm.findIndex(u => u.subStateName == "province" && u.stateName == "address" )
    }, [])

    const regionIndexMemo = useMemo(()=>{
        return userProfileForm.findIndex(u => u.subStateName == "region" && u.stateName == "address" )
    }, [])


    const citiesMemo = useMemo(()=>{
        var cities = [];

        if( !userProfileForm?.[provincesIndexMemo]?.["value"] ) return []

        axios.get(BASE_URL + "/cities?province=" + userProfileForm?.[provincesIndexMemo]?.["value"] ).then(res =>{
            cities = res.data
            var _userProfileForm = [...userProfileForm]
            if(_userProfileForm[citiesIndexMemo].hasOwnProperty("data")){
                console.log(res.data)
                _userProfileForm[citiesIndexMemo].data = res.data.map(city => {
                  return {value: city.provinceCode, label: city.name}
                })
                setUserProfileForm(userProfileForm)
            }

        })
        return cities
    }, [userProfileForm[provincesIndexMemo]?.["value"]])
    const provincesMemo = useMemo(()=>{
        var provinces = [];

        if( !userProfileForm?.[regionIndexMemo]?.["value"] ) return []

        axios.get(BASE_URL + "/provinces?region=" + userProfileForm?.[regionIndexMemo]?.["value"] ).then(res =>{
            provinces = res.data
            var _userProfileForm = [...userProfileForm]
            if(_userProfileForm[provincesIndexMemo].hasOwnProperty("data")){
                _userProfileForm[provincesIndexMemo].data = res.data.map(city => {
                    return {value: city.provinceCode, label: city.name}
                })
                setUserProfileForm(userProfileForm)
            }

        })
        return provinces
    }, [userProfileForm[regionIndexMemo]?.["value"]])

    const [state, setState] = useState('add');

    const dataId = useSelector((state: RootStateOrAny) => state.application.dataId);
    const {showToast, hideToast} = useToast();
    const config = {
        headers: {
            Authorization: "Bearer ".concat(user?.sessionToken)
        }
    };

    const checkIsDisabled = () => {
        var valid = false;

        userProfileForm?.forEach((up: any) => {
            if ((!up?.value || up?.error) && ((props.name == EMPLOYEES && ["region"].indexOf(up.subStateName) != -1) || (["role", "dateOfBirth", "firstName", "middleName", "email", "lastName"].indexOf(up.stateName) != -1))) {
                valid = true;
            }
        });
        return valid;
    };
    const fetchCallback = useCallback((_page?: number, text?: string) => {
        setLoading(true);
        flatListRef?.current?.scrollToEnd({animated: true});
        const search = async () => {
            const response = await axios.get(props.url, {
                ...config, params: {
                    page: _page ? _page : page, pageSize: size, ...(
                        text && {keyword: text}), ...(
                        (
                            role || props.role) && {
                            role: (
                                role || props.role)
                        }),
                }
            }).catch((error) => {
                hideToast()
                let _err = '';

                for (const err in error?.response?.data?.errors) {
                    _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
                }
                if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string")) {
                    showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data)
                }
                if (error?.response?.status == 403) {
                    props?.catchError('view')
                }


            });
            setLoading(false);
            flatListRef?.current?.scrollToOffset({offset: 0, animated: true});

            if (response) {
                setPage(response?.data?.page);
                setSize(response?.data?.size);
                setTotal(response?.data?.total);
                setDocs(response?.data?.docs)
            }

        };
        const timerId = setTimeout(() => {
            search();
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        const search = async () => {
            const {data} = await axios.get(props.url, {
                ...config, params: {
                    page: 1, pageSize: size, ...(
                        value && {keyword: value}), ...(
                        (
                            !role || role || props.role) && {
                            role: (
                                role || props.role)
                        }),
                }
            });
            setLoading(false);
            setPage(data?.page);
            setSize(data?.size);
            setTotal(data?.total);
            setDocs(data?.docs)
        };
        const timerId = setTimeout(() => {
            search();
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };

    }, [value, role]);
    useEffect(() => {
        setLoading(true);
        fetchCallback()
    }, []);
    const [selectedId, setSelectedId] = useState(0)

    function onDelete(id) {
        let _docs = [...docs]
        let exist = _docs?.findIndex((doc) => doc._id == id)
        setSelectedId(id)
        axios.delete(BASE_URL + `/users/${id}`, config).then((response) => {
            setSelectedId(null)
            if (exist > -1) {
                _docs.splice(exist, 1);
            }
            setDocs(_docs)
            showToast(ToastType.Success, "Successfully deleted!")
        }).catch((error) => {
            hideToast()
            let _err = '';

            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string")) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data)
            }

        })
    }

    const [showDeleteAlert, setShowDeleteAlert] = useSafeState(false)
    const renderItems = ({item}) => {
        return <View style={{
            backgroundColor: item._id == selectedId ? errorColor : "white",
            paddingLeft: 24,
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0"
        }}>

            <TouchableOpacity style={style.rowStyle} onPress={() => {
                dispatch(setData(item))
                if (Platform.OS == "web") {
                    setState('view');
                } else {
                    props.navigation.navigate('UserEdit')
                }


            }
            }>
                <View style={style.cellStyle}>
                    <Text style={[style.tableHeader, {color: "#000000"}]}>{item._id.slice(0, 8)}</Text>
                </View>
                <View style={style.cellStyle}>
                    <View style={{flexDirection: "row", alignItems: "center",}}>
                        <View style={{paddingRight: 15}}>
                            <ProfileImage
                                size={fontValue(45)}
                                image={item?.profilePicture?.thumb ? item?.profilePicture?.thumb.match(/[^/]+(jpg|jpeg|png|gif)$/i) ? item?.profilePicture?.thumb : item?.profilePicture?.thumb + ".png" : null}
                                name={item?.firstName ? `${item?.firstName} ${item?.lastName}` : (
                                    item?.applicantName ? item?.applicantName : "")}
                            />
                        </View>

                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={[style.tableHeader, {color: "#000000"}]}><Highlighter
                                highlightStyle={{backgroundColor: '#BFD6FF'}}
                                searchWords={[value]}
                                textToHighlight={`${item.firstName} ${item.lastName}`}
                            /></Text>
                            <Text numberOfLines={1}
                                  style={[style.tableHeader, {fontSize: 10, color: "#2863D6"}]}><Highlighter
                                highlightStyle={{backgroundColor: '#BFD6FF'}}
                                searchWords={[value]}
                                textToHighlight={item.email}
                            /></Text>
                        </View>

                    </View>

                </View>
                <View style={[style.cellStyle, {flex: 0.5}]}>
                    <Text style={[style.tableHeader, {color: "#000000"}]}>{item?.role?.name}</Text>
                </View>
                <View style={[style.cellStyle, {flex: 0.5}]}>
                    <Menu onClose={() => {

                    }} onSelect={value => {
                        if (value == "edit") {
                            let newArr = [...userProfileForm];
                            dispatch(setData({}))
                            setState('edit');
                            console.log(item, "item")
                            userProfileForm.map((e, index) => {

                                for (const props in item) {
                                    if (_.isObject(item?.[props])) {
                                        recursionObject(item?.[props], (val, key) => {
                                            if (key == newArr[index]?.subStateName) {
                                                newArr[index].value = val
                                            }
                                        })
                                    } else {

                                        if (newArr[index]['stateName'] === props && props === 'role') {
                                            console.log(item?.[props]?.key)
                                            newArr[index]['value'] = item?.[props]?.key;
                                        } else if (newArr[index]['stateName'] === props) {
                                            newArr[index]['value'] = item[props];
                                        }
                                    }

                                }

                            });
                            setUserProfileForm(newArr);
                            setModalClose(true)
                        } else if (value == "view") {
                            setState('view');
                            dispatch(setData(item))
                        } else if (value == "delete") {

                            dispatch(setDataId(item._id))
                            setShowDeleteAlert(true)
                        }

                    }}>

                        <MenuTrigger>
                            <DotHorizontalIcon/>
                        </MenuTrigger>

                        <MenuOptions optionsContainerStyle={{
                            marginTop: 30,
                            shadowColor: "rgba(0,0,0,1)",
                            paddingVertical: 10,
                            borderRadius: 8,
                            shadowOffset: {
                                width: 0,
                                height: 0
                            },
                            elevation: 45,
                            shadowOpacity: 0.1,
                            shadowRadius: 15,
                        }}>
                            {props?.permissionView ? <MenuOption value={'view'}>
                                <View>
                                    <Text>{'View'}</Text>
                                </View>
                            </MenuOption> : <></>}
                            {props?.permissionEdit ? <MenuOption value={'edit'}>
                                <View>
                                    <Text>{'Edit'}</Text>
                                </View>
                            </MenuOption> : <></>}
                            {props?.permissionDelete ? <MenuOption value={'delete'}>
                                <View>
                                    <Text style={{color: errorColor}}>{'Delete'}</Text>
                                </View>
                            </MenuOption> : <></>}
                        </MenuOptions>

                    </Menu>
                </View>
            </TouchableOpacity>


        </View>

    };

    const cleanForm = () => {
        let newArr = [...userProfileForm];
        userProfileForm.map((e, index) => {
            if (e.hasOwnProperty("type")) {
                if (e?.type != "select") {
                    if (newArr[index].hasOwnProperty("value")) {
                        newArr[index].value = ''
                    }
                    if (newArr[index].hasOwnProperty("tempBlob")) {
                        newArr[index].tempBlob = ''
                    }
                }
            }

            if (newArr[index].hasOwnProperty("error")) {
                newArr[index].error = false;
            }
            if (newArr[index].hasOwnProperty("description")) {
                newArr[index].description = false;
            }
            if (newArr[index].hasOwnProperty("hasValidation")) {
                newArr[index].hasValidation = false;
            }
        });
        setUserProfileForm(newArr);
    };

    const onUpdateForm = (id: number, text: any, element?: string, _key?: string) => {
        let index = userProfileForm?.findIndex(app => app?.id == id);
        let newArr = [...userProfileForm];
        newArr[index]['value'] = text;
        newArr[index]['hasValidation'] = false;
        newArr[index]['error'] = false;
        if (_key == 'password') newArr[index]['error'] = !validatePassword(text)?.isValid;
        else if (_key === 'email') newArr[index]['error'] = !validateEmail(text);
        else if (_key === 'contactNumber') newArr[index]['error'] = !validatePhone(text);
        else newArr[index]['error'] = !validateText(text);
        setUserProfileForm(newArr);
    };
    const onPress = async (id?: number, type?: string | number) => {
        var updatedUser = {password: ""}, subStateName = {};
        let signatureIndex = userProfileForm?.findIndex(app => app?.stateName == "employeeDetails" && app.subStateName == "signature");

        userProfileForm?.forEach(async (up: any) => {
            if (!up?.stateName) return
            if (up.hasOwnProperty("subStateName") && up.stateName != "role" && up.subStateName ) {
                subStateName[up.subStateName] = up?.value
            }

            return updatedUser = {
                ...updatedUser,
                [up?.stateName]: (up.subStateName && up.stateName != "role") ? {...subStateName} : up?.value
            };
        });
        if(state != "edit"){
            updatedUser.password = generatePassword()
        }

        setLoading(true);
        axios[updatedUser?._id ? "patch" : "post"](BASE_URL + (updatedUser?._id ? `/users/` + updatedUser?._id || "" : `/internal/users/`), updatedUser, config).then(async (response) => {
            let newArr = [...docs];

            showToast(ToastType.Success, updatedUser?._id ? "Successfully updated!" : "Successfully created!");

            if (updatedUser?._id) {

                let index = newArr?.findIndex(app => app?._id == response.data.doc._id);
                newArr[index] = {...newArr[index], ...removeEmpty(response.data.doc)};

                setDocs(newArr)
            } else {
                newArr.unshift(response.data)
                setDocs(newArr)
            }
            setModalClose(false)
            setLoading(false);
            let _signature = userProfileForm[signatureIndex]
            let tempBlob = userProfileForm?.[signatureIndex]?.tempBlob


            if (tempBlob) {
                await fetch(tempBlob)
                    .then(res => {
                        return res?.blob()
                    })
                    .then(blob => {

                        const fd = new FormData();
                        const file = isMobile ? {
                            name: _signature.file?.name,
                            type: 'application/octet-stream',
                            uri: _signature.file?.uri,
                        } : new File([blob], (
                            _signature.file?.name + "." + _signature._mimeType || _signature.file?.mimeType));

                        fd.append('profilePicture', file, (
                            _signature.file?.name + "." + _signature._mimeType || _signature.file?.mimeType));
                        const _id = updatedUser._id ? response?.data?.doc?._id : response?.data?._id
                        const API_URL = `${BASE_URL}/users/${_id}/upload-employee-signature`;

                        fetch(API_URL, {
                            method: 'POST', body: fd, headers: {
                                'Authorization': `Bearer ${user?.sessionToken}`,
                            }
                        })
                            .then(res => {

                                return res?.json()
                            }).then(res => {
                            const _id = updatedUser._id ? response?.data?.doc?._id : response?.data?._id

                            let index = newArr?.findIndex(app => {

                                return app?._id == _id
                            });


                            if (_id && index >= 0) {
                                console.log("update->", newArr[index]["employeeDetails"]?.hasOwnProperty("signature"))

                                    newArr[index]["employeeDetails"]["signature"] = res?.doc?.signature

                                newArr[index] = {...newArr[index], ...removeEmpty(response.data.doc)};

                                setDocs(newArr)
                            } else {
                                var newObj = response.data

                                    newObj["employeeDetails"]["signature"] = res?.doc?.signature
                                setDocs(docs => [newObj, ...docs])
                            }
                        })
                    })
            }

            cleanForm();
        }).catch((err) => {
            setLoading(false);
            var _err = err;
            console.log(_err?.response?.data?.message, "_err?.response?.data?.message")
            if (_err?.response?.data?.message) {
                showToast(ToastType.Error, _err?.response?.data?.message)
            }
            if (err.response.data.error == 'The email address already exists. Please select another email address.') {
                _err = {
                    response: {
                        data: {
                            errors: {
                                Email: [err.response.data.error]
                            }
                        }
                    }
                }
            }
            let newArr = [...userProfileForm];
            userProfileForm.map(e => {
                for (const error in _err?.response?.data?.errors) {
                    if (e.stateName?.toLowerCase() == error?.toLowerCase()) {
                        let index = newArr?.findIndex(app => app?.id == e?.id);
                        newArr[index]['error'] = true;
                        newArr[index]['description'] = _err?.response?.data?.errors?.[error].toString();
                        newArr[index]['hasValidation'] = true;
                    }
                }
            });

            if (_err?.response?.data?.title) {
                showToast(ToastType.Error, _err?.response?.data?.title)
            }

            setUserProfileForm(newArr);


        });
    };
    const scrollView = useRef();
    const isKeyboardVisible = useKeyboard();
    const [modalClose, setModalClose] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            setState("close")
        }, [])
    );
    const DrawerIcon = () => {
        let Icon: any = null;
        let width = ((dimensions?.width * 10)) * 0.05
        let height = ((dimensions?.height * 3)) * 0.05
        switch (props.name) {
            case EMPLOYEES:
                Icon = <EmployeeIcon width={width} height={height} color={"rgba(128, 129, 150,1)"}/>
                break;
            case USERS:
                Icon = <UserIcon width={width} height={height} color={"rgba(128, 129, 150,1)"}/>
                break;
            default:
                Icon = <UserIcon width={width} height={height} color={"rgba(128, 129, 150,1)"}/>
                break;

        }
        return Icon
    }
    const Tab = createMaterialTopTabNavigator();

    const tabBarOptions = tabBarOption();

    const [uploadSignatureLoading, setUploadSignatureLoading] = useState(false)

    async function onPressSignature(stateName, subStateName) {
        setUploadSignatureLoading(true)
        let picker = await ImagePicker.launchImageLibraryAsync({
            presentationStyle: 0
        });

        if (!picker.cancelled) {
            let uri = picker?.uri;
            let index = userProfileForm?.findIndex(app => app?.stateName == stateName && app.subStateName == subStateName);
            let split = uri?.split('/');
            let name = split?.[split?.length - 1];
            let mimeType = name?.split('.')?.[1] || picker?.type;
            let _file = {
                name,
                mimeType,
                uri,
            };
            let base64 = _file?.uri;
            let mime = isMobile ? _file?.mimeType : base64?.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
            let mimeResult: any = null;
            if (mime && mime.length) {
                mimeResult = isMobile ? mime : mime[1];
            }
            let _mimeType = isMobile ? mime : mimeResult?.split("/")?.[1];
            if (index >= 0) {
                let _userProfileFormElement = userProfileForm[index];
                if (_userProfileFormElement.hasOwnProperty("tempBlob")) {
                    _userProfileFormElement.tempBlob = _file?.uri
                }
                if (_userProfileFormElement.hasOwnProperty("mime")) {
                    _userProfileFormElement.mime = mime
                }
                if (_userProfileFormElement.hasOwnProperty("file")) {
                    _userProfileFormElement.file = _file
                }
                if (_userProfileFormElement.hasOwnProperty("mimeResult")) {
                    _userProfileFormElement.mimeResult = mimeResult
                }
                if (_userProfileFormElement.hasOwnProperty("_mimeType")) {
                    _userProfileFormElement._mimeType = _mimeType
                }
            }
            setUploadSignatureLoading(false)
        } else {
            setUploadSignatureLoading(false)
        }
    }

    return (
        <>
            <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
                <View style={[styles.container, styles.shadow, {
                    flexBasis: (
                        (
                            isMobile && !(
                                Platform?.isPad || isTablet())) || dimensions?.width < 768 || (
                            (
                                Platform?.isPad || isTablet()) && !isLandscapeSync())) ? "100%" : (!(state == 'view' || state == "") ? "100%" : "60%"),
                    flexGrow: 0,
                    flexShrink: 0,
                    backgroundColor: "#FFFFFF"
                }]}>
                    <View style={style.container}>
                        <View style={[styles.container, styles.shadow, {
                            flex: 1,
                        }]}>
                            <View style={style.title}>
                                <View>
                                    <Text style={style.text}>
                                        {props.title}
                                    </Text>
                                </View>
                                <View style={[style.search, {flexDirection: "row",}]}>
                                    <View style={{flex: 0.90, paddingRight: 15}}>
                                        <TextInput value={value} onChangeText={text => {
                                            setValue(text)

                                        }} placeholderTextColor={"#6E7191"} placeholder={"Search"}
                                                   style={styles.search}/>
                                        <View style={styles.searchIcon}>
                                            <SearchIcon/>
                                        </View>
                                    </View>
                                    <View style={style.rightrow}>
                                        <View style={{paddingRight: 10}}>
                                            <View style={style.filter}>
                                                <Menu onClose={() => {

                                                }} onSelect={value => {
                                                    setRole(role => role == value ? "" : value)
                                                }}>

                                                    <MenuTrigger>
                                                        <FilterOutlineIcon/>
                                                    </MenuTrigger>

                                                    <MenuOptions optionsContainerStyle={{
                                                        marginTop: 50,
                                                        shadowColor: "rgba(0,0,0,1)",
                                                        paddingVertical: 10,
                                                        borderRadius: 8,
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 0
                                                        },
                                                        elevation: 45,
                                                        shadowOpacity: 0.1,
                                                        shadowRadius: 15,
                                                    }}>
                                                        {
                                                            props.filter.map((option) => {
                                                                return <MenuOption value={option?.value}>
                                                                    <View>
                                                                        <Text>{option?.label}</Text>
                                                                    </View>
                                                                </MenuOption>
                                                            })
                                                        }

                                                    </MenuOptions>

                                                </Menu>

                                            </View>
                                        </View>
                                        {props.permissionCreate ? <TouchableOpacity onPress={() => {
                                            setState('add');
                                            setModalClose(true)
                                        }}>
                                            <View style={style.addParticipant}>
                                                <View style={{paddingRight: 10}}>
                                                    <AddParticipantOutlineIcon color={"#fff"}/>
                                                </View>

                                                <Text style={{color: "#fff"}}>{props.addButtonTitle}</Text>
                                            </View>
                                        </TouchableOpacity> : <></>}

                                    </View>

                                </View>


                            </View>

                            <View style={style.shadow}>


                                <View style={style.headerTable}>

                                    <View style={style.headerTextContainer}>
                                        <Text style={style.textTable}>{props.title}</Text>
                                        <TouchableOpacity onPress={() => fetchCallback()}>
                                            <View
                                                style={[
                                                    style.refresh,
                                                    {borderWidth: 0, marginHorizontal: 0}
                                                ]}
                                            >
                                                <RefreshWeb
                                                    width={fontValue(26)}
                                                    height={fontValue(24)}
                                                    fill={"#fff"}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{marginHorizontal: 25, backgroundColor: "#fff",}}>

                                    <View style={{paddingLeft: 24,}}>
                                        <View style={style.rowStyle}>
                                            <View style={style.cellStyle}>
                                                <Text style={style.tableHeader}>ID</Text>
                                            </View>
                                            <View style={style.cellStyle}>
                                                <Text style={style.tableHeader}>NAME</Text>
                                            </View>
                                            <View style={style.cellStyle}>
                                                <Text style={style.tableHeader}>DEPARTMENT ROLE</Text>
                                            </View>

                                            <View>
                                                <View style={{width: 24}}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={style.flatlist}>

                                    <View style={{
                                        zIndex: 2,
                                        height: "90%",
                                        justifyContent: "center",
                                        alignSelf: "center",
                                        position: "absolute"
                                    }}>
                                        {!docs?.length && <View>
                                            <DrawerIcon/>
                                        </View>}
                                        {loading && <View style={{padding: 20}}>
                                            <ActivityIndicator color={"#808196"}/>
                                        </View>}

                                    </View>
                                    {/*<TouchableOpacity onPress={()=> flatListRef?.current?.scrollToOffset({offset: 0, animated: true})}>
                                <View style={{justifyContent: "center", alignItems: "center"}}>
                                    <ChevronUpIcon/>
                                </View>
                            </TouchableOpacity>*/}
                                    <FlatList
                                        ref={flatListRef}
                                        contentContainerStyle={style.contentContainer}
                                        data={docs}
                                        keyExtractor={item => item._id}
                                        renderItem={renderItems}
                                    />
                                    {/*<TouchableOpacity onPress={()=> flatListRef?.current?.scrollToEnd({animated: true})}>
                                <View style={{justifyContent: "center", alignItems: "center"}}>
                                    <ChevronDownIcon/>
                                </View>
                            </TouchableOpacity>*/}


                                </View>
                                <Pagination size={size} page={page} total={total} fetch={fetchCallback}/>
                            </View>
                        </View>
                    </View>

                </View>

                {
                    !(
                        (
                            isMobile && !(
                                Platform?.isPad || isTablet()))) && dimensions?.width > 768 && !_.isEmpty(data) &&
                    <View style={[{flex: 1}]}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: 15,
                            paddingHorizontal: 15,
                            backgroundColor: "#fff",
                            width: "100%"
                        }}>
                            <View/>
                            <Text style={{
                                textAlign: "center",
                                fontFamily: Bold
                            }}>{(data?.firstName ? data?.firstName : "") + " " + (data?.middleName ? data?.middleName : "") + " " + (data?.lastName ? data?.lastName : "")}</Text>
                            <TouchableOpacity onPress={() => {
                                dispatch(setData({}))
                                setState("close")
                            }
                            }>
                                <CloseIcon></CloseIcon>
                            </TouchableOpacity>
                        </View>
                        <Tab.Navigator screenOptions={tabBarOptions}>
                            <Tab.Screen name="Profile Data" component={ProfileData}/>

                            {resetPasswordPermission ?
                                <Tab.Screen name="Reset Password" component={ResetPasswordTab}/> : <></>}
                        </Tab.Navigator>

                    </View>
                }

            </View>
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalView}
                onRequestClose={() => {
                    console.log("Modal has been closed.")
                }}>
                <View style={style.modal}>

                    <View style={{backgroundColor: "#fff", padding: 20, borderRadius: 8,}}>
                        <View style={{height: dimensions.height * 0.90, width: dimensions.width * 0.7,}}>


                            <View style={{paddingBottom: 20}}>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}>
                                    <Text style={style.text}>
                                        {state == 'edit' ? props.editTitle : props.addTitle}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        cleanForm();
                                        setModalView(false)
                                    }}>
                                        <CloseIcon/>
                                    </TouchableOpacity>

                                </View>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                                <ProfileData data={data}/>


                            </ScrollView>

                            <Toast/>


                        </View>
                    </View>

                </View>
            </Modal>
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalClose}
                onRequestClose={() => {
                    console.log("Modal has been closed.")
                }}>
                <View style={style.modal}>

                    <View style={{backgroundColor: "#fff", padding: 20, borderRadius: 8,}}>
                        <View style={{height: dimensions.height * 0.90, width: dimensions.width * 0.8,}}>


                            <View style={{paddingBottom: 20}}>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}>
                                    <Text style={style.text}>
                                        {state == 'edit' ? props.editTitle : props.addTitle}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        cleanForm();
                                        setModalClose(false)
                                    }}>
                                        <CloseIcon/>
                                    </TouchableOpacity>

                                </View>
                            </View>


                            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                                <FormField
                                    formElements={userProfileForm}
                                    onChange={onUpdateForm}
                                    onSubmit={onPress}
                                    handleEvent={(event) => {
                                        if (isKeyboardVisible) {
                                            scrollView?.current?.scrollTo({
                                                x: 0,
                                                y: event?.y,
                                                animated: true,
                                            })
                                        }
                                    }}
                                />
                                <View style={{alignItems: "center"}}>
                                    <TouchableOpacity onPress={() => onPressSignature("employeeDetails", 'signature')}>
                                        <View style={styles.uploadSignature}>
                                            <View style={{paddingRight: 10}}>
                                                {uploadSignatureLoading ? <ActivityIndicator/> :
                                                    <UploadQrCode color={text.info}/>}
                                            </View>
                                            <Text style={{fontFamily: Bold}}>Employee Signature</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>



                            </ScrollView>
                            <Toast/>
                            <TouchableOpacity disabled={checkIsDisabled()} onPress={loading ? null : onPress}>
                                <View style={{
                                    borderRadius: 8,
                                    padding: 12,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: checkIsDisabled() ? disabledColor : primaryColor
                                }}>
                                    {loading ? <ActivityIndicator color={"#fff"}/> :
                                        <Text style={{
                                            fontSize: fontValue(12),
                                            color: "white",
                                            fontFamily: Regular500,
                                            fontWeight: "500",
                                        }}>{state == 'edit' ? props?.editButtonTitle : props?.addButtonTitle}</Text>}
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>
            </Modal>
            <AwesomeAlert
                alertContainerStyle={{zIndex: 2}}
                show={showDeleteAlert}
                showProgress={false}
                titleStyle={{fontFamily: Bold}}
                title={"Delete"}
                message="Are you sure you want to delete this item?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Yes, delete it"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setShowDeleteAlert(false)
                }}
                onConfirmPressed={() => {
                    onDelete(dataId)
                    setShowDeleteAlert(false)
                }}
            />
        </>

    )
};

export default DataTable
