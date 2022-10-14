import {Animated, TouchableOpacity, useWindowDimensions, View} from "react-native";
import useModalAnimation from "./useModalAnimation";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    setAddSchedule,
    setDeleteSchedule,
    setEditSchedule,
    setSchedule,
    setSchedules
} from "../reducers/schedule/actions";
import {isDiff, regionList} from "../utils/ntc";
import {validateText} from "../utils/form-validations";
import axios from "axios";
import {BASE_URL} from "../services/config";
import {useToast} from "./useToast";
import {ToastType} from "@atoms/toast/ToastProvider";
import parseSchedule from "@pages/schedule/parseSchedule";
import {isMobile} from "@pages/activities/isMobile";
import {styles} from "@pages/activities/styles";
import RegionIcon from "@assets/svg/regionIcon";
import Text from "@atoms/text";
import VenueIcon from "@assets/svg/venueicon";
import CalendarDateIcon from "@assets/svg/calendarIcon";
import moment from "moment";
import ClockIcon from "@assets/svg/clockicon";
import useMemoizedFn from "./useMemoizedFn";
import listEmpty from "@pages/activities/listEmpty";
import _ from "lodash";
import CloseIcon from "@assets/svg/close";

function useSchedule(props: any) {
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
    const [scheduleId, setScheduleId] = useState()
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    function onClose() {
        dispatch(setSchedule({}))
        setCreateSchedule(false)
        if (props.navigation.canGoBack()) props.navigation.goBack()
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
            value: "",
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
        },

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
        console.log(valid)
        return valid;
    };

    const {showToast} = useToast();

    function onUpdateCreateSchedule(method = "post") {

        if (!isValid()) return
        axios[method == "post" ? 'post' : 'patch'](BASE_URL + "/schedules" + (method == "post" ? "" : "/" + schedule.id), _(formValue).map(v => [v.stateName, v.value]).fromPairs().value(), config).then((res) => {

            if (method == "patch") {
                dispatch(setEditSchedule(res.data.doc))
            } else if (method == "post") {
                dispatch(setAddSchedule(res.data))
            }
            onClose()

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

    const onDelete = (id) => {
        axios.delete(BASE_URL + "/schedules/" + id, config).then(() => {
            showToast(ToastType.Success, "Success! ")
            onClose()
            dispatch(setDeleteSchedule(id))
        }).catch((error) => {
            setLoading(false)
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
            let _date = date?.toISOString()?.split?.("T")
            if(_date && formValue?.[3]?.value){
                _date[1] = formValue?.[3]?.value?.split?.("T")?.[1]
            }
            onUpdateForm(4, _date?.join("T") || null, '', 'dateEnd')
        } else {
            let _date = date?.toISOString()?.split?.("T")
            if(_date && formValue?.[2]?.value){
                _date[1] = formValue?.[2]?.value?.split?.("T")?.[1]
            }
            onUpdateForm(4, _date?.join("T") || null, '', 'dateEnd')
            onUpdateForm(3, _date?.join("T") || null, '', 'dateStart')
        }
    }


    const onItemPress = useCallback((item) => {

        dispatch(setSchedule(item))
        let _originalForm = [...JSON.parse(JSON.stringify(originalForm))]
        parseSchedule(_originalForm, item)
        setFormValue(_originalForm)


        if (isMobile) {
            props.navigation.push("EditScheduleScreen")
        }

    }, [formValue])
    const updateValid = useMemo(() => {
        return isDiff(_.map(formValue, 'value'), _.map(originalForm, 'value'));
    }, [formValue, originalForm])
    const renderListItem = ({item}) => {
        return <TouchableOpacity onPress={() => {
            if (!isMobile) {
                let _originalForm = [...JSON.parse(JSON.stringify(originalForm))]
                parseSchedule(_originalForm, item);
                setOriginalForm(_originalForm)
            }
            onItemPress(item)

        }}><View style={[
            styles?.scheduleContainer,
        ]}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <View style={{flex: 0.95}}>
                    <View style={styles?.scheduleRow}>
                        <RegionIcon color={"#000"}/>
                        <Text style={styles?.scheduleText}>{item?.region?.label}</Text>
                    </View>
                    <View style={styles?.scheduleInnerSeparator}/>
                    <View style={styles?.scheduleRow}>
                        <VenueIcon color={"#000"}/>
                        <Text style={styles?.scheduleText}>{item.venue}</Text>
                    </View>
                    <View style={styles?.scheduleInnerSeparator}/>
                    <View style={styles?.scheduleRow}>
                        <View style={[styles?.scheduleRow, {flex: 1}]}>
                            <CalendarDateIcon width={24} height={24}/>
                            <Text
                                style={styles?.scheduleText}>{moment(item?.dateStart).format('ddd DD MMMM YYYY')}</Text>
                        </View>
                        <View style={styles?.scheduleInnerSeparator}/>
                        <View style={[styles?.scheduleRow, {flex: 1}]}>
                            <ClockIcon/>
                            <Text style={styles?.scheduleText}>{moment(item?.dateStart).format('LT')} - {moment(item?.dateEnd).format('LT')}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex: 0.05}}>
                    <TouchableOpacity onPress={() => {
                        setScheduleId(item.id)
                        setShowDeleteAlert(true)
                    }}>
                        <CloseIcon/>
                    </TouchableOpacity>
                </View>

            </View>


        </View>
        </TouchableOpacity>
    }
    const schedulesMemo = useMemo(() => {
        return schedules
    }, [schedules])
    const listEmptyComponent = useMemoizedFn(() => listEmpty(loading, "", schedules.length));
    return {
        dimensions,
        animation,
        background,
        display,
        success,
        dispatch,
        schedule,
        value,
        setValue,
        createSchedule,
        setCreateSchedule,
        onClose,
        formValue,
        setFormValue,
        onUpdateForm,
        handleStartPress,
        handleEndPress,
        onUpdateCreateSchedule,
        onDateChange,
        updateValid,
        renderListItem,
        schedulesMemo,
        listEmptyComponent,
        originalForm,
        setOriginalForm,
        onItemPress,
        showDeleteAlert,
        setShowDeleteAlert,
        onDelete,
        scheduleId
    };
}

export default useSchedule
