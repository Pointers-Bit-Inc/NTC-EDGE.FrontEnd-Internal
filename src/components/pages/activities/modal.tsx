import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    ActivityIndicator,
    Alert as RNAlert,
    Animated,
    BackHandler,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import Alert from '@atoms/alert';
import {infoColor, primaryColor} from "@styles/color";
import Disapproval from "@pages/activities/modal/disapproval";
import Endorsed from "@pages/activities/modal/endorse";
import Approval from "@pages/activities/modal/approval";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {getRole, PaymentStatusText, removeEmpty, StatusText} from "@pages/activities/script";
import {
    ACCOUNTANT, ADMIN,
    APPROVED,
    CASHIER,
    DECLINED,
    DIRECTOR,
    EVALUATOR,
    FORAPPROVAL,
    FOREVALUATION,
    PAID,
    UNVERIFIED,
    VERIFIED,
} from "../../../reducers/activity/initialstate";
import Api from 'src/services/api';
import {
    setApplicationItem, setApplicationModalGoBack, setDecrementRealtimeCount, setDeletePinnedApplication,
    setEdit,
    setHasChange, setModalVisible,
    setRightLayoutComponent, setSceneIndex,
    setUserOriginalProfileForm,
    setUserProfileForm,
    updateApplicationStatus,
    updateChangeEvent
} from "../../../reducers/application/actions";

