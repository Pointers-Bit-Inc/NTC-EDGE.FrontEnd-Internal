import React,{useEffect} from "react";
import {ScrollView,StyleSheet,Text,useWindowDimensions,View} from "react-native";
import {excludeStatus,getStatusText,statusColor,statusIcon} from "@pages/activities/script";
import ProfileImage from "@atoms/image/profile";
import CustomText from "@atoms/text";
import {APPROVED,DECLINED} from "../../../../reducers/activity/initialstate";
import moment from "moment";
import {Bold,Regular,Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import Row from "@pages/activities/application/Row"
import RenderServiceMiscellaneous from "@pages/activities/application/renderServiceMiscellaneous2";


const BasicInfo=(props:any)=>{
    let personnel:any=null;
    if(props){
        if(!!props?.paymentMethod&&props?.assignedPersonnel?._id){
            personnel=props?.assignedPersonnel
        } else if(props?.paymentStatus==APPROVED||props?.paymentStatus==DECLINED){
            personnel=props?.paymentHistory?.[0]?.personnel||props?.paymentHistory?.personnel;
        } else{
            personnel=props?.approvalHistory?.[0]?.personnel||props?.approvalHistory?.personnel;

        }
    }
    const applicant=props?.applicant?.user||props?.applicant;
    const dimensions=useWindowDimensions();
    return <ScrollView style={{width:"100%",backgroundColor:"#f8f8f8",}}>

        <View style={{flexDirection:isMobile||dimensions?.width<=768 ? "column" : "row"}}>
            <View style={isMobile||dimensions?.width<=768 ? {padding:10,alignSelf:"center"} : {
                paddingLeft:20,
                paddingVertical:20
            }}>
                <ProfileImage
                    size={fontValue(150)}
                    style={{borderRadius:4}}

                    textSize={22}
                    image={applicant.profilePicture?.small.match(/[^/]+(jpeg|jpg|png|gif)$/i) ? applicant.profilePicture?.small : applicant.profilePicture?.small+".png"}
                    name={`${applicant.firstName} ${applicant.lastName}`}
                />

                {(
                    dimensions?.width>=768)&&<View style={{paddingVertical:20}}>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#EFF0F6"}}>
                        <Text style={{
                            fontWeight:"bold",
                            fontFamily:Regular,
                            fontSize:12,
                            lineHeight:24,
                            color:"#565961"
                        }}>PHOTO</Text>
                    </View>
                </View>}

            </View>

            {props.applicant&&
            <View style={!(
                isMobile)&&{flex:1,paddingRight:10}}>
                <View style={styles.elevation}>
                    <View style={[styles.container,{marginTop:20}]}>
                        <View style={styles.group4}>
                            <View style={styles.group3}>
                                <View style={styles.group}>
                                    <View style={styles.rect}>
                                        <Text style={styles.header}>Status</Text>
                                    </View>
                                </View>

                                <View style={styles.status}>

                                    <View
                                        style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                        {
                                            statusIcon(
                                                getStatusText(props,personnel)
                                                ,
                                                styles.icon2,
                                                1
                                            )
                                        }
                                        <CustomText
                                            style={[
                                                styles.role,
                                                statusColor(
                                                    getStatusText(props,personnel)
                                                ),
                                                {
                                                    fontSize:fontValue(16),
                                                    fontFamily:Bold,
                                                }
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {
                                                getStatusText(props,personnel)?.toUpperCase()
                                            }
                                        </CustomText>
                                    </View>


                                    {personnel!=undefined&&
                                    (
                                        getStatusText(props,personnel)==APPROVED ? getStatusText(props,personnel) : !excludeStatus(props,personnel))&&
                                    <CustomText style={{fontSize:fontValue(12),flex:1,color:"#37405B"}}>
                                        {(
                                            personnel!==undefined ? `by ${personnel?.firstName} ${personnel?.lastName}` : ``)}

                                    </CustomText>}

                                </View>
                            </View>
                             <View style={styles.group3}>
                                <View style={styles.group}>
                                    <View style={styles.rect}>
                                        <Text style={styles.header}>Basic Information</Text>
                                    </View>
                                </View>
                                <Row label={"Full Name:"}
                                     applicant={applicant?.firstName  && applicant?.lastName ? applicant?.firstName+(applicant?.middleName ? " "+applicant?.middleName?.charAt()+"." : "")+" "+applicant?.lastName : ""}/>
                                <Row label={"Suffix:"}
                                     applicant={applicant?.suffix}/>
                                <Row label={"Date of Birth:"}
                                     applicant={ (applicant?.dateOfBirth?.year && applicant?.dateOfBirth?.month && applicant?.dateOfBirth?.day) ? moment(applicant?.dateOfBirth?.year+"-"+applicant?.dateOfBirth?.month+"-"+applicant?.dateOfBirth?.day)?.isValid() ? moment(applicant?.dateOfBirth?.year+"-"+applicant?.dateOfBirth?.month+"-"+applicant?.dateOfBirth?.day)?.format('LL') : "" : ""}/>
                                <Row label={"Gender:"} applicant={applicant?.gender||applicant?.sex}/>
                                <Row label={"Nationality:"} applicant={applicant?.nationality}/>
                                <Row label={"Weight:"} applicant={applicant?.weight}/>
                                <Row label={"Height:"} applicant={applicant?.height}/>
                            </View>
                            <View style={styles.divider}/>
                            <View style={styles.group3}>
                                <View style={styles.group}>
                                    <View style={styles.rect}>
                                        <Text style={styles.header}>Address</Text>
                                    </View>
                                </View>
                                <Row label={"Unit/Rm/Bldg./Street:"}
                                     applicant={applicant?.address?.unit||applicant?.unit}/>
                                <Row label={"Barangay:"} applicant={applicant?.address?.barangay||applicant?.barangay}/>
                                <Row label={"Province:"} applicant={applicant?.address?.province||applicant?.province}/>
                                <Row label={"City/Municipality:"}
                                     applicant={applicant?.address?.city||applicant?.city}/>
                                <Row label={"Zip Code:"} applicant={applicant?.address?.zipCode||applicant?.zipCode}/>

                            </View>
                            <View style={styles.divider}/>
                            {applicant?.education&&<View style={styles.group3}>
                                <View style={styles.group}>
                                    <View style={styles.rect}>
                                        <Text style={styles.header}>Educational Background</Text>
                                    </View>
                                </View>
                                <Row label={"School Attended:"} applicant={applicant?.education?.schoolAttended}/>
                                <Row label={"Course Taken:"} applicant={applicant?.education?.courseTaken}/>
                                <Row label={"Year Graduated:"} applicant={applicant?.education?.yearGraduated}/>


                            </View>}
                            {applicant?.education&&<View style={styles.divider}/>}
                            {applicant?.contact&&<View style={styles.group3}>
                                <View style={styles.group}>
                                    <View style={styles.rect}>
                                        <Text style={styles.header}>Contact Details</Text>
                                    </View>
                                </View>
                                <Row label={"Contact Number:"} applicant={applicant?.contact?.contactNumber}/>
                                <Row label={"Email:"} applicant={applicant?.contact?.email}/>


                            </View>}
                            {props?.schedule&&<View style={styles.divider}/>}
                            {props?.schedule&&<View style={styles.group3}>
                                <View style={styles.group}>
                                    <View style={styles.rect}>
                                        <Text style={styles.header}>SCHEDULE</Text>
                                    </View>
                                </View>
                                <Row label={"Date:"}
                                     applicant={moment(props?.schedule.dateStart).isValid() ? moment(props?.schedule.dateStart).format('ddd DD MMMM YYYY') : props?.schedule.dateStart}/>
                                <Row label={"Start Time:"}
                                     applicant={moment(props?.schedule.dateStart)?.isValid() ? moment(props?.schedule.dateStart).format('LT') : props?.schedule.dateStart}/>
                                <Row label={"End Time:"}
                                     applicant={moment(props?.schedule.dateEnd)?.isValid() ? moment(props?.schedule.dateEnd).format('LT') : props?.schedule.dateEnd}/>
                                <Row label={"Venue:"} applicant={props?.schedule.venue}/>
                                <Row label={"Seat No:"} applicant={props?.schedule.seatNumber}/>


                            </View>}
                            {props?.schedule&&<View style={styles.divider}/>}
                            <RenderServiceMiscellaneous exclude={['_id','name','applicationType','serviceCode']}
                                                        service={props?.service}/>
                        </View>

                    </View>

                </View>
            </View>

            }
        </View>

    </ScrollView>

};
const styles=StyleSheet.create({
    elevation:{
        marginVertical:20,
        borderRadius:5,
        alignSelf:"center",
        width:"90%",
        backgroundColor:"#fff",
        shadowColor:"rgba(0,0,0,1)",
        shadowOffset:{
            height:0,
            width:0
        },
        elevation:6,
        shadowOpacity:0.2,
        shadowRadius:2,
    },
    icon2:{
        color:"rgba(248,170,55,1)",
        fontSize:fontValue(10)
    },
    role:{

        fontFamily:Bold,
        fontSize:fontValue(14),
        textAlign:"left",
        paddingHorizontal:fontValue(10)
    },
    submitted:{
        color:"rgba(105,114,135,1)",
        textAlign:"right",
        fontSize:fontValue(10)
    },
    container:{
        flex:1
    },
    group4:{},
    group3:{
        paddingRight:fontValue(10),
        paddingLeft:fontValue(10)
    },
    group:{},
    rect:{},
    header:{
        backgroundColor:"#EFF0F6",
        textTransform:'uppercase',
        fontSize:fontValue(12),
        fontFamily:Regular500,
        color:"#565961",
        padding:5,
        marginLeft:5
    },
    group2:{
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        marginTop:8,
        paddingHorizontal:10,
        fontSize:fontValue(12)
    },
    detail:{
        fontSize:fontValue(14),
        fontFamily:Regular,
        paddingRight:0,
        textAlign:"left",
        flex:1,
        alignSelf:"flex-start"
    },
    detailInput:{
        fontSize:fontValue(14),
        fontFamily:Regular500,
        color:"#121212",
        flex:1,
        textAlign:"left"
    },
    divider:{
        padding:2,
        paddingBottom:20
    },
    status:{

        flexDirection:'row',
        flexWrap:"wrap",
        justifyContent:"center",
        alignItems:"center",
        paddingVertical:15,
        paddingLeft:10
    }
});
export default BasicInfo