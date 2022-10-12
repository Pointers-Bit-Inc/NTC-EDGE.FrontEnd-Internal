import {TouchableOpacity, useWindowDimensions, View} from "react-native";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import React, {createRef, useCallback, useEffect, useMemo, useState} from "react";
import {useToast} from "./useToast";
import {
    setFee,
    setFeeFlatten,
    setFeeOriginalFlatten,
    setHasChangeFee, setRegion,
    setRegions
} from "../reducers/configuration/actions";
import axios from "axios";
import {BASE_URL} from "../services/config";
import {ToastType} from "@atoms/toast/ToastProvider";
import * as ImagePicker from "expo-image-picker";
import {isMobile} from "@pages/activities/isMobile";
import parseSchedule from "@pages/schedule/parseSchedule";
import {styles} from "@pages/activities/styles";
import RegionIcon from "@assets/svg/regionIcon";
import Text from "@atoms/text";
import CloseIcon from "@assets/svg/close";
import {isDiff} from "../utils/ntc";
import {validateText} from "../utils/form-validations";
import useMemoizedFn from "./useMemoizedFn";
import listEmpty from "@pages/activities/listEmpty";
import _ from "lodash"
const flatten = require('flat')
function useConfiguration(props: any) {
    const dimensions = useWindowDimensions();
    const dispatch = useDispatch();
    const [value, setValue] = useState();
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const sessionToken = useSelector((state: RootStateOrAny) => state.user.sessionToken);
    const [createRegion, setCreateRegion] = useState(false)
    const fee = useSelector((state: RootStateOrAny) => state.configuration.fee);
    const {showToast, hideToast} = useToast();
    const feeFlatten = useSelector((state: RootStateOrAny) => state.configuration.feeFlatten);
    const feeOriginalFlatten = useSelector((state: RootStateOrAny) => state.configuration.feeOriginalFlatten);
    useEffect(() => {
        hasChanges()

    }, [feeFlatten])
    const hasChanges = () => {
        var hasChanges = false;

        for (const [key, value] of Object.entries(feeOriginalFlatten)) {

            if (feeOriginalFlatten?.[key] != feeFlatten?.[key]) {

                hasChanges = true
                dispatch(setHasChangeFee(hasChanges))
                return
            } else {
                hasChanges = false
                dispatch(setHasChangeFee(hasChanges))
            }
        }
    }
    useEffect(() => {
        return fetchFee()
    }, [_.isEmpty(fee)])
    const fetchFee = () => {
        setLoading(true);
        axios.get(BASE_URL + "/fees", {
            headers: {
                Authorization: "Bearer ".concat(sessionToken)
            }
        }).then((response) => {
            const _flatten = flatten.flatten({...{fees: response.data.fees}})
            dispatch(setFee(response.data))
            dispatch(setFeeFlatten(_flatten))
            dispatch(setFeeOriginalFlatten(_flatten))
            setLoading(false);

        }).catch((error) => {
            setLoading(false)
            let _err = '';
            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string")) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data)
            }
        });
    }
    const [originalForm, setOriginalForm] = useState([
        {
            id: 1,
            stateName: "commissioner",
            label: 'Commissioner',
            value: "",
            error: false,
            type: '',
        },
        {
            id: 1,
            stateName: "director",
            label: 'Director',
            value: "",
            error: false,
            type: '',
        },
    ]);

    async function onPress(position) {
        let picker = await ImagePicker.launchImageLibraryAsync({
            presentationStyle: 0
        });
        if (!picker.cancelled) {

            let uri = picker?.uri;
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

            await fetch(base64)
                .then(res => {

                    return res?.blob()
                })
                .then(blob => {

                    const fd = new FormData();
                    const file = isMobile ? {
                        name: _file?.name,
                        type: 'application/octet-stream',
                        uri: _file?.uri,
                    } : new File([blob], (
                        _file?.name + "." + _mimeType || _file?.mimeType));

                    fd.append('profilePicture', file, (
                        _file?.name + "." + _mimeType || _file?.mimeType));

                    const API_URL = `${BASE_URL}/regions/${region?._id}/${position}/upload-signature`;

                    fetch(API_URL, {
                        method: 'POST', body: fd, headers: {
                            'Authorization': `Bearer ${sessionToken}`,
                        }
                    })
                        .then(res => {
                            onClose()
                            return res?.json()
                        })
                })
        }
    }

    const [formValue, setFormValue] = useState(originalForm);
    const regions = useSelector((state: RootStateOrAny) => state.configuration.regions);
    let config = {
        headers: {
            Authorization: "Bearer ".concat(sessionToken)
        }
    }
    const region = useSelector((state: RootStateOrAny) => state.configuration.region);
    const fetchConfigurations = () => {
        setLoading(true);
        axios.get(BASE_URL + "/regions?page=" + page, config).then((response) => {
            dispatch(setRegions(response.data))
            setLoading(false);
        }).catch((response) => {

            console.log(response.response)
        })
    }
    const fetchCommissioner = () => {
        setLoading(true);
        axios.get(BASE_URL + "/regions/commissioner", config).then((response) => {
            dispatch(setRegions(response.data))
            setLoading(false);
        }).catch((response) => {

            console.log(response.response)
        })
    }
    const regionsMemo = useMemo(() => {
        return regions
    }, [regions])

    useEffect(() => {
        return fetchConfigurations()
    }, [regions.length == 0])

    function onDelete(id) {

    }

    const onItemPress = useCallback((item) => {
        dispatch(setRegion(item))
        let _originalForm = [...JSON.parse(JSON.stringify(originalForm))]
        parseSchedule(_originalForm, item)
        setFormValue(_originalForm)


        if (isMobile) {
            props.navigation.push("EditConfigurationScreen")
        }

    }, [region])
    const renderListItem = ({item}) => {
        return <TouchableOpacity onPress={() => {
            if (!isMobile) {
                let _originalForm = [...JSON.parse(JSON.stringify(originalForm))]
                parseSchedule(_originalForm, item);
                setOriginalForm(_originalForm)
            }
            console.log(item)
            onItemPress(item)

        }}><View style={[
            styles?.scheduleContainer,
        ]}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <View style={{flex: 0.95}}>
                    <View style={styles?.scheduleRow}>
                        <RegionIcon color={"#000"}/>
                        <Text style={styles?.scheduleText}>{item?.label}</Text>
                    </View>
                </View>
                <View style={{flex: 0.05}}>
                    <TouchableOpacity onPress={() => onDelete(item.id)}>
                        <CloseIcon/>
                    </TouchableOpacity>
                </View>

            </View>


        </View>
        </TouchableOpacity>
    }


    function onUpdateCreateRegion(post: string) {

    }


    const updateValid = useMemo(() => {
        return isDiff(_.map(formValue, 'value'), _.map(originalForm, 'value'));
    }, [formValue, originalForm])

    const onUpdateForm = (id: number, text: any, element?: string, _key?: string) => {

        const index = formValue?.findIndex(app => app?.id == id);
        let newArr = [...formValue];
        newArr[index]['value'] = text;
        if (typeof text == "string") {
            newArr[index]['error'] = !validateText(text);
        }

        setFormValue(newArr)
    };
    const inputRef = createRef();
    const onClose = () => {
        setCreateRegion(false)
        dispatch(setRegion({}))
        if (props.navigation.canGoBack()) props.navigation.goBack()
    };

    const [edit, setEdit] = useState(false)
    const updateApplication = useCallback(async () => {
        let feesPayload = JSON.parse(JSON.stringify(feeFlatten))
        let feePayload = flatten.unflatten(feesPayload)
        setLoading(true);
        await axios.patch(BASE_URL + "/fees/" + fee?.id, {
            ...fee,
            ...feePayload
        }, config).then(res => {
            setLoading(false);
            setEdit(false)
            const _flatten = flatten.flatten({...{fees: res?.data?.fees}})
            dispatch(setFee(res.data?.fees))
            dispatch(setFeeFlatten(_flatten))
            dispatch(setFeeOriginalFlatten(_flatten))
        }).catch((error) => {
            setLoading(false)
            let _err = '';
            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string")) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data)
            }
        });
    }, [fee, feeFlatten])


    const applicantFeeForm = (stateName, value) => {

        let newForm = {...feeFlatten}
        newForm[stateName] = _.toNumber(value) || value || 0
        dispatch(setFeeFlatten(Object.assign(feeFlatten, newForm)))
    }
    const listEmptyComponent = useMemoizedFn(() => listEmpty(!loading, "", fee.length));
    return {
        dimensions,
        value,
        setValue,
        loading,
        createRegion,
        fee,
        feeFlatten,
        hasChanges,
        onPress,
        region,
        regionsMemo,
        renderListItem,
        onUpdateCreateRegion,
        inputRef,
        onClose,
        edit,
        setEdit,
        updateApplication,
        applicantFeeForm
    };
}


export default useConfiguration