import CustomAlert from "@pages/activities/alert/alert1";
import CloseIcon from "@assets/svg/close";
import {ApprovedButton} from "@pages/activities/button/approvedButton";
import {DeclineButton} from "@pages/activities/button/declineButton";
import {EndorsedButton} from "@pages/activities/button/endorsedButton";
import {Bold, Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import {useComponentLayout} from "../../../hooks/useComponentLayout";
import ModalTab from "@pages/activities/modalTab/modalTab";
import {isLandscapeSync, isTablet} from "react-native-device-info";
import {Toast} from "@atoms/toast/Toast";
import axios from "axios";
import useSafeState from "../../../hooks/useSafeState";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {BASE_URL} from "../../../services/config";
import {transformToFeePayload} from "../../../utils/ntc";
import {useToast} from "../../../hooks/useToast";
import {ToastType} from "@atoms/toast/ToastProvider";
import ChevronLeft from "@assets/svg/chevron-left";
import _ from "lodash";
import {setFeedVisible, setUpdateIncrement} from "../../../reducers/activity/actions";
import {setAmnesty} from "../../../reducers/soa/actions";
import {SceneMap, TabView} from "react-native-tab-view";
import ServiceFormPage from "@pages/form";
import Bottom from "@atoms/button/bottom";

const flatten = require('flat')


function ActivityModal(props: any) {

    const _props = useMemo(() => (Platform.OS == "web"  ? props : props?.route?.params), [props])
    const dispatch = useDispatch();

    const applicationItem = useSelector((state: RootStateOrAny) => {
        let _applicationItem = state.application?.applicationItem
       /* for (let i = 0; i < _applicationItem?.service?.stationClass?.length; i++) {

            let _split = _applicationItem?.service?.stationClass[i]?.stationClass?.split(" • ")
            if (_split?.length == 2) {
                _applicationItem.service.stationClass[i].stationClass = _split[0]
                _applicationItem.service.stationClass[i].unit = _split[1]
            }

        }
*/

        return _applicationItem
    });


    const sceneIndex = useSelector((state: RootStateOrAny) => {
        return state.application.sceneIndex
    });
    const userProfileForm = useSelector((state: RootStateOrAny) => {
        return state.application.userProfileForm
    });
    const amnesty = useSelector((state: RootStateOrAny) => {
        return state.soa.amnesty
    });
    const tabName = useSelector((state: RootStateOrAny) => {
        return state.activity.tabName
    });

    const updateIncrement = useSelector((state: RootStateOrAny) => {
        return state.activity.updateIncrement
    });
    const userOriginalProfileForm = useSelector((state: RootStateOrAny) => {
        return state.application.userOriginalProfileForm
    });
    const applicationModalGoBack = useSelector((state: RootStateOrAny) => {
        return state.application.applicationModalGoBack
    });
    const hasChange = useSelector((state: RootStateOrAny) => state.application.hasChange);
    const edit = useSelector((state: RootStateOrAny) => state.application.edit);

    const navigation = useNavigation();

    const dimensions = useWindowDimensions();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [change, setChange] = useState<boolean>(false);
    const cashier = [CASHIER].indexOf(user?.role?.key) != -1;
    const [visible, setVisible] = useState(false);
    const [endorseVisible, setEndorseVisible] = useState(false);
    const [approveVisible, setApproveVisible] = useState(false);
    const [checkNumber, setCheckNumber] = useState("");
    const [status, setStatus] = useState("");
    const [prevBankName, setPrevBankName] = useState("");
    const [bankName, setBankName] = useState("");
    const [prevCheckNumber, setPrevCheckNumber] = useState("");
    const [prevStatus, setPrevStatus] = useState("");
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [currentLoading, setCurrentLoading] = useState('');
    const [assignId, setAssignId] = useState("");
    const [remarks, setRemarks] = useState("");
    const [prevRemarks, setPrevRemarks] = useState("");
    const [prevAssignId, setPrevAssignId] = useState("");
    const [grayedOut, setGrayedOut] = useState(false);
    const [showAlert1, setShowAlert1] = useState(false)
    const [showAlert2, setShowAlert2] = useState(false)
    const editModalVisible = useSelector((state: RootStateOrAny) => state.activity.editModalVisible);
    const editMemo = useMemo(()=>{
        return edit
    }, [edit])
    const onDismissed = () => {
        setVisible(false)
    };
    const onEndorseDismissed = () => {
        setEndorseVisible(false)
    };
    const onApproveDismissed = () => {
        setApproveVisible(false)
    };
    const onChangeApplicationStatus = async (status: string, callback = (err: any, appId?: any) => {
    }, event) => {
        setGrayedOut(true);
        const api = Api(user.sessionToken, user.createdAt);
        const applicationId = applicationItem?._id;
        let url = `/applications/${applicationId}/update-status`;
        let params: any = {
            status,
            remarks: user?.role?.key == CASHIER ? "" : event.remarks ? event.remarks : remarks,
            assignedPersonnel: event.cashier ? event.cashier : assignId,
        };
        let AddORNoparams: any =
            {
                bankName: event?.bankName ? event?.bankName : "",
                checkNumber: event?.checkNumber ? event?.checkNumber : "",
                orNumber: event.remarks ? event.remarks : remarks,
                orBy: event.cashier ? event.cashier : assignId,
            }

        setCurrentLoading(status);
        if (status == DECLINED) {
            setAssignId("")
        }
        if (user?.role?.key == ACCOUNTANT) {
            const assignUserId = status == DECLINED && applicationItem?.approvalHistory?.[0]?.status == FORAPPROVAL && applicationItem?.approvalHistory?.[0]?.userId != user?._id;
            assignUserId ? setAssignId(applicationItem?.approvalHistory?.[0].userId) : (
                assignId ? assignId : undefined);
            params = {
                status: (
                    assignUserId) ? FOREVALUATION : status,
                assignedPersonnel: assignUserId ? applicationItem?.approvalHistory?.[0].userId : (
                    assignId ? assignId : undefined),
                remarks: event.remarks ? event.remarks : remarks,
            };
        }
        if (user?.role?.key == CASHIER) {
            url = `/applications/${applicationId}/update-payment-status`;
            params = {
                paymentStatus: status,
                //remarks: event.remarks ? event.remarks : remarks,
            };
        }
        if (applicationItem?.service?.serviceCode === "service-22") {
            delete params.assignedPersonnel
        }
        const addORNumber = user?.role?.key == CASHIER ? await api.post(`/applications/${applicationId}/add-or-number`, AddORNoparams)
            .catch(e => {
                // setGrayedOut(false);
                setCurrentLoading('');
                let _err = '';
                for (const err in e?.response?.data?.errors) {
                    _err += e?.response?.data?.errors?.[err]?.toString() + "\n";
                }
                if (_err || e?.response?.data?.message || e?.response?.statusText || (typeof e?.response?.data == "string") ) {
                    showToast(ToastType.Error, _err || e?.response?.data?.message || e?.response?.statusText || e?.response?.data)
                }
                return callback(e);
            }) : null
        if ((applicationId && (user?.role?.key == CASHIER && addORNumber?.status == 200)) || (getRole(user, [DIRECTOR, EVALUATOR, ACCOUNTANT]) && applicationId)) {
            await api.patch(url, {...params})
                .then(res => {
                    setGrayedOut(false);
                    setCurrentLoading('');
                    if (res.status === 200) {
                        if (res.data) {
                            const data = res.data?.doc || res?.data;
                            if(data?.region?.code){
                                data.region = data?.region?.code ? data?.region?.code :  data?.region
                            }

                            dispatch(updateApplicationStatus({
                                application: data,
                                status: status,
                                assignedPersonnel: data?.assignedPersonnel?._id || data?.assignedPersonnel,
                                userType: user?.role?.key
                            }));
                            _props.onChangeAssignedId(data);
                            //setStatus(cashier ? PaymentStatusText(status) : StatusText(status))
                            setChange(true);
                            dispatch(setFeedVisible(true))
                            // props.onDismissed(true, applicationId)
                            return callback(null, applicationId);
                        }
                    }
                    RNAlert.alert('Alert', 'Something went wrong.');
                    return callback('error');
                })
                .catch(e => {
                    setGrayedOut(false);
                    setCurrentLoading('');
                    let _err = '';
                    for (const err in e?.response?.data?.errors) {
                        _err += e?.response?.data?.errors?.[err]?.toString() + "\n";
                    }
                    if (_err || e?.response?.data?.message || e?.response?.statusText || (typeof e?.response?.data == "string") ) {
                        showToast(ToastType.Error, _err || e?.response?.data?.message || e?.response?.statusText || e?.response?.data)
                    }
                    return callback(e);
                })
        }
    };

    const hasChanges = (bool: boolean) => {

        dispatch(setHasChange(bool))
    }

    const [prevId, setPrevId] = useSafeState(0)
    useEffect(() => {

        dispatch(setUserProfileForm(flatten.flatten(applicationItem)))
        dispatch(setUserOriginalProfileForm(flatten.flatten(applicationItem)))
        dispatch(setEdit(false))
        /* console.log(prevId != applicationItem._id, prevId , applicationItem._id)
         if(prevId != applicationItem._id){
             setPrevId(applicationItem._id)
             dispatch(setHasChange(false)
             setEdit(false)
         }
 */

       /* new Promise((resolve, reject) => {
            setTimeout(() => {


                resolve() // when this fires, .then gets called

            }, 3000)
        }).then(() => {
            dispatch(setApplicationItem({}, applicationItem?._id));
            dispatch(setModalVisible(false, applicationItem?._id))


        })*/
        return () => {
            setChange(false);
            setStatus("");
            setAssignId("")

        }
    }, [applicationItem._id,]);
    const statusMemo = useMemo(() => {
        setStatus(status);
        setAssignId(assignId || (
            applicationItem?.assignedPersonnel?._id || applicationItem?.assignedPersonnel));
        return status ? (
            cashier ? PaymentStatusText(status) : StatusText(status)) : (
            cashier ? PaymentStatusText(applicationItem.paymentStatus) : StatusText(applicationItem.status))
    }, [assignId, status, (
        applicationItem?.assignedPersonnel?._id || applicationItem?.assignedPersonnel), applicationItem.paymentStatus, applicationItem._id, applicationItem.status]);
    const approveButton = statusMemo === APPROVED || statusMemo === VERIFIED;
    const declineButton = cashier ? (statusMemo === UNVERIFIED || statusMemo === DECLINED) : statusMemo === DECLINED;

    const [loading, setLoading] = useSafeState(false)
    const [saved, setSaved] = useSafeState(false)
    const allButton = (
        cashier) ? (
        !!applicationItem?.paymentMethod ? (
            ((applicationItem?.assignedPersonnel?.role != user?.role?.key) ) ? true : (
                declineButton || approveButton || grayedOut)) : true) : (
        ((applicationItem?.assignedPersonnel?.role != user?.role?.key) )  ? true : (
            declineButton || approveButton || grayedOut));
    const [alertLoading, setAlertLoading] = useState(false);
    const [approvalIcon, setApprovalIcon] = useState(false);
    const [title, setTitle] = useState("Approve Application");
    const [showClose, setShowClose] = useState(false);

    const [activityModalScreenComponent, onActivityModalScreenComponent] = useComponentLayout();
    useEffect(() => {
        dispatch(setRightLayoutComponent(activityModalScreenComponent))
    }, [activityModalScreenComponent]);
    const hitSlop = {top: 100, left: 100, bottom: 100, right: 100}
    const [discardAlert, setDiscardAlert] = useSafeState(false);
    const [editAlert, setEditAlert] = useSafeState(false);
    const handleBackButtonClick = () => {
        if (hasChange) setDiscardAlert(true);
        else {
            setAssignId("");
            goBackAsync()

            setChange(false)
            return true;
        }
    };
    const routeIsFocused = navigation?.isFocused();


    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // Do Whatever you want to do on back button click
                // Return true to stop default back navigaton
                // Return false to keep default back navigaton
                return true;
            };

            BackHandler.addEventListener(
                'hardwareBackPress', handleBackButtonClick
            );

            return () =>
                BackHandler.removeEventListener(
                    'hardwareBackPress', handleBackButtonClick
                );
        }, [])
    );

    const editBtn = (editBtn) => {
        console.log("editBtn")
        if (hasChange) setEditAlert(true);
        else {

            let _edit = edit
            dispatch(setEdit(!_edit))
        }
    }
    const {showToast, hideToast} = useToast();
    const [messageUpdate, setMessageUpdate] = useSafeState("")
    const [titleUpdate, setTitleUpdate] = useSafeState("")
    const soa = useSelector((state: RootStateOrAny) => state.soa?.soa);


    const updateApplication =(async (callback, isLoading = true) => {
        /* hideToast()
         showToast(ToastType.Info, <ToastLoading/>)*/
        if (isLoading) setLoading(true)
        if (isLoading) setSaved(true)

        let profileForm = JSON.parse(JSON.stringify(userProfileForm))


        let dateOfBirth = profileForm?.['applicant.dateOfBirth'], region = profileForm?.['region.code'],
            dateValue = {year: "", month: "", day: ""}
        if (typeof dateOfBirth == 'string' && dateOfBirth) {
            let dateOfBirthSplit = dateOfBirth?.split('-')
            dateValue.year = dateOfBirthSplit[0]
            dateValue.month = dateOfBirthSplit[1]
            dateValue.day = dateOfBirthSplit[2]
            profileForm['applicant.dateOfBirth'] = dateValue
        }
        if (region) {
            profileForm['region'] = region
        }
        let _service = {
            service: {
                stationClass: []
            }
        }
        let serviceStationClass = flatten.unflatten(profileForm)?.service?.stationClass
        for (let i = 0; i < serviceStationClass?.length; i++) {

            let _obj = serviceStationClass[i]

            _service.service.stationClass.push({"stationClass": _obj?.stationClass + " • " + _obj.unit})

        }
        // /^soa.+(?:\[\d+])?(?:\.\w+(?:\[\d+])?)*$/;
        let pattern = /^soa\.\d+\.\w+$/
        let cleanSoa = {}
        for (const [key, value] of Object.entries(profileForm)) {
            if (key.match(pattern)) {
                cleanSoa = {...cleanSoa, ...{[key]: value}}
            }
        }

        let config = {
            headers: {
                Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: user?.createdAt
            }
        }
        let payload:any = {
            "id": "string",
            "service": "string",
            "subService": "string",
            "types": "string",
            "frequency": "string",
            "station": 0,
            "location": "string",
            "bandwidth": {
                "bandwidth": 0,
                "unit": "string"
            },
            "mode": "string",
            "spectrum": "string",
            "channels": 0,
            "transmission": "string",
            "boundary": "string",
            "installedEquipment": "string",
            "units": 0,
            "category": "string",
            "power": 0,
            "noOfYears": 0,
            "updatedAt": "2022-08-14T07:53:36.858Z",
            "dateOfExpiry": "2022-08-14T07:53:36.858Z",
            "discount": parseFloat(amnesty) || 0,
            "numberOfPermitsOrCertsOrApp": 0,
            "classes": "string",
            "fixed": 0,
            "landBase": 0,
            "publicTrunked": 0,
            "terrestrialCommunication": 0,
            "landMobile": 0,
            "portable": 0,
            "repeater": 0,
            "invoice": 0,
            "nOs": 0,
            "stationCount": 0,
            "stationClassChannels": {
                "fx": 0,
                "fb": 0,
                "publicTrunked": 0,
                "tc": 0,
                "ml": 0,
                "p": 0,
                "rt": 0
            },
            "stationClassUnits": {
                "fx": 0,
                "fb": 0,
                "publicTrunked": 0,
                "tc": 0,
                "ml": 0,
                "p": 0,
                "rt": 0
            }
        }
            if(!payload?.discount) {
                delete payload?.discount
            }
        const _flattenSoa = removeEmpty(flatten.unflatten(cleanSoa))?.soa?.filter(v => v?.item || v?.amount);

            let feePayload = removeEmpty(transformToFeePayload(flatten.unflatten(profileForm)))
        await axios.post(BASE_URL + "/applications/calculate-total-fee", {
            ...payload,
            ...feePayload
        }, config)
            .then((response) => {
                if (isLoading)setLoading(false)
                const diff =  _.differenceBy(_flattenSoa, (response.data?.statement_Of_Account || response.data?.soa),  'item')
                let arr2 = (response.data?.statement_Of_Account || response.data?.soa)
                let arr1 = _flattenSoa ? removeEmpty( _flattenSoa?.filter(v => v?.item || v?.amount)) : []
                let unionWith = _.unionWith(arr1 || [], arr2, (a, b) => a?.item == b?.item && a?.amount == b?.amount);
                let exclude = [];

                for (let i = 0; i < unionWith?.length; i++) {
                    let ubItem = unionWith[i]?.item
                    let ubAmount = unionWith[i]?.amount
                    for (let j = 0; j < arr2.length; j++) {
                        if((arr2?.[j]?.item == ubItem && arr2?.[j]?.amount == ubAmount)){
                            if(unionWith?.[i]){
                                exclude.push(unionWith?.[i])
                            }
                        }
                    }
                }



                for (let b = 0; b < arr1.length; b++) {
                    for (let a = 0; a < exclude.length; a++) {
                        if(!(arr1?.[b]?.item == exclude?.[a]?.item) &&  (['add', 'edit'].indexOf(arr1?.[b]?.type) > -1) ){
                            exclude.splice(b, 1)
                        }
                    }
                }




                const unionBy = arr1.length > 0 ? _.unionBy(arr1, exclude, "item"): [];



                cleanSoa = {
                    //  totalFee: response.data?.totalFee + diff.reduce((partialSum, a) => partialSum + (isNumber(parseFloat(a.amount)) ? parseFloat(a.amount) : 0), 0),
                    amnestyTotalFee: response.data?.totalFee,
                    totalFee: response.data?.totalFee,
                    soa: unionBy?.filter((s) => s?.type != "delete")
                }



            }).catch((error) => {
                dispatch(setEdit(false))
                dispatch(setHasChange(false))
                if (isLoading)setLoading(false)
                let _err = '';
                for (const err in error?.response?.data?.errors) {
                    _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
                }
                if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string" || typeof error == "string") ) {
                    showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data || error)
                }
            });
        //if (flattenSoa) profileForm['totalFee'] = flattenSoa.reduce((partialSum, a) => partialSum + (isNumber(parseFloat(a.amount)) ? parseFloat(a.amount) : 0), 0)
        //console.log({...flatten.unflatten(profileForm), ...{soa: flattenSoa}})
        let findValidity = _flattenSoa?.find((fee)=>{
            return fee?.item == 'Validity'
        })

        if( tabName == "SOA & Payment" && findValidity?.amount >= 0 && !!findValidity){
            if(profileForm?.['service.applicationParticulars.noOfYears']>= 0){
                profileForm['service.applicationParticulars.noOfYears'] = findValidity?.amount?.toString()

            }
            if(profileForm?.['service.applicationDetails.noOfYears'] >= 0){
                profileForm['service.applicationDetails.noOfYears'] = findValidity?.amount?.toString()
            }
        }



        const profileFormUnflatten = flatten.unflatten(profileForm)
        if (profileForm?.['service.stationClass']) {
            profileForm['service.stationClass'] = _service?.service?.stationClass

        }

        if(amnesty){
            profileFormUnflatten!.amnesty = amnesty
            profileFormUnflatten!.amnestyTotalFee = cleanSoa?.amnestyTotalFee
        }

        if (isLoading) setLoading(true)
        axios.patch(BASE_URL + `/applications/${applicationItem?._id}`, {...profileFormUnflatten, ...cleanSoa}, config).then((response) => {


            //hideToast()
            dispatch(setHasChange(false))
            dispatch(setEdit(false))
            /*setShowAlert2(true)
             setMessageUpdate('The Application has been updated!')
             setTitleUpdate("Success")*/
            let _applicationItem = response.data?.doc


            if(_applicationItem?.region?.code){
                _applicationItem.region = _applicationItem?.region?.code ? _applicationItem?.region?.code :  _applicationItem?.region
            }


            if (_applicationItem?.service?.stationClass) {
                for (let i = 0; i < _applicationItem?.service?.stationClass?.length; i++) {

                    let _split = _applicationItem?.service?.stationClass[i]?.stationClass.split(" • ")
                    if (_split.length == 2) {
                        _applicationItem.service.stationClass[i].stationClass = _split[0]
                        _applicationItem.service.stationClass[i].unit = _split[1]
                    }

                }
            }
            var _flatten = flatten.flatten({..._applicationItem})

            dispatch(setUserOriginalProfileForm(_flatten))
            dispatch(setUserProfileForm(_flatten))
            dispatch(setApplicationItem(_applicationItem))
            dispatch(updateChangeEvent(_applicationItem))

            if (isLoading) setSaved(false)
            if (isLoading) {
                setTimeout(() => {
                    setLoading(false)
                }, 2500)
            }
            dispatch(setUpdateIncrement(updateIncrement + 1))
            //showToast(ToastType.Success, "Successfully updated!")
            callback()
        }).catch((error) => {
            setLoading(false)
            //hideToast()
            let _err = '';
            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string") ) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data)
            }
            /* setMessageUpdate(err?.message||'Something went wrong.')
            setTitleUpdate("Error")*/
            callback()
        });
    })
    const visibleAnimated = useRef(new Animated.Value(Number(!edit))).current;
    const getAnimatedStyle = () => {
        Animated.timing(visibleAnimated, {
            toValue: Number(!edit),
            duration: 300,
            useNativeDriver: true
        }).start();
        return {
            position: visibleAnimated ? 'absolute' : undefined,
            opacity: visibleAnimated,
            transform: [{
                translateY: visibleAnimated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [dimensions.height / 2, 0]
                })
            }]
        };
    }
    const goBackAsync = () => {

        const promise = new Promise<void>(resolve => {
            const subscription = Platform.OS == "web" ? resolve() : props.navigation?.addListener('didBlur', () => {
                subscription.remove();
                resolve();
            });
        });

        if(props?.navigation?.canGoBack()){
            props.navigation?.goBack();
        }
        _props?.onDismissed(change);

        return promise;
    };
    const [initialPage, setInitialPage] = useState(true);
    useEffect(() => {
        setInitialPage(true)
        if(applicationModalGoBack){
            if(Platform.OS != "web"){
                if(props?.navigation?.canGoBack()){
                    props.navigation?.goBack();
                    dispatch(setApplicationModalGoBack(false))
                }
            }
        }
    }, [applicationItem._id]);

    let buttonLabel;

    const renderScene = ({ route, jumpTo }) => {
        if (initialPage) {
            jumpTo( 0)
            setInitialPage(false)
        }
        switch (route.key) {
            case 'application':

                return  <>
                    <CustomAlert
                        showClose={showClose}
                        type={approvalIcon ? APPROVED : ""}
                        onDismissed={() => {
                            setShowAlert(false);
                            setApprovalIcon(false);
                            setShowClose(false)
                            goBackAsync()
                        }}
                        onLoading={alertLoading}
                        onCancelPressed={() => {
                            setShowAlert(false);
                            if (approvalIcon) {
                                setApprovalIcon(false);
                                setShowClose(false)
                            }
                        }}
                        onConfirmPressed={() => {
                            let status = "";
                            if ([CASHIER, DIRECTOR, EVALUATOR,ADMIN].indexOf(user?.role?.key) != -1) {
                                status = APPROVED
                            } else {
                                status = DECLINED
                            }
                            // setShowAlert(false)
                            setAlertLoading(true);
                            onChangeApplicationStatus(status, (err) => {
                                setAlertLoading(false);
                                if (!err) {
                                    setApprovalIcon(true);
                                    setTitle("Application Approved");
                                    setMessage("Application has been approved.");
                                } else {
                                    setApprovalIcon(false);
                                    setTitle("Alert");
                                    setMessage(err?.message || 'Something went wrong.');
                                }
                                setShowClose(true)
                            }, {remarks: remarks, cashier: assignId})
                        }}
                        show={showAlert} title={title}
                        message={message}/>


                    <View onLayout={onActivityModalScreenComponent} style={{flex: 1, backgroundColor: "#FFF"}}>
                        {(
                            isMobile || (Platform?.isPad || isTablet())) && <View style={{
                            flexDirection: "row",
                            alignItems: "center",

                            borderBottomColor: "#F0F0F0",
                            justifyContent: "space-evenly",
                            padding: 15,
                            paddingTop: 40,
                        }}>

                            {edit ? <TouchableOpacity hitSlop={hitSlop} onPress={editBtn}>
                                    <View style={{marginHorizontal: 10}}><ChevronLeft width={fontValue(24)} height={fontValue(24)}
                                                                                      color="#606A80"/></View>
                                </TouchableOpacity> :
                                <TouchableOpacity hitSlop={hitSlop} onPress={() => {
                                    handleBackButtonClick()
                                }}>
                                    <View style={{marginHorizontal: 10}}><CloseIcon width={fontValue(16)} height={fontValue(16)}
                                                                                    color="#606A80"/></View>
                                </TouchableOpacity>}
                            <Text
                                style={[styles.applicationType, {width: "85%"}]}>{applicationItem?.applicationType || applicationItem?.service?.name}</Text>

                            {(((applicationItem?.assignedPersonnel?._id == user?._id || applicationItem?.assignedPersonnel?.role == user?.role?.key ) || (applicationItem?.assignedPersonnel?.length > 0 ? applicationItem?.assignedPersonnel?.findIndex( assignment => assignment?._id == user?._id) != -1 : false) )  && (applicationItem?.approvalHistory?.action == FOREVALUATION || applicationItem?.approvalHistory?.[0]?.action == FOREVALUATION ))  ? editModalVisible ? edit ?
                                <TouchableOpacity hitSlop={hitSlop} onPress={() => {

                                    updateApplication(() => {
                                    }).then(r => {
                                    })

                                }
                                }>
                                    {loading ? <ActivityIndicator color={infoColor}/> :
                                        <Text style={{
                                            marginHorizontal: 10,
                                            fontFamily: Regular,
                                            fontSize: fontValue(16),
                                            color: infoColor
                                        }}>Save</Text>}
                                    {/* <EditIcon color="#606A80"/>*/}
                                </TouchableOpacity>

                                : <TouchableOpacity hitSlop={hitSlop} onPress={() => {
                                    dispatch(setSceneIndex(1))
                                }
                                }>

                                    <Text style={{
                                        marginHorizontal: 10,
                                        fontFamily: Regular,
                                        fontSize: fontValue(16),
                                        color: infoColor
                                    }}>Edit</Text>
                                    {/* <EditIcon color="#606A80"/>*/}
                                </TouchableOpacity> : <Text style={{
                                marginHorizontal: 10,
                                fontFamily: Regular,
                                fontSize: fontValue(16),
                                opacity: 0
                            }}>Edit</Text> : <></>
                            }

                        </View>}


                        <ModalTab saved={saved} loading={loading} setEditAlert={setEditAlert}
                                  updateApplication={updateApplication} editBtn={editBtn}
                                  setEdit={setEdit}
                                  hasChanges={hasChanges} edit={edit} dismissed={() => {
                            goBackAsync()
                        }} details={applicationItem} status={status}/>

                        {Platform.OS != "web" ? <Toast/> : <></>}
                        {!edit ? <View style={[{
                                paddingHorizontal: !isMobile ? 64 : 0,
                                borderTopColor: 'rgba(0, 0, 0, 0.1)',
                                borderTopWidth: 1, backgroundColor: "white"
                            }]}>
                                <View style={!(
                                    isMobile) && {
                                    width: dimensions?.width <= 768 ? "100%" : "60%",
                                    alignSelf: "flex-end"
                                }}>
                                    <View style={styles.footer}>
                                        {getRole(user, [ADMIN, DIRECTOR, EVALUATOR, CASHIER, ACCOUNTANT]) ?
                                            <View style={styles.groupButton}>
                                                <ApprovedButton
                                                    user={user}
                                                    currentLoading={currentLoading}
                                                    allButton={allButton}
                                                    onPress={() => {
                                                        if (getRole(user, [ADMIN, EVALUATOR])) {
                                                            setShowAlert1(true)
                                                            setApproveVisible(true)
                                                        } else {
                                                            setApproveVisible(true)
                                                        }
                                                    }}/>

                                                <DeclineButton
                                                    currentLoading={currentLoading}
                                                    allButton={allButton}
                                                    onPress={() => {
                                                        setVisible(true)
                                                    }}/>

                                            </View> :<></>}
                                        {getRole(user, [ADMIN, EVALUATOR]) && applicationItem?.service?.serviceCode !== "service-22" ?
                                            <EndorsedButton
                                                currentLoading={currentLoading}
                                                allButton={allButton}
                                                onPress={() => {
                                                    setEndorseVisible(true)
                                                }}/> : <></>}
                                    </View>
                                </View>
                            </View> : <></>
                        }
                    </View>

                    <Approval
                        paymentMethod={applicationItem.paymentMethod}
                        showAlert={showAlert1}
                        setShowAlert={setShowAlert1}
                        size={activityModalScreenComponent}
                        onModalDismissed={(event?: any) => {
                            if (event == "cancel") {
                                //cancelTokenSource?.cancel();
                            }
                            setCheckNumber(prevCheckNumber)
                            setBankName(prevBankName);
                            setStatus(prevStatus);
                            setRemarks(prevRemarks);
                            setAssignId(applicationItem?.assignedPersonnel?._id || applicationItem?.assignedPersonnel)
                            if (getRole(user, [ADMIN, EVALUATOR])) {
                                onApproveDismissed();

                            }
                            dispatch(setFeedVisible(true))
                        }}
                        onChangeRemarks={(_remark: string, _assign, _checkNumber, _bankName) => {

                            setPrevBankName(bankName);
                            setPrevCheckNumber(checkNumber);
                            setPrevStatus(status);
                            setPrevRemarks(remarks);
                            setPrevAssignId(assignId);
                            if (getRole(user, [CASHIER, DIRECTOR, ACCOUNTANT])) {
                                setBankName(_bankName);
                                setCheckNumber(_checkNumber);
                                setRemarks(_remark);
                                setAssignId(_assign)
                            }
                            setShowAlert1(true)

                        }}


                        visible={approveVisible}
                        confirm={(event: any, callback: (res, callback) => {}) => {
                            setRemarks(event.remark);
                            setBankName(event.bankName);
                            setCheckNumber(event.checkNumber);
                            setAssignId(event.cashier)
                            let status = "";

                            if (getRole(user, [ADMIN, DIRECTOR, EVALUATOR])) {
                                if (applicationItem?.service?.serviceCode == "service-22") {
                                    status = APPROVED
                                } else {
                                    status = FORAPPROVAL
                                }

                            } else if (getRole(user, [ACCOUNTANT])) {
                                status = APPROVED
                            } else if (getRole(user, [CASHIER])) {
                                status = PAID
                            }
                            onChangeApplicationStatus(status, (err, appId) => {

                                if (!err) {

                                    callback(true, (bool) => {

                                    })
                                } else {

                                    callback(false, (bool) => {

                                    })
                                }

                            }, event)


                        }}
                        onExit={() => {

                            onApproveDismissed();
                            goBackAsync()

                        }}
                        onDismissed={(event?: any, callback?: (bool) => {}) => {
                            if (event == APPROVED) {
                                onApproveDismissed();

                            }
                            if (callback) {
                                callback(true)
                            }
                        }}
                    />
                    <Disapproval
                        size={activityModalScreenComponent}
                        user={applicationItem?.applicant?.user}
                        remarks={setRemarks}
                        onChangeApplicationStatus={(event: any, callback: (bool, appId) => {}) => {

                            onChangeApplicationStatus(DECLINED, (err, id) => {

                                if (!err) {
                                    callback(true, (response) => {

                                    })
                                } else {
                                    callback(false, (response) => {

                                    })
                                }
                            }, event)
                        }
                        }
                        visible={visible}
                        onExit={() => {
                            onDismissed();
                            goBackAsync()
                        }}
                        onDismissed={() => {

                            onDismissed()

                        }}
                    />
                    <Endorsed
                        size={activityModalScreenComponent}
                        assignedPersonnel={applicationItem?.assignedPersonnel?._id || applicationItem?.assignedPersonnel}
                        onModalDismissed={() => {
                            setRemarks(prevRemarks);
                            setAssignId(applicationItem?.assignedPersonnel?._id || applicationItem?.assignedPersonnel)
                        }}
                        remarks={(event: any) => {
                            setPrevRemarks(remarks);
                            setPrevAssignId(assignId);
                            setRemarks(event.remarks);
                            setAssignId(event.endorseId)
                        }}
                        onChangeApplicationStatus={(event: any, callback: (bool, response) => {}) => {
                            onChangeApplicationStatus(event.status, (err, id) => {
                                console.log(!err, err);
                                if (!err) {
                                    callback(true, (response) => {

                                    })
                                } else {
                                    callback(false, (response) => {

                                    })
                                }

                            }, event);
                        }}
                        visible={endorseVisible}
                        onExit={() => {

                            onEndorseDismissed();
                            goBackAsync().then(() => {
                                console.log(1)
                                _props.onDismissed(true);
                            })
                        }}
                        onDismissed={() => {

                            onEndorseDismissed()
                        }}
                    />

                    <Alert
                        visible={discardAlert}
                        title={'Discard Changes'}
                        message={'Any unsaved changes will not be saved. Continue?'}
                        confirmText='OK'
                        cancelText={"Cancel"}
                        onConfirm={() => {
                            setAssignId("");
                            setStatus("");
                            goBackAsync()
                            setChange(false)
                            setDiscardAlert(false)
                        }
                        }
                        onCancel={() => setDiscardAlert(false)}
                    />
                    <CustomAlert
                        showClose={true}
                        onDismissed={() => {
                            setShowAlert2(false)
                        }
                        }
                        onCancelPressed={() => {
                        }
                        }

                        show={showAlert2}
                        title={titleUpdate}
                        message={messageUpdate}
                        confirmText='OK'
                        onConfirmPress={() => {
                            setShowAlert2(false)
                        }
                        }
                    />
                    <Alert
                        visible={editAlert}
                        title={'Edit Changes'}
                        message={'Any unsaved changes will not be saved. Continue?'}
                        confirmText='OK'
                        cancelText={"Cancel"}
                        onConfirm={() => {
                            dispatch(setHasChange(false))
                            dispatch(setEdit((bool) => !bool))
                            setEditAlert(false)
                            const myPromise = new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    dispatch(setUserProfileForm(userOriginalProfileForm))
                                }, 300);
                            });


                        }
                        }
                        onCancel={() => setEditAlert(false)}
                    />
                </>;
            case 'edit':
                return <ServiceFormPage  jumpTo={()=> {

                    jumpTo("application")
                }}/>
        }
    };
    const [routes] = React.useState([
        { key: 'application', title: 'Application' },
        { key: 'edit', title: 'Edit' },
    ]);
    const _setUpdateIncrement = () => {
        dispatch(setUpdateIncrement(updateIncrement + 1))
    }

    return (
        <>
            <View  style={(isMobile && !((Platform?.isPad || isTablet()) && isLandscapeSync())) && (
                visible || endorseVisible || showAlert) ? {
                position: "absolute",
                zIndex: 2,
                top: 0,
                left: 0,
                width: dimensions.width,
                height: dimensions.height,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            } : {position: "absolute",}}>
            </View>

            <TabView
               // lazy={true}
                swipeEnabled={false}
                renderTabBar={() => null}
                navigationState={{ index: sceneIndex, routes }}
                renderScene={renderScene}
                onIndexChange={(index) => dispatch(setSceneIndex(index))}
                initialLayout={{ width: dimensions.width }}
            />



        </>
    );
}

