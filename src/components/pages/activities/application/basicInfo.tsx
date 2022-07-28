import React, {memo, useEffect, useMemo, useRef} from "react";
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
import {RootStateOrAny, useSelector} from "react-redux";
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


function Status(props: { user: any, paymentHistory: any, approvalHistory: any, historyMemo: any[] | undefined, props: any, personnel: string, paymentHistory1: any, assignedPersonnel: any }) {
    return <View style={styles.group3}>
        <View style={styles.group}>
            <View style={styles.rect}>
                <Text style={styles.header}>STATUS</Text>
            </View>
        </View>
        <View
            style={[styles.status, {paddingBottom: !!(([CASHIER].indexOf(props.user?.role?.key) != -1 ? props.paymentHistory?.remarks : props.approvalHistory?.remarks) || (props.historyMemo.length)) ? 7.5 : 0}]}>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: remarkColor(
                        getStatusText(props.props, props.personnel)
                    ),
                    borderRadius: fontValue(30),
                    paddingHorizontal: fontValue(13.5),
                    paddingVertical: fontValue(6)
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
                        getStatusText(props.props, props.personnel)?.toUpperCase()
                    }
                </CustomText>
            </View>


            {props.personnel != undefined &&
            (
                getStatusText(props.props, props.personnel) == APPROVED ? getStatusText(props.props, props.personnel) : (!excludeStatus(props.props, props.personnel) || ([CASHIER].indexOf(props.user?.role?.key) != -1 ? !!(props.paymentHistory1?.remarks || props.paymentHistory1?.[0]?.remarks) : (props.approvalHistory?.remarks || props.approvalHistory?.[0]?.remarks)))) ?
                <View style={{alignItems: "flex-end"}}>

                    <Text style={{color: "#808196"}}>by</Text>
                    <CustomText
                        style={{fontSize: fontValue(12), flex: 1, color: "#37405B"}}>
                        {(
                            props.personnel !== undefined ? `${props.personnel?.firstName} ${props.personnel?.lastName}` : ``)}

                    </CustomText>
                </View>
                : <View style={{alignItems: "flex-end"}}>

                    <Text style={{color: "#808196"}}>Assigned to</Text>
                    <CustomText
                        style={{fontSize: fontValue(12), flex: 1, color: "#37405B"}}>
                        {(
                            props.assignedPersonnel !== undefined ? `${props.assignedPersonnel?.firstName} ${props.assignedPersonnel?.lastName}` : ``)}

                    </CustomText>
                </View>}

        </View>
    </View>;
}

function IsMorePress(props: { onPress: () => void, more: boolean }) {
    return <TouchableOpacity onPress={props.onPress}>
        <View style={{flex: 1, justifyContent: "flex-end", flexDirection: "row", alignItems: "center"}}>
            <Text style={{
                fontFamily: Regular500,
                fontSize: fontValue(12),
                color: "#2863D6",
                paddingRight: fontValue(10)
            }}>{props.more ? "See less" : "See More"}</Text>
            {props.more ? <ChevronUp color={"#2863D6"}/> : <ChevronDown color={"#2863D6"}/>}
        </View>
    </TouchableOpacity>;
}

