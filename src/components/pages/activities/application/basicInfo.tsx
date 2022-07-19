import React, {memo, useEffect, useMemo, useRef} from "react";
import {FlatList, Platform, RefreshControl, ScrollView, Text, useWindowDimensions, View} from "react-native";
import {excludeStatus, getStatusText, remarkColor, statusColor, statusIcon} from "@pages/activities/script";
import ProfileImage from "@atoms/image/profile";
import CustomText from "@atoms/text";
import {APPROVED, CASHIER, DECLINED} from "../../../../reducers/activity/initialstate";
import moment from "moment";
import {Bold, Regular} from "@styles/font";
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


const BasicInfo = (props: any) => {

    const personnel = useMemo(()=>{
        var _personnel = ''
        if (!!props?.paymentMethod && props?.assignedPersonnel?._id) {
            _personnel = props?.assignedPersonnel
        } else if (props?.paymentStatus == APPROVED || props?.paymentStatus == DECLINED) {
            _personnel = props?.paymentHistory?.[0]?.personnel || props?.paymentHistory?.personnel;
        } else {
            _personnel = props?.approvalHistory?.[0]?.personnel || props?.approvalHistory?.personnel;

        }
        return _personnel
    }, [props?.paymentMethod, props?.paymentHistory, props?.approvalHistory, props?.paymentStatus ])




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
    const {showToast, hideToast}=useToast();
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        hideToast()
        showToast(ToastType.Info, <ToastLoading/>)
        axios.get(BASE_URL + "/applications/" + props.id, {headers:{
            Authorization:"Bearer ".concat(user?.sessionToken)
        }}).then(() => {
            hideToast()

            showToast(ToastType.Success,"Successfully updated!")
            setRefreshing(false);
        }).catch((error)=>{
            hideToast()
            let _err='';

            for(const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if(_err || error?.response?.data?.message ||error?.response?.statusText){
                showToast(ToastType.Error,_err || error?.response?.data?.message ||error?.response?.statusText)
            }
            setRefreshing(false);
        });
    }, []);

    const historyMemo = useMemo(()=>{
        const _paymentHistory =  props.paymentHistory?.length  ? props.paymentHistory : []
        const _approvalHistory =  props.approvalHistory?.length  ? props.approvalHistory : []
        return [..._paymentHistory, ..._approvalHistory]?.filter(s => s?.remarks)
    }, [props.paymentHistory, props.approvalHistory ])


    return <>
        {props.loading && <LoadingModal/>}
        <ScrollView keyboardShouldPersistTaps={Platform.OS == "ios" ? "handled" : "always"}
                         refreshControl={
                             <RefreshControl
                                 refreshing={refreshing}
                                 onRefresh={onRefresh}
                             />
                         }
                         showsVerticalScrollIndicator={false} ref={scrollRef}
                         style={{width: "100%", backgroundColor: "#f8f8f8",}}>

        <View style={{flexDirection: isMobile || dimensions?.width <= 768 ? "column" : "row"}}>
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
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#EFF0F6"}}>
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
                                <View style={styles.group3}>
                                    <View style={styles.group}>
                                        <View style={styles.rect}>
                                            <Text style={styles.header}>Status</Text>
                                        </View>
                                    </View>
                                    <View style={{paddingVertical: 15}}>
                                        {<View style={[styles.status, {paddingBottom: !!props.remarks ? 7.5 : 0}]}>

                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>
                                                {
                                                    statusIcon(
                                                        getStatusText(props, personnel)
                                                        ,
                                                        styles.icon2,
                                                        1
                                                    )
                                                }
                                                <CustomText
                                                    style={[
                                                        styles.role,
                                                        statusColor(
                                                            getStatusText(props, personnel)
                                                        ),
                                                        {
                                                            fontSize: fontValue(16),
                                                            fontFamily: Bold,
                                                        }
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {
                                                        getStatusText(props, personnel)?.toUpperCase()
                                                    }
                                                </CustomText>
                                            </View>


                                            {personnel != undefined &&
                                                (
                                                    getStatusText(props, personnel) == APPROVED ? getStatusText(props, personnel) : (!excludeStatus(props, personnel) || ([CASHIER].indexOf(user?.role?.key) != -1 ? !!(props?.paymentHistory?.remarks || props?.paymentHistory?.[0]?.remarks) :( props?.approvalHistory?.remarks || props?.approvalHistory?.[0]?.remarks)))) ?
                                                <CustomText
                                                    style={{fontSize: fontValue(12), flex: 1, color: "#37405B"}}>
                                                    {(
                                                        personnel !== undefined ? `by ${personnel?.firstName} ${personnel?.lastName}` : ``)}

                                                </CustomText> : <View/>}

                                        </View> }
                                        {
                                            ([CASHIER].indexOf(user?.role?.key) != -1 ? props.paymentHistory?.remarks : props?.approvalHistory?.remarks ) ?
                                            <>

                                                <View style={styles.group3}>
                                                <View style={[styles?.remarksContainer, {
                                                    borderColor: remarkColor(
                                                        getStatusText(props, personnel)
                                                    )
                                                }]}>
                                                    <Text style={[styles?.remarksTitle, {
                                                        color: remarkColor(
                                                            getStatusText(props, personnel)
                                                        )
                                                    }]}>{getStatusText(props, personnel) === DECLINED ? 'NOD/' : ''}Remarks</Text>
                                                    <Text style={[styles?.remarksContent, statusColor(
                                                        getStatusText(props, personnel)
                                                    )]}>{[CASHIER].indexOf(user?.role?.key) != -1 && props.paymentHistory ? (props?.paymentHistory?.remarks || props?.paymentHistory?.[0]?.remarks) : (props?.approvalHistory?.remarks || props?.approvalHistory?.[0]?.remarks)}</Text>

                                                </View>
                                            </View>
                                            </>

                                                :  (!!(historyMemo.length) ?<View style={styles.group3}>
                                                    <View style={[styles?.remarksContainer, {
                                                        borderColor: remarkColor(
                                                            getStatusText(props, personnel)
                                                        ),
                                                    }]}>
                                                        <Text style={[styles?.remarksTitle, {
                                                            color: remarkColor(
                                                                getStatusText(props, personnel)
                                                            )
                                                        }]}>{getStatusText(props, personnel) === DECLINED ? 'NOD/' : ''}Remarks</Text><FlatList
                                                    data={historyMemo}
                                                    renderItem={({ item, index })=>{

                                                        return <>


                                                                <View style={{flexDirection: "row",borderTopWidth: index === 0 ? 0 : 1, borderTopColor: "#EFEFEF" }}>
                                                                    <View style={{flex: 0.5}}>
                                                                        <Text style={[styles?.remarksContent, statusColor(
                                                                            item?.status
                                                                        )]}>{item?.remarks}</Text>
                                                                    </View>

<View style={{flex: 0.5}}>
    {(item?.personnel?.firstName && item?.personnel?.lastName) ? <Text style={[styles?.remarksContent, {color: "#565961"}]}>{`by: ${item?.personnel?.firstName} ${item?.personnel?.lastName}`}</Text> : <></>}
</View>

                                                                </View>

                                                            </>
                                                    }
                                                    }
                                                    keyExtractor={item => item._id}
                                                /></View>
                                                </View> : <></>)}
                                    </View>

                                </View>

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
                                               hasChanges={props.hasChanges} updateApplication={updateApplication}
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
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.address.unit"}
                                                 updateForm={applicantForm}
                                                 applicant={props.userProfileForm['applicant.address.unit']}/>
                                            <Row edit={props.edit} label={"Barangay:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.address.barangay"}
                                                 updateForm={applicantForm}
                                                 applicant={props.userProfileForm['applicant.address.barangay']}/>
                                            <Row edit={props.edit} label={"Street:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.address.street"}
                                                 updateForm={applicantForm}
                                                 applicant={props.userProfileForm['applicant.address.street']}/>
                                            <Row edit={props.edit} label={"Unit:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.address.unit"}
                                                 updateForm={applicantForm}
                                                 applicant={props.userProfileForm['applicant.address.unit']}/>
                                            <Row edit={props.edit}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.address.province"}
                                                 updateForm={applicantForm}
                                                 label={"Province:"}
                                                 applicant={props.userProfileForm["applicant.address.province"]}/>
                                            <Row updateForm={applicantForm}

                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
                                                 stateName={"applicant.address.city"}
                                                 edit={props.edit} label={"City/Municipality:"}
                                                 applicant={props.userProfileForm?.["applicant.address.city"]}/>
                                            <Row updateForm={applicantForm} edit={props.edit} label={"Zip Code:"}
                                                 hasChanges={props.hasChanges} updateApplication={updateApplication}
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
                                    {!props.edit &&<View style={styles.group}>
                                        <View style={styles.rect}>
                                            <Text style={styles.header}>SCHEDULE</Text>
                                        </View>
                                    </View>}

                                    <DateField edit={props.edit} label={"Date:"}
                                               /*show={true}
                                               showEdit={true}*/
                                               updateForm={applicantForm}
                                               hasChanges={props.hasChanges} updateApplication={updateApplication}
                                               stateName={"schedule.dateStart"}
                                               applicant={props.userProfileForm?.["schedule.dateStart"]}
                                               display={moment(props?.schedule.dateStart).isValid() ? moment(props?.schedule.dateStart).format('ddd DD MMMM YYYY') : props?.schedule.dateStart}/>
                                    <TimeField edit={props.edit} label={"Start Time:"}
                                               /*show={true}
                                               showEdit={false}*/
                                               updateForm={applicantForm}
                                               hasChanges={props.hasChanges} updateApplication={updateApplication}
                                               stateName={"schedule.dateStart"}
                                               applicant={props.userProfileForm?.["schedule.dateStart"]}
                                               display={moment(props?.schedule.dateStart)?.isValid() ? moment(props?.schedule.dateStart).format('LT') : props?.schedule.dateStart}/>
                                    <TimeField edit={props.edit} label={"End Time:"}
                                               /*show={true}
                                               showEdit={false}*/
                                               hasChanges={props.hasChanges} updateApplication={updateApplication}
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
                                                            userProfileForm={props.userProfileForm} edit={props.edit}
                                                            exclude={['_id', 'name', 'applicationType', 'serviceCode']}
                                                            service={props?.service}/>

                            </View>

                        </View>

                    </View>
                </View>

            }

        </View>


    </ScrollView>


    </>
};

export default memo(BasicInfo)
