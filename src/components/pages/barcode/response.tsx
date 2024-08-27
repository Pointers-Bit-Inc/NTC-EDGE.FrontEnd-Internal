import {ScrollView,Text,Animated,TouchableOpacity,View,Modal} from "react-native";
import CheckMarkIcon from "@assets/svg/checkmark";
import CloseIcon from "@assets/svg/close";
import ErrorIcon from "@assets/svg/erroricon";
import React,{useEffect} from "react";
import ProfileImage from "@components/atoms/image/profile";
import dayjs from "dayjs";
import {styles} from "@pages/barcode/styles";
import {useAlert} from "../../../hooks/useAlert";
import EvaluationStatus from "@assets/svg/evaluationstatus";
import {fontValue} from "@pages/activities/fontValue";
import moment from "moment";

function Row(props:{label:any, input: any}){
    return props?.input ? <View style={styles.group18}>
        <View style={{flex:0.3}}>
            <Text style={styles.name2}>{props?.label}</Text>
        </View>
        <View style={{flex:0.9}}>
            <Text style={styles.name3}>{props?.input}</Text>
        </View>
    </View> : <></>;
}

export function Response(props: { verifiedInfo: any, verified: boolean, onPress: () => void, error: boolean, onPress1: () => void }) {
    const getFullName = (user) => {
        return `${user?.firstName} ${user?.middleName} ${user?.lastName}`;
    }
    const getFullAddress = (applicant:any = {}) => {
        const { street, barangay, city, province } = applicant;
        let result = '';
        if (street) result += street;
        if (barangay) result += `, ${barangay}`;
        if (city) result += `, ${city}`;
        if (province) result += `, ${province}`;
        return result;
    }
    const applicant =  props?.verifiedInfo?.application?.applicant;
    const schedule =  props?.verifiedInfo?.application?.schedule;
    const education =  props?.verifiedInfo?.application?.education;
    const approvalHistory =  props?.verifiedInfo?.application?.approvalHistory;
    
    return <>
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.verified }
            onRequestClose={()=>{
                props.onPress()
            }}
        >
            {<View style={[styles.group32,{paddingHorizontal:20}]}>
                <View style={styles.rect13}>
                    <View style={styles.group30}>
                        <View
                            style={[styles.rect14,{backgroundColor:props?.verifiedInfo?.status=="valid" ? "rgba(0,171,118,0.1)" : "rgba(247, 158, 27, 0.1)",}]}>
                            <View style={styles.group33}>
                                <View style={{width:"33.33%"}}>
                                    <View style={styles.group12}>

                                        {props?.verifiedInfo?.status=="valid" ?
                                         <CheckMarkIcon width={fontValue(20)} height={fontValue(20)}></CheckMarkIcon> :
                                         <View style={{paddingRight:10}}>
                                             <View style={{top:2}}><EvaluationStatus width={fontValue(17)}
                                                                                     height={fontValue(20)}></EvaluationStatus></View>
                                         </View>}

                                        <Text
                                            style={[styles.verified,{color:props?.verifiedInfo?.status=="valid" ? "rgba(0,171,118,1)" : "#F7771B",}]}>{props?.verifiedInfo?.status=="valid" ? "Verified" : "Unverified"}</Text>
                                    </View>
                                </View>


                                <TouchableOpacity onPress={props.onPress} style={styles.rect18}>
                                    <CloseIcon style={{alignSelf:"flex-end"}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={{paddingVertical:10}}>
                        {(applicant?.firstName ||applicant?.lastName) && <ProfileImage
                            style={{borderRadius:5,alignSelf:'center'}}
                            size={130}
                            textSize={50}
                            image={applicant?.profilePicture?.small}
                            name={`${applicant?.firstName} ${applicant?.lastName}`}
                        />}
                        <View style={[{paddingHorizontal:10,paddingVertical:15}]}>
                            {applicant && <View style={[styles.group17]}>
                                <Text style={styles.examDetails}>BASIC INFO</Text>
                                <Row input={(applicant?.firstName || applicant?.middleName || applicant?.lastName) &&  getFullName(applicant)} label={'Name: '}/>
                                <Row input={getFullAddress(applicant?.address)} label={'Address: '}/>
                            </View>}
                            {schedule && <View style={styles.group17}>
                               <Text style={styles.examDetails}>EXAM DETAILS</Text>
                                <Row input={schedule?.venue} label={"Venue: "}/>
                                <Row input={schedule?.seatNumber} label={"Seat No.: "}/>
                                <Row input={schedule?.dateEnd && dayjs(schedule?.dateStart).format('MM/DD/YY')} label={"Date: "}/>
                                <Row input={schedule?.dateStart && `${moment(schedule?.dateStart).format('hh:mm:ss a')} - ${moment(schedule?.dateEnd)?.format('hh:mm:ss a')}`} label={"Time: "}/>
                            </View>}
                            {(approvalHistory || props?.verifiedInfo?.application?.ORNumber || props?.verifiedInfo?.application?.totalFee) &&  <View style={styles.group17}>
                                <Text style={styles.examDetails}>PAYMENT DETAILS</Text>
                                <Row input={props?.verifiedInfo?.application?.ORNumber && props?.verifiedInfo?.application?.ORNumber} label={"O.R. No.: "}/>
                                <Row input={props?.verifiedInfo?.application?.totalFee && `PHP ${parseFloat(props?.verifiedInfo?.application?.totalFee||0).toFixed(2)}`} label={'Amount: '}/>
                                <Row input={(
                                                approvalHistory?.[0]||approvalHistory)?.status==='Approved' ? dayjs((
                                    approvalHistory?.[0]||approvalHistory)?.time).format('MM/DD/YY') : null} label={'Date: '}/>

                            </View>}
                            {education && <View style={styles.group17}>
                                <Text style={styles.examDetails}>EDUCATION</Text>
                                <Row input={education?.schoolAttended} label={"School Attended: "}/>
                                <Row input={education?.courseTaken} label={'Course: '}/>
                                <Row input={education?.yearGraduated} label={'Year Graduated: '}/>

                            </View> }
                        </View>
                    </ScrollView>
                </View>
            </View> }
        </Modal>
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.error}
            onRequestClose={()=>{
                props.onPress1()
            }}
        ><View style={[styles.group11,]}>
            <View style={styles.errorContainer}>
                <View style={styles.group10}>
                    <View style={styles.rect6}>
                        <ErrorIcon></ErrorIcon>
                    </View>

                    <Text style={styles.invalidQrCode}>Invalid QR Code</Text>
                    <View style={styles.group9}>
                        <View style={styles.rect9}>
                            <Text style={styles.pleaseTryAgain}>Please try again</Text>
                        </View>
                    </View>

                </View>
            </View>
            <View style={styles.group8}>
                <TouchableOpacity onPress={props.onPress1} style={styles.rect12}>
                    <Text style={styles.close}>CLOSE</Text>
                </TouchableOpacity>
            </View>
        </View>
        </Modal>
    </>;
}