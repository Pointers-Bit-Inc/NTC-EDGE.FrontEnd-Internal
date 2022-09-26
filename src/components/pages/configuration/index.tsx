import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    ScrollView, StyleSheet,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import {isTablet} from "react-native-device-info";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React, {createRef, useCallback, useEffect, useMemo, useState} from "react";
import LeftSideWeb from "@atoms/left-side-web";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";
import RenderServiceMiscellaneous from "@pages/activities/application/renderServiceMiscellaneous2";
import {UploadIcon} from "@atoms/icon";
import {defaultColor, disabledColor, successColor, text} from "@styles/color";
import * as ImagePicker from "expo-image-picker";
import {BASE_URL} from "../../../services/config";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {
    setFee,
    setFeeFlatten,
    setFeeOriginalFlatten, setHasChangeFee,
    setRegion,
    setRegions
} from "../../../reducers/configuration/actions";
import RegionIcon from "@assets/svg/regionIcon";
import CloseIcon from "@assets/svg/close";
import lodash from "lodash";
import _ from "lodash";
import {isDiff, transformToFeePayload} from "../../../utils/ntc";
import parseSchedule from "@pages/schedule/parseSchedule";
import {validateText} from "../../../utils/form-validations";
import {useToast} from "../../../hooks/useToast";
import {ToastType} from "@atoms/toast/ToastProvider";
import RenderFeeConfiguration from "@pages/configuration/renderFeeConfiguration";
import Text from "@atoms/text"
import DebounceInput from "@atoms/debounceInput";
import {setUserProfileForm} from "../../../reducers/application/actions";
import {removeEmpty} from "@pages/activities/script";
import useMemoizedFn from "../../../hooks/useMemoizedFn";
import listEmpty from "@pages/activities/listEmpty";
import DropdownCard from "@organisms/dropdown-card";
const flatten = require('flat')
export default function ConfigurationPage(props: any) {
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
    useEffect(()=>{
        hasChanges()

    }, [feeFlatten])
    const hasChanges=()=> {
        var hasChanges=false;

        for (const [key, value] of Object.entries(feeOriginalFlatten)) {

            if (feeOriginalFlatten?.[key] != feeFlatten?.[key]) {

                hasChanges = true
                dispatch(setHasChangeFee(hasChanges))
                return
            }else{
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
            const _flatten = flatten.flatten({...{fees:response.data.fees}})
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
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string") ) {
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
        return isDiff(lodash.map(formValue, 'value'), lodash.map(originalForm, 'value'));
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
            const _flatten = flatten.flatten({...{fees:res?.data?.fees}})
            dispatch(setFee(res.data?.fees))
            dispatch(setFeeFlatten(_flatten))
            dispatch(setFeeOriginalFlatten(_flatten))
        }).catch((error) => {
            setLoading(false)
            let _err = '';
            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string") ) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data)
            }
        });
    }, [fee,feeFlatten])


    const applicantFeeForm = (stateName, value) => {

        let newForm = {...feeFlatten}
        newForm[stateName] = _.toNumber(value) || value
        dispatch(setFeeFlatten(Object.assign(feeFlatten, newForm)))
    }
    const listEmptyComponent = useMemoizedFn(() => listEmpty(!loading, "", fee.length ));

    return (
        <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
            <LeftSideWeb>
                <View style={styles.header}>
                    <Header title={"Configurations"}>
                        { !_.isEmpty(fee?.fees) ? (edit ?   <TouchableOpacity onPress={updateApplication}>
                                <Text>Save</Text>
                            </TouchableOpacity>  :
                            <TouchableOpacity onPress={() => {
                                setEdit(edit => !edit)

                            }}>
                                <Text>Edit</Text>
                            </TouchableOpacity>) : <></>
                        }

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
                                <DebounceInput value={value}
                                               minLength={3}
                                               inputRef={inputRef}
                                               onChangeText={setValue}
                                               delayTimeout={500}
                                               style={styles.search}/>
                                <View style={styles.searchIcon}>
                                    <SearchIcon/>
                                </View>
                            </View>


                        </View>


                    </View>

                </View>
                <View style={{flex: 1}}>
                    {loading ?
                        <View style={{padding: 20, justifyContent: "center", alignItems: "center"}}>
                            <ActivityIndicator/>
                        </View> : <></>}
                    <ScrollView>
                        { !_.isEmpty(fee?.fees) ?

                            <DropdownCard style={{margin: 10, borderWidth: 1, borderColor: defaultColor, borderRadius: 10,}} label={<>
                                <Text style={{ fontWeight: 'bold'}}   color={"#113196"}
                                      size={16}>Fees</Text>
                            </>}>
                                <RenderFeeConfiguration hasChanges={hasChanges}
                                                        updateApplication={updateApplication}
                                                        updateForm={applicantFeeForm}
                                                        userProfileForm={feeFlatten} search={value} edit={edit} service={fee.fees}/>
                            </DropdownCard> : <></>
                        }



                        {  !_.isEmpty(regionsMemo) ? <DropdownCard style={{margin: 10, borderWidth: 1, borderColor: defaultColor, borderRadius: 10,}} label={<>
                            <Text style={{ fontWeight: 'bold'}} color={"#113196"}
                                  size={16}>Other</Text>
                        </>}>
                            <FlatList

                                data={regionsMemo}
                                contentContainerStyle={{padding: 10,}}
                                renderItem={renderListItem}
                                keyExtractor={item => item._id}
                            />
                        </DropdownCard> : <></>}


                    </ScrollView>


                </View>
            </LeftSideWeb>
            {
                !(
                    (
                        isMobile && !(
                            Platform?.isPad || isTablet()))) && (!createRegion) && lodash.isEmpty(region) && dimensions?.width > 768 &&
                <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                    <NoActivity/>
                    <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                        selected</Text>


                </View>
            }
            {
                (!lodash.isEmpty(region) && Platform.OS == "web") ? <View style={[{flex: 1, backgroundColor: "#fff",}]}>

                    <Header size={24} title={"Region: " + region?.label || ""}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>


                    <View style={{
                        flex: 1,
                        flexDirection: "row"
                    }}>
                        <View style={{padding: 20, justifyContent: 'space-between', alignItems: 'center',}}>
                            <TouchableOpacity onPress={() => onPress('director')}>
                            <View style={styles.border}>
                                <Image resizeMode={"contain"}
                                       source={region?.configuration?.director?.signature || require('@assets/avatar.png')}
                                       style={{height: 200, width: 200}}/>
                            </View>

                                <View style={styles.uploadSignature}>
                                    <UploadIcon color={text.info}/>
                                    <Text>Director Signature</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{padding: 20, justifyContent: 'space-between', alignItems: 'center',}}>
                            <TouchableOpacity onPress={() => onPress('commissioner')}>
                                <View style={styles.border}>
                                    <Image resizeMode={"contain"}
                                           source={region?.configuration?.commissioner?.signature || require('@assets/avatar.png')}
                                           style={{height: 200, width: 200}}/>
                                </View>
                                <View style={styles.uploadSignature}>
                                    <UploadIcon color={text.info}/>
                                    <Text>Commissioner Signature</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                  {/*  <View style={{alignItems: "center"}}>
                        <TouchableOpacity onPress={() => onUpdateCreateRegion('patch')} disabled={!updateValid}
                                          style={{
                                              backgroundColor: updateValid ? successColor : disabledColor,
                                              paddingVertical: 10,
                                              paddingHorizontal: 20,
                                              borderRadius: 10
                                          }}>


                        </TouchableOpacity>
                    </View>*/}


                </View> : <></>
            }


            {(createRegion && lodash.isEmpty(region) && !isMobile) ?
                <View style={[{flex: 1, backgroundColor: "#fff",}]}>
                    <Header size={24} title={"Create Region"}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>

                    <View style={{
                        bottom: 0,
                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity onPress={() => onUpdateCreateRegion('post')} style={styles.scheduleButton}>

                            <Text style={[styles.text, {color: "#fff"}]} size={14}>Create Region</Text>

                        </TouchableOpacity>
                    </View>
                </View> : <></>

            }
        </View>
    )
}
