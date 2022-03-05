import React from "react";
import {ActivityIndicator , Dimensions , ScrollView , StyleSheet , Text , View} from "react-native";
import {
    excludeStatus , fontValue ,
    getRole ,
    getStatusText ,
    PaymentStatusText ,
    statusColor ,
    statusIcon ,
    StatusText
} from "@pages/activities/script";
import ProfileImage from "@atoms/image/profile";
import CustomText from "@atoms/text";
import {
    APPROVED , DECLINED , FORAPPROVAL
} from "../../../../reducers/activity/initialstate";
import {useAssignPersonnel} from "@pages/activities/hooks/useAssignPersonnel";
import moment from "moment";
import {Bold , Regular , Regular500} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";

const { width , height } = Dimensions.get("screen");



const Row = (props: { label: string, applicant: any }) => <View style={ styles.group2 }>
    <Text style={ styles.detail }>{ props.label }</Text>
    <Text style={ styles.detailInput }>{ props.applicant }</Text>
</View>;


const BasicInfo = (props: any) => {
    const {
        personnel ,
        loading
    } = useAssignPersonnel( !!props.paymentMethod && props.assignedPersonnel ?
                            props.assignedPersonnel : (props.paymentStatus == APPROVED || props.paymentStatus == DECLINED ?
                            (props?.paymentHistory?.[0]?.userId ) :
                            (props?.approvalHistory?.[0]?.userId ?
                             props?.approvalHistory?.[0]?.userId :
                             props?.assignedPersonnel)) , {
        headers : {
            Authorization : "Bearer ".concat(props.user?.sessionToken)
        }
    });
    const applicant = props.applicant;
    return <ScrollView style={ { width : "100%" , backgroundColor : "#fff" , } }>
        <View style={ { padding : 10 , flex : 1 , alignSelf : "center" } }>
            <ProfileImage
                style={ { borderRadius : 4 } }
                size={ fontValue(150) }
                textSize={ 22 }
                image={ applicant?.user?.profilePicture?.small }
                name={ `${ applicant?.user?.firstName } ${ applicant?.user?.lastName }` }
            />

        </View>

        { props.applicant &&
        <View style={ styles.elevation }>
            <View style={ [styles.container , { marginTop : 20 }] }>
                <View style={ styles.group4 }>
                    <View style={ styles.group3 }>
                        <View style={ styles.group }>
                            <View style={ styles.rect }>
                                <Text style={ styles.header }>Status</Text>
                            </View>
                        </View>

                        <View style={ styles.status }>

                            <View
                                style={ { flexDirection : "row" , justifyContent : "center" , alignItems : "center" } }>
                                {loading && <ActivityIndicator/> }
                                {!loading ?
                                    statusIcon(
                                        getStatusText(props , personnel)
                                        ,
                                        styles.icon2 ,
                                        1
                                    ) : <></>
                                }
                                {!loading ?
                                 <CustomText
                                    style={ [
                                        styles.role ,
                                        statusColor(
                                            getStatusText(props , personnel)
                                        ) ,
                                        {
                                            fontSize : fontValue(16) ,
                                            fontFamily : Bold ,
                                        }
                                    ] }
                                    numberOfLines={ 1 }
                                >
                                    {
                                        getStatusText(props , personnel)?.toUpperCase()
                                    }
                                </CustomText> : <></>}
                            </View>


                            { personnel != undefined &&
                            (getStatusText(props , personnel) == APPROVED ? getStatusText(props , personnel) : !excludeStatus(props , personnel)  )  &&
                            <CustomText style={ { fontSize: fontValue(12), flex : 1 , color : "#37405B" } }>
                                {(
                                      personnel !== undefined ? `by ${ personnel?.firstName } ${ personnel?.lastName }` : ``)}

                            </CustomText> }

                        </View>
                    </View>
                    <View style={ styles.group3 }>
                        <View style={ styles.group }>
                            <View style={ styles.rect }>
                                <Text style={ styles.header }>Basic Information</Text>
                            </View>
                        </View>
                        <Row label={ "Full Name:" }
                             applicant={ applicant?.user?.firstName + " " + applicant?.user?.middleName?.charAt() + "." + " " + applicant?.user?.lastName }/>
                        <Row label={ "Date of Birth:" }
                             applicant={ moment(applicant?.user?.dateOfBirth).format('LL') }/>
                        <Row label={ "Gender:" } applicant={ applicant?.user?.gender }/>
                        <Row label={ "Nationality:" } applicant={ applicant?.user?.nationality }/>
                    </View>
                    <View style={ styles.divider }/>
                    <View style={ styles.group3 }>
                        <View style={ styles.group }>
                            <View style={ styles.rect }>
                                <Text style={ styles.header }>Address</Text>
                            </View>
                        </View>
                        <Row label={ "Unit/Rm/Bldg./Street:" } applicant={ applicant?.unit }/>
                        <Row label={ "Barangay:" } applicant={ applicant?.barangay }/>
                        <Row label={ "Province:" } applicant={ applicant?.province }/>
                        <Row label={ "City/Municipality:" } applicant={ applicant?.city }/>
                        <Row label={ "Zip Code:" } applicant={ applicant?.zipCode }/>

                    </View>
                    <View style={ styles.divider }/>
                    <View style={ styles.group3 }>
                        <View style={ styles.group }>
                            <View style={ styles.rect }>
                                <Text style={ styles.header }>Additional Details</Text>
                            </View>
                        </View>
                        <Row label={ "School Attended:" } applicant={ applicant?.schoolAttended }/>
                        <Row label={ "Course Taken:" } applicant={ applicant?.courseTaken }/>
                        <Row label={ "Year Graduated:" } applicant={ applicant?.yearGraduated }/>
                        <Row label={ "Contact Number:" } applicant={ applicant?.user?.contactNumber }/>
                        <Row label={ "Email:" } applicant={ applicant?.user?.email }/>

                    </View>
                    <View style={ styles.divider }/>

                </View>

            </View>
        </View>
        }
    </ScrollView>

};
const styles = StyleSheet.create({
    elevation : {
        marginBottom : 20 ,
        borderRadius : 5 ,
        alignSelf : "center" ,
        width : "90%" ,
        backgroundColor : "#fff" ,
        shadowColor : "rgba(0,0,0,1)" ,
        shadowOffset : {
            height : 0 ,
            width : 0
        } ,
        elevation : 6 ,
        shadowOpacity : 0.1 ,
        shadowRadius : 2 ,
    } ,
    icon2 : {
        color : "rgba(248,170,55,1)" ,
        fontSize : fontValue(10)
    } ,
    role : {

        fontFamily : Bold ,
        fontSize : fontValue(14) ,
        textAlign : "left" ,
        paddingHorizontal : fontValue(10)
    } ,
    submitted : {
        color : "rgba(105,114,135,1)" ,
        textAlign : "right" ,
        fontSize : fontValue(10)
    } ,
    container : {
        flex : 1
    } ,
    group4 : {} ,
    group3 : {
        paddingRight : fontValue(10) ,
        paddingLeft : fontValue(10)
    } ,
    group : {

    } ,
    rect : {
    } ,
    header : {
        backgroundColor : "#EFF0F6",
        textTransform: 'uppercase',
        fontSize: fontValue(12),
        fontFamily : Regular500 ,
        color : "#565961" ,
        padding : 5 ,
        marginLeft : 5
    } ,
    group2 : {
        flexDirection : "row" ,
        justifyContent : "flex-start" ,
        alignItems : "center" ,
        marginTop : 8 ,
        paddingHorizontal : 10  ,
        fontSize: fontValue(12)
    } ,
    detail : {
        fontSize: fontValue(14),
        fontFamily : Regular ,
        paddingRight : 0 ,
        textAlign : "left" ,
        flex : 1 ,
        alignSelf : "flex-start"
    } ,
    detailInput : {
        fontSize: fontValue(14),
        fontFamily : Regular500 ,
        color : "#121212" ,
        flex : 1 ,
        textAlign : "left"
    } ,
    divider : {
        padding : 2 ,
        paddingBottom : 20
    } ,
    status : {

        flexDirection : 'row' ,
        flexWrap : "wrap" ,
        justifyContent : "center" ,
        alignItems : "center" ,
        paddingVertical : 15 ,
        paddingLeft : 10
    }
});
export default BasicInfo