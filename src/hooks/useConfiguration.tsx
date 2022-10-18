import {TouchableOpacity, useWindowDimensions, View} from "react-native";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useToast} from "./useToast";
import {
    setCommissioner,
    setFee,
    setFeeFlatten,
    setFeeOriginalFlatten,
    setHasChangeFee,
    setRegion,
    setRegions
} from "../reducers/configuration/actions";
import axios, {CancelTokenSource} from "axios";
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
import useSafeState from "./useSafeState";

const flatten = require('flat')

function useConfiguration(props: any) {

    const cancelToken = useRef<CancelTokenSource>()
    const cancelConfigurationsToken = useRef<CancelTokenSource>()
    const cancelFeeToken = useRef<CancelTokenSource>()
    const dimensions = useWindowDimensions();
    const dispatch = useDispatch();
    const [value, setValue] = useState();
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const sessionToken = useSelector((state: RootStateOrAny) => state.user.sessionToken);
    const [createRegion, setCreateRegion] = useState(false)
    const fee = useSelector((state: RootStateOrAny) => state.configuration.fee);
    const commissioner = useSelector((state: RootStateOrAny) => state.configuration.commissioner);
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
    let config = {
        headers: {
            Authorization: "Bearer ".concat(sessionToken)
        }
    }
    const fetchFee = () => {
        if (typeof cancelFeeToken != typeof undefined) {
            cancelFeeToken.current?.cancel("Operation canceled due to new request.")

        }

        //Save the cancel token for the current request
        cancelFeeToken.current = axios.CancelToken.source()
        setLoading(true);
        axios.get(BASE_URL + "/fees", {
            ...{cancelToken: cancelFeeToken.current?.token},
            ...config
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
    const [commissionerOriginalForm, setCommissionerOriginalForm] = useSafeState([

        {
            stateName: 'configuration',
            stateNameMain: 'commissioner',
            subStateName: 'firstName',
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
            stateName: 'configuration',
            stateNameMain: 'commissioner',
            subStateName: 'middleName',
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
            stateName: 'configuration',
            stateNameMain: 'commissioner',
            subStateName: 'lastName',
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
            stateName: 'configuration',
            stateNameMain: 'commissioner',
            subStateName: 'email',
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
            stateName: 'configuration',
            stateNameMain: 'commissioner',
            subStateName: 'suffix',
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
            stateName: 'configuration',
            stateNameMain: 'commissioner',
            subStateName: 'signature',
            mime: "",
            tempBlob: "",
            file: "",
            mimeResult: "",
            _mimeType: "",
            id: 6,
            key: 6,
            containerStyle: {alignItems: "center",},
            style: {height: 200, width: 200, zIndex: 1, borderWidth: 1, borderStyle: "dotted"},
            type: "image",
            required: true,
            label: 'signature',
            placeholder: 'signature',
            value: '',
            error: false,
            description: false,
            hasValidation: true
        },
    ]);
    const [commissionerForm, setCommissionerForm] = useState(commissionerOriginalForm)

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

    const [uploadSignatureLoading, setUploadSignatureLoading] = useState(false)

    async function onPressSignature(stateName) {
        setUploadSignatureLoading(true)
        let picker = await ImagePicker.launchImageLibraryAsync({
            presentationStyle: 0
        });

        if (!picker.cancelled) {
            let uri = picker?.uri;
            let index = commissionerForm?.findIndex(app => app?.subStateName == stateName);

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
                let _userProfileFormElement = commissionerForm[index];
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

    const region = useSelector((state: RootStateOrAny) => state.configuration.region);
    const fetchConfigurations = () => {
        if (typeof cancelConfigurationsToken != typeof undefined) {
            cancelConfigurationsToken.current?.cancel("Operation canceled due to new request.")

        }

        //Save the cancel token for the current request
        cancelConfigurationsToken.current = axios.CancelToken.source()
        setLoading(true);
        axios.get(BASE_URL + "/regions?page=" + page, {
            ...{cancelToken: cancelConfigurationsToken.current?.token},
            ...config
        }).then((response) => {
            dispatch(setRegions(response.data))
            setLoading(false);
        }).catch((response) => {

            console.log(response.response)
        })
    }

    const fetchCommissioner = () => {
        if (typeof cancelToken != typeof undefined) {
            cancelToken.current?.cancel("Operation canceled due to new request.")

        }

        //Save the cancel token for the current request
        cancelToken.current = axios.CancelToken.source()
        setLoading(true);
        axios.get(BASE_URL + "/regions/commissioner", {
            ...{cancelToken: cancelToken.current?.token},
            ...config
        }).then((response) => {
            dispatch(setCommissioner(response.data))
            var _commissionerForm = [...commissionerForm]
            _commissionerForm.map((e, index) => {

                if (e.hasOwnProperty("stateNameMain") &&
                    e.hasOwnProperty("stateName") &&
                    e.hasOwnProperty("subStateName")) {
                    e.value = response.data[e.stateName][e.stateNameMain][e.subStateName]
                }
                return e
            });
            setCommissionerOriginalForm(JSON.parse(JSON.stringify(_commissionerForm)))
            setCommissionerForm(_commissionerForm)

            setLoading(false);
        }).catch((response) => {
            if (axios.isCancel(response)) {

                // setRefreshing(true)
                setLoading(false);
            }else {
                //  setRefreshing(false)
                setLoading(false);
            }
        })
    }
    const regionsMemo = useMemo(() => {
        return regions
    }, [regions])
    useEffect(() => {
        return fetchConfigurations()
    }, [])
    useEffect(() => {
        return fetchCommissioner()
    }, [])

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

        const index = commissionerForm?.findIndex(app => app?.id == id);
        let newArr = [...commissionerForm];
        newArr[index]['value'] = text;
        if (typeof text == "string") {
            newArr[index]['error'] = !validateText(text);
            newArr[index]['hasValidation'] = !validateText(text);
        }

        setCommissionerForm(newArr)
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
    const cleanForm = () => {
        let newArr = [...commissionerForm];
        commissionerForm.map((e, index) => {
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
        setCommissionerForm(newArr);
    };
    const [commissionerVisible, setCommissionerVisible] = useState(false)
    const listEmptyComponent = useMemoizedFn(() => listEmpty(!loading, "", fee.length));
    const onPressCommissioner = async (id?: number, type?: string | number) => {
        var updatedUser = {...commissioner, password: ""}, subStateName = {}, prevSubStateName = null;

        updatedUser._id = id
        let signatureIndex = commissionerForm?.findIndex(app => app?.subStateName == "signature");
        commissionerForm?.forEach(async (up) => {
            if (!up?.stateName) return
            if (!up.hasOwnProperty("stateNameMain") && up.hasOwnProperty("subStateName") && up.stateName != "role" && up.subStateName) {
                if (up.stateName != prevSubStateName) {
                    prevSubStateName = up.stateName
                    subStateName = {}
                }
                subStateName[up.subStateName] = up?.value
            } else if (up.stateNameMain) {
                if (prevSubStateName != up.stateNameMain) {
                    prevSubStateName = up.stateNameMain
                    subStateName = {}
                }
                subStateName[up.stateNameMain] = {
                    ...subStateName[up.stateNameMain],
                    [up.subStateName]: up?.value
                }
            }
            return updatedUser = {
                ...updatedUser,
                [up?.stateName]: ((up.stateNameMain || up.subStateName) && up.stateName != "role") ? {...subStateName} : up?.value
            };
        });

        setLoading(true);


        let _signature = commissionerForm[signatureIndex]
        let tempBlob = commissionerForm?.[signatureIndex]?.tempBlob


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

                    const API_URL = `${BASE_URL}/regions/${id}/commissioner/upload-signature`;

                    fetch(API_URL, {
                        method: 'POST', body: fd, headers: {
                            'Authorization': `Bearer ${sessionToken}`,
                        }
                    })
                        .then(res => {

                            return res?.json()
                        }).then(res => {
                        if (commissionerForm[signatureIndex].hasOwnProperty("value")) {
                            commissionerForm[signatureIndex]["value"] = res?.doc?.signature
                        }
                    })
                })
        }


        axios["patch"](BASE_URL + (`/regions/` + updatedUser?._id), updatedUser, config).then(async (response) => {
            showToast(ToastType.Success, updatedUser?._id ? "Successfully updated!" : "Successfully created!");
            setLoading(false);
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
            let newArr = [...commissionerForm];
            commissionerForm.map(e => {
                for (const error in _err?.response?.data?.errors) {

                    if (e.stateName?.toLowerCase() == error?.toLowerCase() ||
                        `${e.stateName?.toLowerCase()}.${e.subStateName?.toLowerCase()}` == error?.toLowerCase() ||
                        `${e.stateName?.toLowerCase()}.${e.stateNameMain?.toLowerCase()}.${e.subStateName?.toLowerCase()}` == error?.toLowerCase()) {
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


        });
    };
    const commissionUpdateValid = useMemo(() => {
        return isDiff(_.map(commissionerForm, 'value'), _.map(commissionerOriginalForm, 'value'));
    }, [commissionerForm, commissionerOriginalForm])
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
        applicantFeeForm,
        commissioner,
        commissionerVisible,
        setCommissionerVisible,
        commissionerOriginalForm,
        commissionerForm,
        onUpdateForm,
        onPressSignature,
        onPressCommissioner,
        updateValid,
        commissionUpdateValid
    };
}


export default useConfiguration