export default memo(ActivityModal)
const styles = StyleSheet.create({
    applicationType: {
        textAlign: "center",
        fontFamily: Bold,
        fontSize: fontValue(12),
        color: "#606A80"
    },
    container: {
        flex: 1
    },
    groupButton: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    group13: {
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        position: "absolute"
    },
    rect16: {
        backgroundColor: "rgba(255,255,255,1)",
        flex: 1
    },
    group: {
        height: 100,
        flex: 0
    },
    rect3: {
        height: 100
    },
    rect2: {
        height: 100,
        backgroundColor: "#041B6E"
    },
    icon: {
        color: "rgba(255,255,255,1)",
        fontSize: 24,
        marginTop: 55,
        marginLeft: 14
    },
    group3: {
        width: 100,
        height: 97,
        flex: 0
    },
    rect4: {
        top: 0,
        left: 0,
        width: 100,
        height: 97,
        position: "absolute"
    },
    ellipse: {
        borderRadius: 40,
        top: 17,
        left: 20,
        width: 81,
        height: 81,
        position: "absolute"
    },
    rect4Stack: {
        width: 101,
        height: 98
    },
    group8: {
        width: 309,
        height: 30,
        marginTop: 29,
        marginLeft: 33
    },
    rect11: {
        height: 28,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row",
        marginLeft: -33,
        marginRight: -33
    },
    group5: {
        height: 28
    },
    rect6: {
        height: 3,
        marginTop: 8
    },
    group6: {
        height: 28,
        marginLeft: 19
    },
    application: {
        color: primaryColor
    },
    rect8: {
        height: 2,
        backgroundColor: primaryColor,
        marginTop: 10
    },
    group7: {
        height: 28,
        marginLeft: 29
    },
    requirement: {
        color: primaryColor
    },
    rect10: {
        height: 2,
        backgroundColor: primaryColor,
        marginTop: 10
    },
    group5Row: {
        height: 28,
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        marginLeft: "5%"
    },
    rect12: {
        width: "100%",
        height: 1,
        backgroundColor: "#E6E6E6",
        marginTop: 1,
        marginLeft: -33
    },
    group10: {
        height: "60%",
    },


    groupColumn: {},
    groupColumnFiller: {
        flex: 1,

    },
    group14: {},
    rect18Filler: {
        flex: 1
    },
    rect18: {
        height: 50,
        backgroundColor: "rgba(255,255,255,1)"
    },
    endWrapperFiller: {
        flex: 1
    },
    rect19: {
        height: 1,
        backgroundColor: "#E6E6E6",
        marginBottom: 14
    },
    group15: {
        width: 331,
        height: 32,
        flexDirection: "row",
        alignSelf: "center"
    },
    button3: {
        width: 100,
        height: 31
    },
    rect22Filler: {
        flex: 1
    },
    rect22: {
        height: 31,

        borderRadius: 24
    },
    approvedFiller: {
        flex: 1
    },

    button2: {
        width: 100,
        height: 31,
        marginLeft: 15
    },
    rect23Filler: {
        flex: 1
    },
    rect23: {
        height: 31,

        borderRadius: 6
    },
    endorseFiller: {
        flex: 1
    },

    button3Row: {
        height: 31,
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 1
    },
    button3RowFiller: {
        flex: 1,
        flexDirection: "row"
    },
    button: {
        width: 100,
        height: 31,
        borderWidth: 1,
        borderColor: "rgba(194,0,0,1)",
        borderRadius: 6,
        alignSelf: "flex-end"
    },
    rect24Filler: {
        flex: 1
    },

    endorse1Filler: {
        flex: 1
    },
    endorse1: {

        textAlign: "center",
    },
    rect19Column: {
        marginBottom: 10
    },
    group4: {
        top: 100,
        width: 264,
        height: 97,
        position: "absolute",
        right: 0,
        flex: 0,
        backgroundColor: "rgba(230, 230, 230,1)"
    },
    rect5: {
        top: 0,
        width: 264,
        height: 97,
        position: "absolute",
        right: 0,
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,1)"
    },
    group11: {
        width: 264,
        height: 39,
        backgroundColor: "rgba(255,255,255,1)",
        marginTop: 26
    },
    name: {
        fontFamily: Bold,
        color: "#121212",
        textAlign: "left",
        fontSize: 20
    },
    job: {
        color: "rgba(98,108,130,1)",
        fontSize: 10,
        textAlign: "left"
    },
    group2: {
        width: 264,
        height: 21,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row",
        marginLeft: -264,
        marginTop: 65
    },


    icon2Row: {
        height: 11,
        flexDirection: "row",
        flex: 1,
        marginRight: 171,
        marginTop: 6
    },
    group12: {
        top: 26,
        left: 195,
        width: 69,
        height: 72,
        position: "absolute"
    },

    rect5Stack: {
        width: 264,
        height: 98
    },
    group13Stack: {
        width: 376,
        height: 812
    },
    footer: {

        paddingHorizontal: 20,
        paddingVertical: 30,
        flexDirection: 'row',

    }
});
