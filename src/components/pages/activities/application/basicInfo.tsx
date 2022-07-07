import React, {useEffect, useRef, useState} from "react";
import {BackHandler, Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {excludeStatus, getStatusText, remarkColor, statusColor, statusIcon} from "@pages/activities/script";
import ProfileImage from "@atoms/image/profile";
import CustomText from "@atoms/text";
import {APPROVED, DECLINED} from "../../../../reducers/activity/initialstate";
import moment from "moment";
import {Bold, Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import Row from "@pages/activities/application/Row"
import RenderServiceMiscellaneous from "@pages/activities/application/renderServiceMiscellaneous2";
import styles from "@styles/applications/basicInfo"
import useSafeState from "../../../../hooks/useSafeState";
import axios from "axios";
import {BASE_URL} from "../../../../services/config";
import {RootStateOrAny, useSelector} from "react-redux";
import { FloatingAction } from "react-native-floating-action";
const flatten = require('flat')
import Check from "@assets/svg/check";
import Alert from "@atoms/alert";


const BasicInfo = (props: any) => {

    let personnel: any = null;
    if (props) {
        if (!!props?.paymentMethod && props?.assignedPersonnel?._id) {
            personnel = props?.assignedPersonnel
        } else if (props?.paymentStatus == APPROVED || props?.paymentStatus == DECLINED) {
            personnel = props?.paymentHistory?.[0]?.personnel || props?.paymentHistory?.personnel;
        } else {
            personnel = props?.approvalHistory?.[0]?.personnel || props?.approvalHistory?.personnel;

        }
    }
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
    const user=useSelector((state:RootStateOrAny)=>state.user);
    const dimensions = useWindowDimensions();


    const hasChanges=()=> {
        var hasChanges=false;

        for (const [key, value] of Object.entries(props.userOriginalProfileForm)) {

            if (props.userOriginalProfileForm?.[key] != props.userProfileForm?.[key]) {
                hasChanges = true
                props.hasChanges(hasChanges)
                return
            }else{
                hasChanges = false
                props.hasChanges(hasChanges)
            }
        }


    }


    useEffect(()=>{
        hasChanges()

    }, [props.userProfileForm])

    const actions = [
        {
            text: "Accessibility",
            icon: <Check color={"#fff"}/>,
            name: "bt_accessibility",
            position: 1,
            color: "#fff"
        }
    ];

    const updateApplication = () =>{
        let profileForm = {...props.userProfileForm}
        let dateOfBirth= profileForm?.['applicant.dateOfBirth'], dateValue = { year: "", month: "", day: ""}
       if(typeof dateOfBirth == 'string'){
           let dateOfBirthSplit = dateOfBirth?.split('-')
           dateValue.year = dateOfBirthSplit[0]
           dateValue.month = dateOfBirthSplit[1]
           dateValue.day = dateOfBirthSplit[2]
           profileForm['applicant.dateOfBirth'] = dateValue
       }

        axios.patch(BASE_URL + `/applications/${props.id}`, flatten.unflatten(profileForm), {headers:{
                Authorization:"Bearer ".concat(user?.sessionToken)
            }}).then( (response) => {
            setShowAlert(true)
        });
    }
    const showAlertFn = () => {
        setShowAlert(true)
    };

    const hideAlert = () => {
       setShowAlert(false)
    };
    return <><ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}
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
                                        <View style={[styles.status, {paddingBottom: !!props.remarks ? 7.5 : 0}]}>

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
                                                    getStatusText(props, personnel) == APPROVED ? getStatusText(props, personnel) : !excludeStatus(props, personnel)) &&
                                                <CustomText
                                                    style={{fontSize: fontValue(12), flex: 1, color: "#37405B"}}>
                                                    {(
                                                        personnel !== undefined ? `by ${personnel?.firstName} ${personnel?.lastName}` : ``)}

                                                </CustomText>}

                                        </View>
                                        {
                                            !!(props?.approvalHistory?.remarks || props?.approvalHistory?.[0]?.remarks) &&
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
                                                    )]}>{props?.approvalHistory?.remarks || props?.approvalHistory?.[0]?.remarks}</Text>
                                                </View>
                                            </View>

                                        }
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
                                         show={true}
                                         showEdit={false}
                                         applicant={applicant?.firstName && applicant?.lastName ? applicant?.firstName + (applicant?.middleName ? " " + applicant?.middleName?.charAt() + "." : "") + " " + applicant?.lastName : applicant?.applicantName ? applicant?.applicantName : ""}/>
                                    {props.userProfileForm?.["applicant.firstName"] ?
                                        <Row edit={props.edit} label={"First Name:"}
                                             stateName={"applicant.firstName"}
                                             updateForm={applicantForm}
                                             show={false}
                                             showEdit={true}
                                             applicant={props.userProfileForm?.["applicant.firstName"]}/> : <></>}
                                    {props.userProfileForm?.["applicant.middleName"] ?
                                        <Row edit={props.edit} label={"Middle Name:"}
                                             stateName={"applicant.middleName"}
                                             updateForm={applicantForm}
                                             show={false}
                                             showEdit={true}
                                             applicant={props.userProfileForm?.["applicant.middleName"]}/> : <></>}
                                    {props.userProfileForm?.["applicant.lastName"] ?
                                        <Row edit={props.edit} label={"Last Name:"}
                                             stateName={"applicant.lastName"}
                                             updateForm={applicantForm}
                                             show={false}
                                             showEdit={true}
                                             applicant={props.userProfileForm?.["applicant.lastName"]}/> : <></>}


                                    <Row edit={props.edit} label={"Suffix:"}
                                         stateName={"applicant.suffix"}
                                         updateForm={applicantForm}
                                         applicant={props.userProfileForm?.["applicant.suffix"]}/>
                                    <Row edit={props.edit} label={"Date of Birth:"}
                                         updateForm={applicantForm}
                                         display={moment(props.userProfileForm?.["applicant.dateOfBirth"])?.format('LL')}
                                         applicant={props.userProfileForm?.["applicant.dateOfBirth"]}/>
                                    <Row edit={props.edit} label={"Date of Birth:"}
                                         show={true}
                                         showEdit={false}
                                         applicant={(applicant?.dateOfBirth?.year && applicant?.dateOfBirth?.month && applicant?.dateOfBirth?.day) ? moment(applicant?.dateOfBirth?.year + "-" + applicant?.dateOfBirth?.month + "-" + applicant?.dateOfBirth?.day)?.isValid() ? moment(applicant?.dateOfBirth?.year + "-" + applicant?.dateOfBirth?.month + "-" + applicant?.dateOfBirth?.day)?.format('LL') : "" : ""}/>
                                    <Row updateForm={applicantForm}
                                         stateName={"applicant.gender"}
                                         edit={props.edit}
                                         label={"Gender:"}
                                         applicant={props.userProfileForm?.["applicant.gender"]}/>
                                    <Row updateForm={applicantForm}
                                         stateName={"applicant.nationality"}
                                         edit={props.edit}
                                         label={"Nationality:"}
                                         applicant={props.userProfileForm?.["applicant.nationality"]}/>
                                    <Row updateForm={applicantForm}
                                         stateName={"applicant.weight"}
                                         edit={props.edit}
                                         label={"Weight:"}
                                         applicant={props.userProfileForm?.["applicant.weight"]}/>
                                    <Row updateForm={applicantForm}
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
                                                 stateName={"applicant.address.unit"}
                                                 updateForm={applicantForm}
                                                 applicant={props.userProfileForm['applicant.address.unit']}/>
                                            <Row edit={props.edit} label={"Barangay:"}
                                                 stateName={"applicant.address.barangay"}
                                                 updateForm={applicantForm}
                                                 applicant={props.userProfileForm['applicant.address.barangay']}/>
                                            <Row edit={props.edit} label={"Street:"}
                                                 stateName={"applicant.address.street"}
                                                 updateForm={applicantForm}
                                                 applicant={props.userProfileForm['applicant.address.street']}/>
                                            <Row edit={props.edit} label={"Unit:"}
                                                 stateName={"applicant.address.unit"}
                                                 updateForm={applicantForm}
                                                 applicant={props.userProfileForm['applicant.address.unit']}/>
                                            <Row edit={props.edit}
                                                 stateName={"applicant.address.province"}
                                                 updateForm={applicantForm}
                                                 label={"Province:"}
                                                 applicant={props.userProfileForm["applicant.address.province"]}/>
                                            <Row updateForm={applicantForm}
                                                 stateName={"applicant.address.city"}
                                                 edit={props.edit} label={"City/Municipality:"}
                                                 applicant={props.userProfileForm?.["applicant.address.city"]}/>
                                            <Row updateForm={applicantForm} edit={props.edit} label={"Zip Code:"}
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
                                         stateName={"applicant.education.schoolAttended"}
                                         applicant={props.userProfileForm?.["applicant.address.zipCode"]}/>
                                    <Row updateForm={applicantForm} edit={props.edit} label={"Course Taken:"}
                                         stateName={"applicant.education.courseTaken"}
                                         applicant={props.userProfileForm?.["applicant.education.courseTaken"]}/>
                                    <Row updateForm={applicantForm} edit={props.edit} label={"Year Graduated:"}
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
                                         stateName={"applicant.contact.contactNumber"}
                                         applicant={props.userProfileForm?.["applicant.contact.contactNumber"]}/>
                                    <Row updateForm={applicantForm} edit={props.edit} label={"Email:"}
                                         stateName={"applicant.contact.email"}
                                         applicant={props.userProfileForm?.["applicant.contact.email"]}/>


                                </View>}
                                {props?.schedule && <View style={styles.divider}/>}
                                {props?.schedule && <View style={styles.group3}>
                                    <View style={styles.group}>
                                        <View style={styles.rect}>
                                            <Text style={styles.header}>SCHEDULE</Text>
                                        </View>
                                    </View>

                                    <Row edit={props.edit} label={"Date:"}
                                         updateForm={applicantForm}
                                         stateName={"schedule.dateStart"}
                                         applicant={props.userProfileForm?.["schedule.dateStart"]}
                                         display={moment(props?.schedule.dateStart).isValid() ? moment(props?.schedule.dateStart).format('ddd DD MMMM YYYY') : props?.schedule.dateStart}/>
                                    <Row edit={props.edit} label={"Start Time:"}
                                         updateForm={applicantForm}
                                         show={true}
                                         showEdit={false}
                                         stateName={"schedule.dateStart"}
                                         applicant={props.userProfileForm?.["schedule.dateStart"]}
                                         display={moment(props?.schedule.dateStart)?.isValid() ? moment(props?.schedule.dateStart).format('LT') : props?.schedule.dateStart} />
                                    <Row edit={props.edit} label={"End Time:"}
                                         updateForm={applicantForm}
                                         stateName={"schedule.dateEnd"}
                                         applicant={props.userProfileForm?.["schedule.dateEnd"]}
                                         display={moment(props?.schedule.dateEnd)?.isValid() ? moment(props?.schedule.dateEnd).format('LT') : props?.schedule.dateEnd}/>
                                    <Row updateForm={applicantForm}
                                         stateName={"schedule.venue"}
                                         edit={props.edit}
                                         label={"Venue:"}
                                         applicant={props.userProfileForm?.["schedule.venue"]}/>
                                    <Row updateForm={applicantForm}
                                         stateName={"schedule.seatNumber"}
                                         edit={props.edit}
                                         label={"Seat No:"}
                                         applicant={props.userProfileForm?.["schedule.seatNumber"]}/>


                                </View>}
                                {props?.service && <View style={styles.divider}/>}
                                <RenderServiceMiscellaneous updateForm={applicantForm} userProfileForm={props.userProfileForm} edit={props.edit}
                                                            exclude={['_id', 'name', 'applicationType', 'serviceCode']}
                                                            service={props?.service}/>


                            </View>

                        </View>

                    </View>
                </View>

            }

        </View>



    </ScrollView>
        <Alert
            visible={showAlert}
            title={'Success'}
            message={'The Application has been updated!'}
            confirmText='OK'
            onConfirm={() => {
                setShowAlert(false)
            }
            }
        />
        <FloatingAction

            visible={props.edit}
            actions={actions}
            overrideWithAction
            onPressItem={name => {

                updateApplication()
            }}
        />
</>
};

export default BasicInfo