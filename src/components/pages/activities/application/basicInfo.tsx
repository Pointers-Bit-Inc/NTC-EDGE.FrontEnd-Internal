import React, {memo, useEffect, useMemo, useRef, useState} from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
    TouchableOpacity
} from "react-native";
import {excludeStatus, getStatusText, remarkColor, statusColor, statusIcon} from "@pages/activities/script";
import ProfileImage from "@atoms/image/profile";
import CustomText from "@atoms/text";
import {APPROVED, CASHIER, DECLINED} from "../../../../reducers/activity/initialstate";
import moment from "moment";
import {Bold, Regular, Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import Row from "@pages/activities/application/Row"
import RenderServiceMiscellaneous from "@pages/activities/application/renderServiceMiscellaneous2";
import styles from "@styles/applications/basicInfo"
import useSafeState from "../../../../hooks/useSafeState";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import DateField from "@pages/activities/application/datefield";
import TimeField from "@pages/activities/application/timefield";
import {BASE_URL} from "../../../../services/config";
import api from "../../../../services/api";
import {ToastType} from "@atoms/toast/ToastProvider";
import {useToast} from "../../../../hooks/useToast";
import axios from "axios";
import ToastLoading from "@components/atoms/toast/ToastLoading";
import LoadingModal from "@pages/activities/loading/loadingModal";
import CollapseText from "@atoms/collapse-text";
import ChevronDown from "@assets/svg/chevron-down";
import ChevronUp from "@assets/svg/chevron-up";
import RowText from "@pages/activities/application/RowText";
import Loading from "@atoms/loading";
import {infoColor} from "@styles/color";
import {setEditModalVisible} from "../../../../reducers/activity/actions";
import _ from "lodash";
import useMemoizedFn from "../../../../hooks/useMemoizedFn";
import {setUserProfileForm} from "../../../../reducers/application/actions";


function Status(_props: { user: any, paymentHistory: any, approvalHistory: any, historyMemo: any[] | undefined, props: any, personnel: string, paymentHistory1: any, assignedPersonnel: any }) {
    const props = useMemo(() => _props, [_props] )
    return <View style={[styles.group3, Platform.OS == "web" ? {paddingVertical: 10} : {}]}>
        <View style={[styles.group, {paddingBottom: fontValue(6)}]}>
            <View style={styles.rect}>
                <Text style={styles.header}>STATUS</Text>
            </View>
        </View>
        <View
            style={[styles.status, {
                justifyContent: props.assignedPersonnel?._id || props?.personnel ? 'space-between' : "center",
                paddingBottom: !!(([CASHIER].indexOf(props.user?.role?.key) != -1 ? props.paymentHistory?.remarks : props.approvalHistory?.remarks) || (props.historyMemo.length)) ? 7.5 : 0
            }]}>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: remarkColor(
                        getStatusText(props.props, props?.personnel)
                    ),
                    borderRadius: fontValue(30),
                    paddingHorizontal: fontValue(3),
                    paddingVertical: fontValue(3)
                }}>
                {/*{
                                        statusIcon(
                                            getStatusText(props, personnel)
                                            ,
                                            styles.icon2,
                                            1
                                        )
                                    }*/}
                <CustomText
                    style={[
                        styles.role,


                        {
                            fontSize: fontValue(16),
                            fontFamily: Bold,
                            color: "#fff"
                        }
                    ]}
                    numberOfLines={1}
                >
                    {
                        getStatusText(props.props, props?.personnel)?.toUpperCase()
                    }
                </CustomText>
            </View>


            {props?.personnel != undefined &&
            (
                getStatusText(props.props, props?.personnel) == APPROVED ? getStatusText(props.props, props?.personnel) : (!excludeStatus(props.props, props?.personnel) || ([CASHIER].indexOf(props.user?.role?.key) != -1 ? !!(props.paymentHistory1?.remarks || props.paymentHistory1?.[0]?.remarks) : (props.approvalHistory?.remarks || props.approvalHistory?.[0]?.remarks)))) ?
                <View style={{alignItems: "flex-end"}}>

                    <Text style={{color: "#808196"}}>by</Text>
                    <CustomText
                        style={{fontSize: fontValue(12), flex: 1, color: "#37405B"}}>
                        {(
                            props?.personnel !== undefined ? `${props?.personnel?.firstName} ${props?.personnel?.lastName}` : ``)}

                    </CustomText>
                </View>
                : (props.assignedPersonnel ? <View style={{alignItems: "flex-end"}}>

                    <Text style={{color: "#808196"}}>Assigned to</Text>
                    <CustomText
                        style={{fontSize: fontValue(12), flex: 1, color: "#37405B"}}>
                        {(
                            props.assignedPersonnel !== undefined ? `${props.assignedPersonnel?.firstName} ${props.assignedPersonnel?.lastName}` : ``)}

                    </CustomText>
                </View> : <View style={{alignItems: "flex-end"}}>

                    <Text style={{color: "#808196"}}>Assigned to</Text>
                    <CustomText
                        style={{fontSize: fontValue(12), flex: 1, color: "#37405B"}}>
                        {(
                            props?.personnel !== undefined ? `${props?.personnel?.firstName} ${props?.personnel?.lastName}` : ``)}

                    </CustomText>
                </View>)}

        </View>
    </View>;
}