const BasicInfo = (props: any) => {

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
    const applicant = props?.applicant?.user || props?.applicant;
    useEffect(() => {
        if (Platform.isPad || Platform.OS == "web") {
            scrollRef?.current?.scrollTo({
                y: 0,
                animated: true,
            });
        }

    }, [applicant?._id])


    const applicantForm = (stateName, value) => {
        let newForm = {...props.userProfileForm}
        newForm[stateName] = value


        props.setUserProfileForm(newForm)
    }
    const user = useSelector((state: RootStateOrAny) => state.user);
    const dimensions = useWindowDimensions();


    const hasChanges = () => {

        var hasChanges = false;

        for (const [key, value] of Object.entries(props.userOriginalProfileForm)) {

            if (props.userOriginalProfileForm?.[key] != props.userProfileForm?.[key]) {
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

    }, [props.userProfileForm])

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
            if (_err || error?.response?.data?.message || error?.response?.statusText) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText)
            }
            setRefreshing(false);
        });
    }, []);
    const [isMore, setIsMore] = useSafeState(true)
    const historyMemo = useMemo(() => {
        const _paymentHistory = props.paymentHistory?.length ? props.paymentHistory : []
        const _approvalHistory = props.approvalHistory?.length ? props.approvalHistory : []
       return [..._paymentHistory, ..._approvalHistory]?.filter(s => s?.remarks)
       /* return [
            {
                action: "test",
                remarks: "test",
                status: "pending",
                personnel: {
                    firstName: "test" ,
                    lastName: "test"
                }
            },
            {
                action: "test",
                remarks: "test.test..test.test.test.test.test.test.test.test.test.test.test.test.test.test",
                status: "pending",
                personnel: {
                    firstName: "test" ,
                    lastName: "test"
                }
            },
            {
                action: "test",
                remarks: "lorem",
                status: "Decline",
                personnel: {
                    firstName: "test" ,
                    lastName: "test"
                }
            },
            {
                action: "test",
                remarks: "test",
                status: "Pending",
                personnel: {
                    firstName: "test" ,
                    lastName: "test"
                }
            },
            {
                action: "test",
                remarks: "test",
                status: "pending",
                personnel: {
                    firstName: "test" ,
                    lastName: "test"
                }
            },
        ]?.filter((s, index) => (!isMore ? index === 0 : (s?.remarks && s?.action)))*/
    }, [props.paymentHistory, props.approvalHistory, isMore])

    return <View style={{flex: 1}}>
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
                showsVerticalScrollIndicator={false} ref={scrollRef}
                style={{width: "100%", backgroundColor: "#f8f8f8",}}>

                <View style={{flexDirection: isMobile || dimensions?.width <= 768 ? "column" : "row"}}>
                    {Platform.OS != "web" && <View style={styles.elevation}>
                        <View style={[styles.container, {marginVertical: 10}]}>
                            <View style={styles.group4}>
                                <Status user={user} paymentHistory={props.paymentHistory}
                                        approvalHistory={props?.approvalHistory} historyMemo={historyMemo} props={props}
                                        personnel={personnel} paymentHistory1={props?.paymentHistory}
                                        assignedPersonnel={props.assignedPersonnel}/>
                            </View>
                        </View>
                    </View>}

                    {Platform.OS != "web" && (historyMemo.length || ([CASHIER].indexOf(user?.role?.key) != -1 ? props.paymentHistory?.remarks : props?.approvalHistory?.remarks)) ? <View style={[styles.elevation, {marginVertical: 10,}]}>
                        <View style={[styles.container, {marginVertical: 10}]}>
                            <View style={styles.group4}>

                                <View style={styles.group3}>
                                    <View style={styles.group}>
                                        <View style={styles.rect}>
                                            <Text style={styles.header}>REMARKS</Text>
                                        </View>
                                    </View>
                                </View>
                                {
                                    ([CASHIER].indexOf(user?.role?.key) != -1 ? props.paymentHistory?.remarks : props?.approvalHistory?.remarks )  ?
                                        <>

                                            <View style={styles.group3}>

                                                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                                    <View style={{flexDirection: "row",  alignItems: "center",}}>
                                                        <View style={{paddingRight: 10}}>
                                                            <Text style={[{fontSize: fontValue(10), color: "#37405B"}]}>{`${personnel?.firstName} ${personnel?.lastName}`}</Text>
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
                                                                    getStatusText(props,personnel)?.toUpperCase()
                                                                }
                                                            </CustomText>
                                                        </View>
                                                    </View>
                                                    <Text style={{color: "#606A80", fontSize: fontValue(10)}}>{moment([CASHIER].indexOf(user?.role?.key) != -1 && props.paymentHistory ? (props?.paymentHistory?.time || props?.paymentHistory?.[0]?.time) : (props?.approvalHistory?.time || props?.approvalHistory?.[0]?.time)).fromNow()}</Text>
                                                </View>

                                                <CollapseText expandStyle={{color: "#565961"}}
                                                              textContainerStyle={ {} }
                                                              textStyle={[{fontSize: fontValue(12), fontFamily: Regular500, fontWeight: "500"}]}
                                                              text={[CASHIER].indexOf(user?.role?.key) != -1 && props.paymentHistory ? (props?.paymentHistory?.remarks || props?.paymentHistory?.[0]?.remarks) : (props?.approvalHistory?.remarks || props?.approvalHistory?.[0]?.remarks)}/>
                                                <IsMorePress onPress={() => {
                                                    isMoreRemark()
                                                    setIsMore((bool) => !bool)
                                                }} more={isMore}/>
                                            </View>
                                        </>

                                        : (!!(historyMemo.length) ? <View style={styles.group3}>


                                            <FlatList
                                                data={historyMemo}
                                                renderItem={({item, index}) => {

                                                    return <>
                                                        <View style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            justifyContent: "space-between"
                                                        }}>
                                                            <View style={{
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                paddingVertical: 5
                                                            }}>
                                                                <View style={{paddingRight: 10}}>
                                                                    <Text style={[{
                                                                        fontSize: fontValue(10),
                                                                        color: "#37405B"
                                                                    }]}>{`${item.personnel?.firstName} ${item.personnel?.lastName}`}</Text>
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
                                                                      textContainerStyle={index == historyMemo.length - 1 ? {} : {
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
                                                keyExtractor={item => item._id}
                                            />
                                            <IsMorePress onPress={() => setIsMore((bool) => !bool)} more={isMore}/>
                                        </View> : <></>)}

                            </View>
                        </View>
                    </View> : <></>}
                    <View style={isMobile || dimensions?.width <= 768 ? {padding: 10, alignSelf: "center"} : {
                        paddingLeft: 20,
                        paddingVertical: 20
                    }}>
                        <ProfileImage
                            size={fontValue(150)}
                            style={{borderRadius: 4}}

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
                        <View style={!(
                            isMobile) && {flex: 1, paddingRight: 10}}>
                            <View style={styles.elevation}>
                                <View style={[styles.container, {marginTop: 20}]}>
                                    <View style={styles.group4}>

                                        {Platform.OS == "web" &&
                                            <Status user={user} paymentHistory={props.paymentHistory}
                                                    approvalHistory={props?.approvalHistory} historyMemo={historyMemo}
                                                    props={props}
                                                    personnel={personnel} paymentHistory1={props?.paymentHistory}
                                                    assignedPersonnel={props.assignedPersonnel}/>}


                                        <View style={styles.group3}>
                                            <View style={styles.group}>
                                                <View style={styles.rect}>
                                                    <Text style={styles.header}>Basic Information</Text>
                                                </View>
                                            </View>

                                            <Row edit={props.edit} label={"Full Name:"}
                                                 stateName={"applicant.applicantName"}
                                                 updateForm={applicantForm}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 applicant={props.userProfileForm?.["applicant.applicantName"]}/>
                                            {props.userProfileForm?.["applicant.firstName"] ?
                                                <Row edit={props.edit} label={"First Name:"}
                                                     stateName={"applicant.firstName"}
                                                     updateForm={applicantForm}
                                                     show={false}
                                                     hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                     showEdit={true}
                                                     applicant={props.userProfileForm?.["applicant.firstName"]}/> : <></>}
                                            {props.userProfileForm?.["applicant.middleName"] ?
                                                <Row edit={props.edit} label={"Middle Name:"}
                                                     hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                     stateName={"applicant.middleName"}
                                                     updateForm={applicantForm}
                                                     show={false}
                                                     showEdit={true}
                                                     applicant={props.userProfileForm?.["applicant.middleName"]}/> : <></>}
                                            {props.userProfileForm?.["applicant.lastName"] ?
                                                <Row edit={props.edit} label={"Last Name:"}
                                                     hasChanges={props.hasChanges}
                                                     updateApplication={updateApplication}
                                                     updateForm={applicantForm}
                                                     stateName={"applicant.lastName"}

                                                     show={false}
                                                     showEdit={true}
                                                     applicant={props.userProfileForm?.["applicant.lastName"]}/> : <></>}


                                            <Row edit={props.edit} label={"Suffix:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.suffix"}
                                                 updateForm={applicantForm}
                                                 applicant={props.userProfileForm?.["applicant.suffix"]}/>
                                            <DateField edit={props.edit} label={"Date of Birth:"}
                                                       hasChanges={props.hasChanges}
                                                       updateApplication={updateApplication}
                                                       updateForm={applicantForm}
                                                       stateName={"applicant.dateOfBirth"}
                                                       display={moment(props.userProfileForm?.["applicant.dateOfBirth"])?.format('LL')}
                                                       applicant={props.userProfileForm?.["applicant.dateOfBirth"]}/>
                                            <Row updateForm={applicantForm}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.gender"}
                                                 edit={props.edit}
                                                 label={"Gender:"}
                                                 applicant={props.userProfileForm?.["applicant.gender"]}/>
                                            <Row updateForm={applicantForm}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.nationality"}
                                                 edit={props.edit}
                                                 label={"Nationality:"}
                                                 applicant={props.userProfileForm?.["applicant.nationality"]}/>
                                            <Row updateForm={applicantForm}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.weight"}
                                                 edit={props.edit}
                                                 label={"Weight:"}
                                                 applicant={props.userProfileForm?.["applicant.weight"]}/>
                                            <Row updateForm={applicantForm}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.height"}
                                                 edit={props.edit}
                                                 label={"Height:"}
                                                 applicant={props.userProfileForm?.["applicant.height"]}/>
                                        </View>
                                        {!!Object.values({...applicant?.address}).join("") &&
                                            <>
                                                <View style={styles.divider}/>
                                                <View style={styles.group3}>
                                                    <View style={styles.group}>
                                                        <View style={styles.rect}>
                                                            <Text style={styles.header}>Address</Text>
                                                        </View>
                                                    </View>


                                                    <Row edit={props.edit} label={"Unit/Rm/Bldg./Street:"}
                                                         hasChanges={props.hasChanges}
                                                         updateApplication={updateApplication}
                                                         stateName={"applicant.address.unit"}
                                                         updateForm={applicantForm}
                                                         applicant={props.userProfileForm['applicant.address.unit']}/>
                                                    <Row edit={props.edit} label={"Barangay:"}
                                                         hasChanges={props.hasChanges}
                                                         updateApplication={updateApplication}
                                                         stateName={"applicant.address.barangay"}
                                                         updateForm={applicantForm}
                                                         applicant={props.userProfileForm['applicant.address.barangay']}/>
                                                    <Row edit={props.edit} label={"Street:"}
                                                         hasChanges={props.hasChanges}
                                                         updateApplication={updateApplication}
                                                         stateName={"applicant.address.street"}
                                                         updateForm={applicantForm}
                                                         applicant={props.userProfileForm['applicant.address.street']}/>
                                                    <Row edit={props.edit} label={"Unit:"}
                                                         hasChanges={props.hasChanges}
                                                         updateApplication={updateApplication}
                                                         stateName={"applicant.address.unit"}
                                                         updateForm={applicantForm}
                                                         applicant={props.userProfileForm['applicant.address.unit']}/>
                                                    <Row edit={props.edit}
                                                         hasChanges={props.hasChanges}
                                                         updateApplication={updateApplication}
                                                         stateName={"applicant.address.province"}
                                                         updateForm={applicantForm}
                                                         label={"Province:"}
                                                         applicant={props.userProfileForm["applicant.address.province"]}/>
                                                    <Row updateForm={applicantForm}

                                                         hasChanges={props.hasChanges}
                                                         updateApplication={updateApplication}
                                                         stateName={"applicant.address.city"}
                                                         edit={props.edit} label={"City/Municipality:"}
                                                         applicant={props.userProfileForm?.["applicant.address.city"]}/>
                                                    <Row updateForm={applicantForm} edit={props.edit}
                                                         label={"Zip Code:"}
                                                         hasChanges={props.hasChanges}
                                                         updateApplication={updateApplication}
                                                         stateName={"applicant.address.zipCode"}
                                                         applicant={props.userProfileForm?.["applicant.address.zipCode"]}/>

                                                </View>
                                            </>

                                        }

                                        <View style={styles.divider}/>
                                        {applicant?.education && <View style={styles.group3}>
                                            <View style={styles.group}>
                                                <View style={styles.rect}>
                                                    <Text style={styles.header}>Educational Background</Text>
                                                </View>
                                            </View>
                                            <Row updateForm={applicantForm} edit={props.edit} label={"School Attended:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.education.schoolAttended"}
                                                 applicant={props.userProfileForm?.["applicant.address.zipCode"]}/>
                                            <Row updateForm={applicantForm} edit={props.edit} label={"Course Taken:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.education.courseTaken"}
                                                 applicant={props.userProfileForm?.["applicant.education.courseTaken"]}/>
                                            <Row updateForm={applicantForm} edit={props.edit} label={"Year Graduated:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.education.yearGraduated"}
                                                 applicant={props.userProfileForm?.["applicant.education.yearGraduated"]}/>


                                        </View>}
                                        {applicant?.education && <View style={styles.divider}/>}
                                        {applicant?.contact && <View style={styles.group3}>
                                            <View style={styles.group}>
                                                <View style={styles.rect}>
                                                    <Text style={styles.header}>Contact Details</Text>
                                                </View>
                                            </View>
                                            <Row updateForm={applicantForm} edit={props.edit} label={"Contact Number:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.contact.contactNumber"}
                                                 applicant={props.userProfileForm?.["applicant.contact.contactNumber"]}/>
                                            <Row updateForm={applicantForm} edit={props.edit} label={"Email:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.contact.email"}
                                                 applicant={props.userProfileForm?.["applicant.contact.email"]}/>


                                        </View>}
                                        {props?.schedule && <View style={styles.divider}/>}
                                        {props?.schedule && <View style={styles.group3}>
                                            {!props.edit && <View style={styles.group}>
                                                <View style={styles.rect}>
                                                    <Text style={styles.header}>SCHEDULE</Text>
                                                </View>
                                            </View>}

                                            <DateField edit={props.edit} label={"Date:"}
                                                /*show={true}
                                                showEdit={true}*/
                                                       updateForm={applicantForm}
                                                       hasChanges={props.hasChanges}
                                                       updateApplication={updateApplication}
                                                       stateName={"schedule.dateStart"}
                                                       applicant={props.userProfileForm?.["schedule.dateStart"]}
                                                       display={moment(props?.schedule.dateStart).isValid() ? moment(props?.schedule.dateStart).format('ddd DD MMMM YYYY') : props?.schedule.dateStart}/>
                                            <TimeField edit={props.edit} label={"Start Time:"}
                                                /*show={true}
                                                showEdit={false}*/
                                                       updateForm={applicantForm}
                                                       hasChanges={props.hasChanges}
                                                       updateApplication={updateApplication}
                                                       stateName={"schedule.dateStart"}
                                                       applicant={props.userProfileForm?.["schedule.dateStart"]}
                                                       display={moment(props?.schedule.dateStart)?.isValid() ? moment(props?.schedule.dateStart).format('LT') : props?.schedule.dateStart}/>
                                            <TimeField edit={props.edit} label={"End Time:"}
                                                /*show={true}
                                                showEdit={false}*/
                                                       hasChanges={props.hasChanges}
                                                       updateApplication={updateApplication}
                                                       updateForm={applicantForm}
                                                       stateName={"schedule.dateEnd"}
                                                       applicant={props.userProfileForm?.["schedule.dateEnd"]}
                                                       display={moment(props?.schedule.dateEnd)?.isValid() ? moment(props?.schedule.dateEnd).format('LT') : props?.schedule.dateEnd}/>
                                            <Row  /*show={true}
                                          showEdit={false} */
                                                updateForm={applicantForm}
                                                hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                stateName={"schedule.venue"}
                                                edit={props.edit}
                                                label={"Venue:"}
                                                applicant={props.userProfileForm?.["schedule.venue"]}/>
                                            <Row  /*show={true}
                                          showEdit={false}*/
                                                updateForm={applicantForm}
                                                hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                stateName={"schedule.seatNumber"}
                                                edit={props.edit}
                                                label={"Seat No:"}
                                                applicant={props.userProfileForm?.["schedule.seatNumber"]}/>


                                        </View>}
                                        {props?.service && <View style={styles.divider}/>}
                                        <RenderServiceMiscellaneous hasChanges={props.hasChanges}
                                                                    updateApplication={updateApplication}
                                                                    updateForm={applicantForm}
                                                                    userProfileForm={props.userProfileForm}
                                                                    edit={props.edit}
                                                                    exclude={['_id', 'name', 'applicationType', 'serviceCode']}
                                                                    service={props?.service}/>

                                    </View>

                                </View>

                            </View>
                        </View>

                    }

                </View>


            </ScrollView>

        </KeyboardAvoidingView>
    </View>
};

export default memo(BasicInfo)
