import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {
    Animated,
    FlatList,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import {isTablet} from "react-native-device-info";
import Text from "@atoms/text"
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";
import LeftSideWeb from "@atoms/left-side-web";
import lodash from "lodash";
import _ from "lodash";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import CalendarPicker from 'react-native-calendar-picker';
import {disabledColor, infoColor, input, successColor} from "@styles/color";
import FormField from "@organisms/forms/form";
import {validateText} from "../../../utils/form-validations";
import {px} from "../../../utils/normalized";
import CalendarDateIcon from "@assets/svg/calendarIcon";
import dayjs from "dayjs";
import useModalAnimation from "../../../hooks/useModalAnimation";
import CloseIcon from "@assets/svg/close";
import {isDiff, recursionObject, regionList} from "../../../utils/ntc";
import axios from "axios";
import {BASE_URL} from "../../../services/config";
import {ToastType} from "@atoms/toast/ToastProvider";
import {useToast} from "../../../hooks/useToast";
import {setEditSchedule, setSchedule, setSchedules} from "../../../reducers/schedule/actions";
import moment from "moment";
import ClockIcon from "@assets/svg/clockicon";
import VenueIcon from "@assets/svg/venueicon";
import RegionIcon from "@assets/svg/regionIcon";
import {setEditRole, setRole} from "../../../reducers/role/actions";
import ScheduleCreateEdit from "@pages/schedule/ScheduleCreateEdit";
import {setSessionToken} from "../../../reducers/user/actions";

const {text, background} = input;


function parseSchedule(_originalForm: any[], item) {
    for (let i = 0; i < _originalForm.length; i++) {
        for (const [key, value] of Object.entries(item)) {
            if (_originalForm[i].stateName == key) {
                if (_.isObject(value)) {
                    recursionObject(value, (val, key) => {
                        if (key == _originalForm[i].subStateName) {
                            _originalForm[i].value = val
                        }
                    })
                } else {
                    _originalForm[i].value = value
                }

            }
        }
    }
}

export default function SchedulePage(props: any) {
    const dimensions = useWindowDimensions();
    const {animation, background, display, success} = useModalAnimation();
    const dispatch = useDispatch();
    const page = 1
    const schedules = useSelector((state: RootStateOrAny) => state.schedule.schedules);
    const schedule = useSelector((state: RootStateOrAny) => state.schedule.schedule);
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [value, setValue] = useState()
    const [createSchedule, setCreateSchedule] = useState(false)
    const [loading, setLoading] = useState(false)

    function onClose() {
        setCreateSchedule(false)
    }

    const [originalForm, setOriginalForm] = useState([
        {
            id: 1,
            stateName: "venue",
            label: 'Venue',
            value: "",
            error: false,
            type: 'input',
        },
        {
            id: 2,
            stateName: "region",
            subStateName: 'value',
            label: 'Region',

            value: user?.employeeDetails?.region || "",
            error: false,
            type: 'select',
            data: regionList
        },
        {
            id: 3,
            stateName: "dateStart",
            label: 'dateStart',
            value:  "",
            error: false,
            type: '',
        },
        {
            id: 4,
            stateName: "dateEnd",
            label: 'dateEnd',
            value: "",
            error: false,
            type: '',
        }
    ]);
    const [formValue, setFormValue] = useState(originalForm);


    const onUpdateForm = (id: number, text: any, element?: string, _key?: string) => {

        const index = formValue?.findIndex(app => app?.id == id);
        let newArr = [...formValue];
        newArr[index]['value'] = text;
        if (typeof text == "string") {
            newArr[index]['error'] = !validateText(text);
        }

        setFormValue(newArr)
    };

    function handleStartPress() {
        Animated.spring(animation, {
            toValue: 1,
            useNativeDriver: false,
        }).start();

    }

    function handleInputClear1() {

    }

    function handleEndPress() {

    }

    const fetchSchedules = () => {
        setLoading(true);
        axios.get(BASE_URL + `/schedules?${user?.employeeDetails?.region || "" ? "region=" + user?.employeeDetails?.region + "&" : ""}page=` + page, {
            headers: {
                Authorization: "Bearer ".concat(user.sessionToken)
            }
        }).then((response) => {
            dispatch(setSchedules(response.data))
            setLoading(false);
        }).catch((response) => {

            console.log(response.response)
        })
    }

    useEffect(() => {
        return fetchSchedules()
    }, [schedules.length == 0])
    const config = useMemo(() => {
        return {
            headers: {
                Authorization: "Bearer ".concat(user?.sessionToken)
            }
        };
    }, [user?.sessionToken])


    const isValid = () => {
        var valid = true;

        formValue?.forEach((up: any) => {

            if ((!up?.value || up?.error)) {


                valid = false;
                return;
            }
        });
        return valid;
    };

    const {showToast} = useToast();

    function onUpdateCreateSchedule(method = "post") {
        if (!isValid()) return
        axios[method ? 'post' : 'patch'](BASE_URL + "/schedules", _(formValue).map(v => [v.stateName, v.value]).fromPairs().value(), config).then((res) => {
            showToast(ToastType.Success, "Success! ")
        }).catch((error) => {

            let _err = '';

            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string" || typeof error == "string")) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data || error)
            } else {
                showToast(ToastType.Error, error?.message || 'Something went wrong.');
            }


        })

    }

    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            onUpdateForm(4, date, '', 'dateEnd')

        } else {
            onUpdateForm(4, null, '', 'dateEnd')
            onUpdateForm(3, date, '', 'dateStart')
        }
    }



    const onItemPress = useCallback((item) => {

        dispatch(setSchedule(item))
        let _originalForm = [...JSON.parse(JSON.stringify(originalForm))]
        parseSchedule(_originalForm, item)
        setFormValue(_originalForm)




        if(isMobile){
            props.navigation.push("EditScheduleScreen")
        }

    }, [formValue])
    const updateValid = useMemo(()=>{
        return isDiff(_.map(formValue, 'value'), _.map(originalForm, 'value'));
    }, [formValue, originalForm])
    const renderListItem = ({item}) => {
        return <TouchableOpacity onPress={() => {
            let _originalForm = [...JSON.parse(JSON.stringify(originalForm))]
            parseSchedule(_originalForm, item);
            setOriginalForm(_originalForm)
            onItemPress(item)
        }}><View style={[
            styles?.scheduleContainer,
        ]}>
            <View style={styles?.scheduleRow}>
                <RegionIcon color={"#000"}/>
                <Text style={styles?.scheduleText}>{item?.region?.label}</Text>
            </View>
            <View style={styles?.scheduleInnerSeparator}/>
            <View style={styles?.scheduleRow}>
                <VenueIcon/>
                <Text style={styles?.scheduleText}>{item.venue}</Text>
            </View>
            <View style={styles?.scheduleInnerSeparator}/>
            <View style={styles?.scheduleRow}>
                <View style={[styles?.scheduleRow, {flex: 1}]}>
                    <CalendarDateIcon width={24} height={24}/>
                    <Text style={styles?.scheduleText}>{moment(item?.dateStart).format('ddd DD MMMM YYYY')}</Text>
                </View>
                <View style={styles?.scheduleInnerSeparator}/>
                <View style={[styles?.scheduleRow, {flex: 1}]}>
                    <ClockIcon/>
                    <Text style={styles?.scheduleText}>{moment(item?.dateStart).format('LT')}</Text>
                </View>
            </View>

        </View>
        </TouchableOpacity>
    }
    const schedulesMemo = useMemo(() => {
        return schedules
    }, [schedules])


    return (
        <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>

            <LeftSideWeb>
                <View style={styles.header}>
                    <Header title={"Schedules"}>
                        <TouchableOpacity onPress={() => {

                            dispatch(setSchedule([]))
                            if (isMobile) {
                                props.navigation.push('CreateScheduleScreen')
                            } else {
                                setCreateSchedule(true)
                            }
                        }}>
                            <Text style={{fontSize: fontValue(12)}}>Add a New Schedule</Text>
                        </TouchableOpacity>
                    </Header>
                    <View style={{marginHorizontal: 26,}}>

                        <View style={{
                            paddingTop: 14,
                            paddingBottom: 12,
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexDirection: "row",
                        }}>
                            <View style={{flex: 1, paddingRight: 15}}>
                                <TextInput value={value} onChangeText={text => {
                                    setValue(text)
                                }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                                <View style={styles.searchIcon}>
                                    <SearchIcon/>
                                </View>
                            </View>


                        </View>


                    </View>

                </View>
                <View style={{flex: 1}}>
                    <FlatList
                        data={schedulesMemo}
                        contentContainerStyle={{padding: 10,}}
                        renderItem={renderListItem}
                        keyExtractor={item => item._id}
                    />
                </View>
            </LeftSideWeb>


            {
                !(
                    (
                        isMobile && !(
                            Platform?.isPad || isTablet()))) && (!createSchedule) && lodash.isEmpty(schedule) && dimensions?.width > 768 ?
                    <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                        <NoActivity/>
                        <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                            selected</Text>


                    </View> : <></>
            }

            {
                !lodash.isEmpty(schedule) && Platform.OS == "web" ? <View style={[{flex: 1, backgroundColor: "#fff",}]}>

                    <Header size={24} title={"Schedule: "}>
                        <TouchableOpacity>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>


                        <ScheduleCreateEdit formElements={formValue} onChange={onUpdateForm} onPress={handleStartPress}
                                            onPress1={handleEndPress} backgroundColor={background} scale={display}
                                            translateY={success} onPress2={() => {
                            Animated.spring(animation, {
                                toValue: 0,
                                useNativeDriver: false,
                            }).start();
                        }} dimensions={dimensions} onDateChange={onDateChange}/>
                    <View style={{

                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity onPress={() => onUpdateCreateSchedule('patch')}  disabled={!updateValid} style={{
                            backgroundColor: updateValid ? successColor : disabledColor,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 10
                        }}>

                            <Text style={[styles.text, {color: "#fff"}]} size={14}>Update Schedule</Text>

                        </TouchableOpacity>
                    </View>


                </View> : <></>
            }


            {(createSchedule && lodash.isEmpty(schedule) && !isMobile) ?
                <View style={[{flex: 1, backgroundColor: "#fff",}]}>
                    <Header size={24} title={"Create Schedule"}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>
                    <ScheduleCreateEdit formElements={formValue} onChange={onUpdateForm} onPress={handleStartPress}
                                        onPress1={handleEndPress} backgroundColor={background} scale={display}
                                        translateY={success} onPress2={() => {
                        Animated.spring(animation, {
                            toValue: 0,
                            useNativeDriver: false,
                        }).start();
                    }} dimensions={dimensions} onDateChange={onDateChange}/>
                    <View style={{
                        bottom: 0,
                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity onPress={() => onUpdateCreateSchedule('post')} style={styles.scheduleButton}>

                            <Text style={[styles.text, {color: "#fff"}]} size={14}>Create Schedule</Text>

                        </TouchableOpacity>
                    </View>
                </View> : <></>

            }

        </View>
    )
}