function IsMorePress(props: { loading: any, onPress: () => void, more: boolean }) {

    return <TouchableOpacity onPress={props.onPress}>
        <View style={{flex: 1, justifyContent: "flex-end", flexDirection: "row", alignItems: "center"}}>

            {props.loading ? <Loading numberOfDots={3} size={6} color={infoColor}/> : <><Text style={{
                fontFamily: Regular500,
                fontSize: fontValue(12),
                color: "#2863D6",
                paddingRight: fontValue(10)
            }}>{props.more ? "See less" : "See More"}</Text>
            {props.more ? <ChevronUp color={"#2863D6"}/> : <ChevronDown color={"#2863D6"}/>}</>}
        </View>
    </TouchableOpacity>;
}


const BasicInfo = (_props: any) => {
    const userProfileForm = useSelector((state: RootStateOrAny) => state.application.userProfileForm);
    const userOriginalProfileForm = useSelector((state: RootStateOrAny) => state.application.userOriginalProfileForm);

    const props = useMemo(() => _props , [_props])
    const dispatch=useDispatch();
    const personnel = useMemo(() => {
        var _personnel = ''
        if (!!props?.paymentMethod && props?.assignedPersonnel?._id) {
            _personnel = props?.assignedPersonnel
        } else if (props?.paymentStatus == APPROVED || props?.paymentStatus == DECLINED) {
            _personnel = props?.paymentHistory?.[0]?.personnel || props?.paymentHistory?.personnel;
        } else {
            _personnel = props?.approvalHistory?.[0]?.personnel || props?.approvalHistory?.personnel;

        }
        return _personnel
    }, [props?.paymentMethod, props?.paymentHistory, props?.approvalHistory, props?.paymentStatus])

    const scrollRef = useRef();
    const [showAlert, setShowAlert] = useSafeState(false)
    const applicant = useMemo(()=>props?.applicant?.user || props?.applicant, [props?.applicant?.user ,props?.id]);
    useEffect(() => {
        if (Platform.isPad || Platform.OS == "web") {
            scrollRef?.current?.scrollTo({
                y: 0,
                animated: true,
            });
        }
    }, [applicant?._id])


    const applicantForm = (stateName, value) => {
        let newForm = {...userProfileForm}

        newForm[stateName] =value


       dispatch(setUserProfileForm(newForm))
    }
    const user = useSelector((state: RootStateOrAny) => state.user);
    const dimensions = useWindowDimensions();


    const hasChanges = () => {

        var hasChanges = false;

        for (const [key, value] of Object.entries(userOriginalProfileForm)) {

            if (userOriginalProfileForm?.[key] != userProfileForm?.[key]) {
                hasChanges = true

                props.hasChanges(hasChanges)
                return
            } else {
                hasChanges = false
                props.hasChanges(hasChanges)
            }
        }


    }

    useEffect(() => {
        hasChanges()

    }, [userProfileForm])

    const [loading, setLoading] = useSafeState(false)
    const updateApplication = () => {
        setLoading(true)
        props?.updateApplication(() => {
            setLoading(false)
        })

    }
    const isMoreRemark = () => {
        setLoading(true)
        props?.updateApplication(() => {
            setLoading(false)
        }, false)

    }
    const {showToast, hideToast} = useToast();
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        hideToast()
        showToast(ToastType.Info, <ToastLoading/>)
        axios.get(BASE_URL + "/applications/" + props.id, {
            headers: {
                Authorization: "Bearer ".concat(user?.sessionToken)
            }
        }).then(() => {
            hideToast()

            showToast(ToastType.Success, "Successfully updated!")
            setRefreshing(false);
        }).catch((error) => {
            hideToast()
            let _err = '';

            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string") ) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data)
            }
            setRefreshing(false);
        });
    }, []);

    const historyMemo = useMemo(() => {
        const _paymentHistory = props.paymentHistory?.length ? props.paymentHistory : []
        const _approvalHistory = props.approvalHistory?.length ? props.approvalHistory : []



        return [..._paymentHistory, ..._approvalHistory]?.filter((s, index) => {
            return s?.remarks
        }) || []
    }, [props.paymentHistory, props.approvalHistory])


    const historyArrayMemo = useMemo(() => {

        return  props.isMore ? historyMemo : [_.first(historyMemo)]
    }, [props.paymentHistory,historyMemo, props.approvalHistory, props.isMore])
    const drowdownVisible= useSelector((state:RootStateOrAny)=>state.activity?.drowdownVisible);

    const collapsedText = useMemo(() => {
        return [CASHIER].indexOf(user?.role?.key) != -1 && props.paymentHistory ? ((props?.paymentHistory?.remarks || props?.paymentHistory?.[0]?.remarks) || (props?.approvalHistory?.remarks || props?.approvalHistory?.[0]?.remarks) ): ((props?.approvalHistory?.remarks || props?.approvalHistory?.[0]?.remarks) ||  (props?.paymentHistory?.remarks || props?.paymentHistory?.[0]?.remarks))
    }, [props])
    const collapsedTime = useMemo(() => {
        return moment([CASHIER].indexOf(user?.role?.key) != -1 && props.paymentHistory ? ((props?.paymentHistory?.time || props?.paymentHistory?.[0]?.time) ||  (props?.approvalHistory?.time || props?.approvalHistory?.[0]?.time)) : ((props?.approvalHistory?.time || props?.approvalHistory?.[0]?.time) || (props?.paymentHistory?.time || props?.paymentHistory?.[0]?.time)) ).fromNow()
    }, [props])
    const containerMergeStyle = useMemo(() => [styles.elevation, {width: "90%", marginVertical: 10,}], [])
    const containerMarginMergeStyle = useMemo(() => [styles.container, {marginVertical: 10}], [])
    const ContainerRemarkStyle = useMemoizedFn((containerRemarkProps) => {
        return <>{ Platform.OS == "web"? <>
                {containerRemarkProps.children}
            </> : <View style={containerMergeStyle}>
            <View style={containerMarginMergeStyle}>
                <View style={styles.group4}>
                    {containerRemarkProps.children}
                </View>
            </View>
        </View>}</>
    })

    const RemarkFn = useMemoizedFn(() => {
        return (props.paymentHistory?.remarks || props?.approvalHistory?.remarks) ?

               <ContainerRemarkStyle>
                   <View style={[styles.group3, Platform.OS == "web" ? {paddingVertical: 10} : {}]}>

                       <View style={[styles.group, {paddingBottom: 10}]}>
                           <View style={styles.rect}>
                               <Text style={styles.header}>REMARKS</Text>
                           </View>
                       </View>
                       <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                           <View style={{flexDirection: "row", alignItems: "center",}}>
                               <View style={{paddingRight: 10}}>
                                   <Text style={[{
                                       fontSize: fontValue(10),
                                       color: "#37405B"
                                   }]}>{`${personnel?.firstName} ${personnel?.lastName}`}</Text>
                               </View>

                               <View
                                   style={{

                                       alignItems: "center",
                                       justifyContent: "center",
                                       backgroundColor: remarkColor(
                                           getStatusText(props, personnel)
                                       ),
                                       borderRadius: fontValue(30),
                                       paddingHorizontal: fontValue(5),
                                       paddingVertical: fontValue(6)
                                   }}>

                                   <CustomText
                                       style={[
                                           styles.role,


                                           {
                                               fontSize: fontValue(10),
                                               fontFamily: Bold,
                                               color: "#fff"
                                           }
                                       ]}
                                       numberOfLines={1}
                                   >
                                       {
                                           getStatusText(props, personnel)?.toUpperCase()
                                       }
                                   </CustomText>
                               </View>
                           </View>
                           <Text style={{
                               color: "#606A80",
                               fontSize: fontValue(10)
                           }}>{collapsedTime}</Text>
                       </View>

                       <CollapseText expandStyle={{color: "#565961"}}
                                     textContainerStyle={{}}
                                     textStyle={[{fontSize: fontValue(12), fontFamily: Regular500, fontWeight: "500"}]}
                                     text={collapsedText}/>
                       <IsMorePress onPress={() => {
                           isMoreRemark()
                           props.setIsMore((bool) => !bool)
                       }} loading={loading} more={props.isMore}/>
                   </View>
               </ContainerRemarkStyle>


            : (!!(historyArrayMemo?.length) ?
                <ContainerRemarkStyle>
                <View style={[styles.group3, Platform.OS == "web" ? {paddingVertical: 10} : {}]}>
                    <View style={[styles.group, {paddingBottom: 10}]}>
                        <View style={styles.rect}>
                            <Text style={styles.header}>REMARKS</Text>
                        </View>
                    </View>

                    <FlatList
                        data={historyArrayMemo}
                        renderItem={({item, index}) => {

                            return <>
                                <View style={{
                                    paddingTop:index != historyArrayMemo?.length - 1 ? 0 : 10,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}>
                                        <View style={{paddingRight: 10}}>
                                            <Text style={[{
                                                fontSize: fontValue(10),
                                                color: "#37405B"
                                            }]}>{`${item?.personnel?.firstName} ${item?.personnel?.lastName}`}</Text>
                                        </View>

                                        <View
                                            style={{

                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: remarkColor(
                                                    item?.status
                                                ),

                                                borderRadius: fontValue(30),
                                                paddingHorizontal: fontValue(5),
                                                paddingVertical: fontValue(6)
                                            }}>

                                            <CustomText
                                                style={[
                                                    styles.role,


                                                    {
                                                        fontSize: fontValue(10),
                                                        fontFamily: Bold,
                                                        color: "#fff"
                                                    }
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {
                                                    item?.action?.toUpperCase()
                                                }
                                            </CustomText>
                                        </View>
                                    </View>
                                    <Text style={{
                                        color: "#606A80",
                                        fontSize: fontValue(10)
                                    }}>{moment(item?.time).fromNow()}</Text>
                                </View>

                                <CollapseText expandStyle={{color: "#565961"}}
                                              textContainerStyle={index == historyArrayMemo?.length - 1 ? {} : {
                                                  borderBottomColor: "#ECECEC",
                                                  borderBottomWidth: 1,
                                              }}
                                              textStyle={[{
                                                  fontSize: fontValue(12),
                                                  fontFamily: Regular500,
                                                  fontWeight: "500"
                                              }]}
                                              text={item?.remarks}/>
                            </>
                        }
                        }
                        keyExtractor={(item, index) => index}
                    />
                    <IsMorePress onPress={() => props.setIsMore((bool) => !bool)} more={props.isMore} loading={loading}/>
                </View>
                </ContainerRemarkStyle> : <></>);
    })
    const containerRef = useRef(null);
    const textRef = useRef(null);


    const [measure, setMeasure] = useState(null);
    useEffect(()=>{
       /* if(Platform.OS == "web"){
            props.setBasicInfoIndex(props.basicInfoIndex)
            dispatch(setEditModalVisible(true))
        }*/

    }, [])
    useEffect(() => {
        if (textRef.current && containerRef.current &&  Platform.OS != "web") {
            textRef.current.measureLayout(
                containerRef.current,
                (left, top, width, height) => {
                    if(props.edit){
                        scrollRef?.current?.scrollTo({ y: top, animated: true })
                    }

                }
            );
        }
    }, [props.edit]);

    const dimension = useWindowDimensions()
    return <View ref={containerRef} style={{flex: 1}}>
        {(props.loading && Platform.OS != "web") && <LoadingModal saved={props?.saved} loading={props.loading}/>}
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'position' : "height"}
        >

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
                ref={scrollRef}
                style={{width: "100%", backgroundColor: "#f8f8f8",}}>

                <View style={{flexDirection: isMobile || dimensions?.width <= 768 ? "column" : "row"}}>
                    {Platform.OS != "web" && <View style={styles.elevation}>
                        <View style={[styles.container, {marginVertical: 10}]}>
                            <View style={styles.group4}>
                                <Status user={user} paymentHistory={props.paymentHistory}
                                        approvalHistory={props?.approvalHistory} historyMemo={historyArrayMemo} props={props}
                                        personnel={personnel} paymentHistory1={props?.paymentHistory}
                                        assignedPersonnel={props.assignedPersonnel}/>
                            </View>
                        </View>
                    </View>}

                    {Platform.OS != "web"   ?

                                    <RemarkFn/>
 : <></>}
                    <View style={isMobile || dimensions?.width <= 768 ? {padding: 10, alignSelf: "center"} : {
                        paddingLeft: 20,
                        paddingVertical: 20
                    }}>
                        <ProfileImage
                            size={fontValue(150)}

                            textSize={22}
                            image={applicant?.profilePicture?.small.match(/[^/]+(jpeg|jpg|png|gif)$/i) ? applicant?.profilePicture?.small : applicant?.profilePicture?.small + ".png"}
                            name={applicant?.firstName && applicant?.lastName ? applicant?.firstName + (applicant?.middleName ? " " + applicant?.middleName?.charAt() + "." : "") + " " + applicant?.lastName : applicant?.applicantName ? applicant?.applicantName : ""}
                        />

                        {(
                            !isMobile && dimensions?.width >= 768) && <View style={{paddingVertical: 20}}>
                            <View style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#EFF0F6"
                            }}>
                                <Text style={{
                                    fontWeight: "bold",
                                    fontFamily: Regular,
                                    fontSize: 12,
                                    lineHeight: 24,
                                    color: "#565961"
                                }}>PHOTO</Text>
                            </View>
                        </View>}

                    </View>

                    {props.applicant &&
                        <View  style={!(
                            isMobile) && {flex: 1, paddingRight: 10}}>
                            <View style={styles.elevation}>
                                <View style={[styles.container, {marginTop: 20}]}>
                                    <View style={styles.group4}>

                                        {Platform.OS == "web" &&
                                            <Status user={user} paymentHistory={props.paymentHistory}
                                                    approvalHistory={props?.approvalHistory} historyMemo={historyArrayMemo}
                                                    props={props}
                                                    personnel={personnel} paymentHistory1={props?.paymentHistory}
                                                    assignedPersonnel={props.assignedPersonnel}/>
                                        }
                                        {Platform.OS == "web" &&
                                            <RemarkFn/>

                                        }
                                        {(props.or && user?.role?.key == CASHIER )  ? <View style={styles.group3}>
                                            <View style={styles.group}>
                                                <View style={styles.rect}>
                                                    <Text style={styles.header}>Official Receipt</Text>
                                                </View>
                                            </View>

                                            <RowText label={"OR Number:"}
                                                     applicant={userProfileForm?.["officialReceipt.orNumber"]}/>
                                            <RowText label={"OR By:"}
                                                     display={userProfileForm?.["officialReceipt.orBy.firstName"] + " " +  userProfileForm?.["officialReceipt.orBy.lastName"]}/>

                                        </View> : <></>}
                                        {(applicant?.applicantName ||
                                            applicant?.companyName ||
                                            applicant?.suffix ||
                                            applicant?.dateOfBirth ||
                                            applicant?.gender ||
                                            applicant?.nationality ||
                                            applicant?.weight ||
                                            applicant?.height
                                        )  ? <View style={styles.group3}>
                                            <View style={styles.group}>
                                                <View style={styles.rect}>
                                                    <Text style={styles.header}>Basic Information</Text>
                                                </View>
                                            </View>

                                            <RowText label={"Full Name:"}
                                                     applicant={userProfileForm?.["applicant.applicantName"]}/>

                                            <RowText label={"Company Name:"}
                                                     applicant={userProfileForm?.["applicant.companyName"]}/>

                                            <RowText label={"Suffix:"}
                                                     applicant={userProfileForm?.["applicant.suffix"]}/>
                                            {userProfileForm?.["applicant.dateOfBirth"] ? <RowText label={"Date of Birth:"}
                                                     display={moment(userProfileForm?.["applicant.dateOfBirth"])?.format('LL')}
                                            /> : <></>}
                                            <RowText label={"Gender:"}
                                                     applicant={userProfileForm?.["applicant.gender"]}/>
                                            <RowText label={"Nationality:"}
                                                     applicant={userProfileForm?.["applicant.nationality"]}/>
                                            <RowText label={"Weight:"}
                                                     applicant={userProfileForm?.["applicant.weight"]}/>
                                            <RowText label={"Height:"}
                                                     applicant={userProfileForm?.["applicant.height"]}/>
                                        </View> : <></>}




                                        {!!Object.values({...applicant?.address}).join("") ?
                                            <>
                                                <View style={styles.divider}/>
                                                <View style={styles.group3}>
                                                    <View style={styles.group}>
                                                        <View style={styles.rect}>
                                                            <Text style={styles.header}>Address</Text>
                                                        </View>
                                                    </View>


                                                    <RowText label={"Unit/Rm/Bldg./Street:"}

                                                             applicant={userProfileForm?.['applicant.address.unit']}/>
                                                    <RowText label={"Barangay:"}
                                                             applicant={userProfileForm?.['applicant.address.barangay']}/>
                                                    <RowText label={"Street:"}
                                                             applicant={userProfileForm?.['applicant.address.street']}/>
                                                    <RowText label={"Unit:"}

                                                             applicant={userProfileForm?.['applicant.address.unit']}/>
                                                    <RowText label={"Province:"}
                                                        applicant={userProfileForm?.["applicant.address.province"]}/>
                                                    <RowText label={"City/Municipality:"}
                                                             applicant={userProfileForm?.["applicant.address.city"]}/>
                                                    <RowText label={"Zip Code:"}
                                                             applicant={userProfileForm?.["applicant.address.zipCode"]}/>

                                                </View>
                                            </> : <></>

                                        }

                                        {!!Object.values({...applicant?.address}).join("") ? <View style={styles.divider}/> : <></>}
                                        {!!Object.values({...applicant?.education}).join("") ? <View style={styles.group3}>
                                            <View style={styles.group}>
                                                <View style={styles.rect}>
                                                    <Text style={styles.header}>Educational Background</Text>
                                                </View>
                                            </View>
                                            <RowText label={"School Attended:"}
                                                     applicant={userProfileForm?.["applicant.education.schoolAttended"]}/>
                                            <RowText label={"Course Taken:"}
                                                     applicant={userProfileForm?.["applicant.education.courseTaken"]}/>
                                            <RowText label={"Year Graduated:"}
                                                     applicant={userProfileForm?.["applicant.education.yearGraduated"]}/>


                                        </View> : <></>}
                                        {!!Object.values({...applicant?.education}).join("")  ? <View style={styles.divider}/> : <></>}
                                        {applicant?.contact ? <View style={styles.group3}>
                                            <View style={styles.group}>
                                                <View style={styles.rect}>
                                                    <Text style={styles.header}>Contact Details</Text>
                                                </View>
                                            </View>
                                            <RowText label={"Contact Number:"}

                                                     applicant={userProfileForm?.["applicant.contact.contactNumber"]}/>
                                            <RowText label={"Email:"}

                                                     applicant={userProfileForm?.["applicant.contact.email"]}/>


                                        </View> : <></>}
                                        <View ref={textRef}/>
                                        {props?.schedule  ? <View style={styles.divider}/> : <></>}
                                        {props?.schedule ? <View style={styles.group3}>
                                            <View style={styles.group}>
                                                <View style={styles.rect}>
                                                    <Text style={styles.header}>SCHEDULE</Text>
                                                </View>
                                            </View>

                                            <DateField edit={props.edit} label={"Date:"}
                                                /*show={true}
                                                showEdit={true}*/
                                                       updateForm={applicantForm}
                                                       hasChanges={props.hasChanges}
                                                       updateApplication={updateApplication}
                                                       stateName={"schedule.dateStart"}
                                                       applicant={userProfileForm?.["schedule.dateStart"]}
                                                       display={moment(props?.schedule.dateStart).isValid() ? moment(props?.schedule.dateStart).format('ddd DD MMMM YYYY') : props?.schedule.dateStart}/>
                                            <TimeField edit={props.edit} label={"Start Time:"}
                                                /*show={true}
                                                */
                                                       updateForm={applicantForm}
                                                       hasChanges={props.hasChanges}
                                                       updateApplication={updateApplication}
                                                       stateName={"schedule.dateStart"}
                                                       applicant={userProfileForm?.["schedule.dateStart"]}
                                                       display={moment(props?.schedule.dateStart)?.isValid() ? moment(props?.schedule.dateStart).format('LT') : props?.schedule.dateStart}/>
                                            <TimeField edit={props.edit} label={"End Time:"}
                                                /*show={true}
                                                */
                                                       hasChanges={props.hasChanges}
                                                       updateApplication={updateApplication}
                                                       updateForm={applicantForm}
                                                       stateName={"schedule.dateEnd"}
                                                       applicant={userProfileForm?.["schedule.dateEnd"]}
                                                       display={moment(props?.schedule.dateEnd)?.isValid() ? moment(props?.schedule.dateEnd).format('LT') : props?.schedule.dateEnd}/>
                                            <Row  /*show={true}
                                           */
                                                updateForm={applicantForm}
                                                stateName={"schedule.venue"}
                                                edit={props.edit}
                                                label={"Venue:"}
                                                applicant={userProfileForm?.["schedule.venue"]}/>
                                            <Row  /*show={true}
                                          */
                                                updateForm={applicantForm}
                                                stateName={"schedule.seatNumber"}
                                                edit={props.edit}
                                                label={"Seat No:"}
                                                applicant={userProfileForm?.["schedule.seatNumber"]}/>


                                        </View> : <></>}


                                        <RenderServiceMiscellaneous hasChanges={props.hasChanges}
                                                                    updateApplication={updateApplication}
                                                                    updateForm={applicantForm}
                                                                    userProfileForm={userProfileForm}
                                                                    edit={props.edit}
                                                                    exclude={['_id', 'name', 'applicationType', 'serviceCode']}
                                                                    service={props?.service}/>


                                        {props.edit || userProfileForm?.["note"]  ? <View style={styles.group3}>
                                           <View style={styles.group}>
                                               <View style={styles.rect}>
                                                   <Text style={styles.header}>Note</Text>
                                               </View>
                                           </View>
                                        <View style={{paddingVertical: 5}}>
                                            <Row  /*show={true}

                                      */        multiline={true}
                                                containerStyle={ {
                                                    height : undefined ,
                                                    borderColor : "#D1D1D6" ,
                                                    borderWidth : 1 ,
                                                    backgroundColor : undefined ,
                                                } }
                                                outlineStyle={ {
                                                    //  borderColor: "rgba(202,210,225,1)",
                                                    paddingTop : 10 ,
                                                    height : dimension.height * 0.25
                                                } }
                                                inputStyle={{
                                                    textAlignVertical: "top",
                                                    [Platform.OS=="android" ? "height" : "height"]: dimension.height*0.15,
                                                    fontWeight:"400",
                                                    fontSize:fontValue(14)
                                                }}
                                                updateForm={applicantForm}
                                                stateName={"note"}
                                                edit={props.edit}
                                                label={""}
                                                applicant={userProfileForm?.["note"]}/>
                                        </View>

                                       </View> : <></>}
                                    </View>

                                </View>

                            </View>
                            {props.edit && <View style={{marginBottom: 200}}/>  }
                        </View>

                    }

                </View>


            </ScrollView>

        </KeyboardAvoidingView>
    </View>
};

export default memo(BasicInfo)
