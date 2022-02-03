import React, {useEffect, useMemo, useState} from "react";
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {formatDate, PaymentStatusText, statusColor, statusIcon, StatusText} from "@pages/activities/script";
import ProfileImage from "@atoms/image/profile";
import CustomText from "@atoms/text";
import {text} from "@styles/color";
import {CASHIER} from "../../../../reducers/activity/initialstate";
import {useAssignPersonnel} from "@pages/activities/hooks/useAssignPersonnel";

const {width, height} = Dimensions.get("screen")

const BasicInfo = (props: any) => {
    const {personnel, loading} = useAssignPersonnel(props.assignedPersonnel || props?.approvalHistory?.[0]?.userId, {
        headers: {
            Authorization: "Bearer ".concat(props.user?.sessionToken)
        }
    });
    const applicant = props.applicant
    return <ScrollView style={{width, backgroundColor: "#fff", }}>
         <View style={{padding: 10,flex: 1,alignSelf:"center"}}>
             <ProfileImage
                 style={{borderRadius: 4}}
                 size={150}
                 textSize={22}
                 image={applicant?.user.profilePicture?.small}
                 name={`${applicant?.user.firstName} ${applicant?.user.lastName}`}
             />
        
         </View>
        {props.applicant &&
        <View style={{
            marginBottom: 20,
            borderRadius: 5,
            alignSelf: "center",
            width: "90%",
            backgroundColor: "#fff",
            shadowColor: "rgba(0,0,0,1)",
            shadowOffset: {
                height: 0,
                width: 0
            },
            elevation: 10,
            shadowOpacity: 0.1,
            shadowRadius: 2,
        }}>
            <View style={[styles.container, {marginTop: 20}]}>
                <View style={styles.group4}>
                    <View style={styles.group3}>
                        <View style={styles.group}>
                            <View style={styles.rect}>
                                <Text style={styles.header}>Status</Text>
                            </View>
                        </View>

                        <View >
                            <View style={{flexDirection: 'row',   alignItems: "center",padding: 13}}>
                                {
                                    statusIcon(
                                        props.status ?
                                            props.status :
                                            (props?.user?.role?.key == CASHIER ?
                                                    PaymentStatusText(props?.paymentStatus) :
                                                    (props.status ?
                                                            props.status :
                                                            StatusText(props.detailsStatus)
                                                    )
                                            ),
                                        styles.icon2,
                                        1
                                    )
                                }
                                <CustomText
                                    style={[
                                        styles.role,
                                        statusColor(
                                            props.status ?
                                                props.status :
                                                (props?.user?.role?.key == CASHIER ?
                                                        PaymentStatusText(props?.paymentStatus) :
                                                        (props.status ?
                                                                props.status :
                                                                StatusText(props.detailsStatus)
                                                        )
                                                )
                                        ),
                                        {
                                            fontSize: 16,
                                            fontWeight: '500',
                                        }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {
                                        props.status ?
                                            props.status :
                                            (props?.user?.role?.key == CASHIER ?
                                                    PaymentStatusText(props?.paymentStatus).toUpperCase() :
                                                    (props.status ?
                                                            props.status :
                                                            StatusText(props.detailsStatus).toUpperCase()
                                                    )
                                            )
                                    }
                                </CustomText>
                                <CustomText style={{color: "#37405B"}}>
                                    {loading ? <ActivityIndicator/> : (personnel != undefined ?  `by ${personnel?.firstName} ${personnel?.lastName}` : ``)}

                                </CustomText>
                            </View>
                        </View>
                    </View>
                    <View style={styles.group3}>
                        <View style={styles.group}>
                            <View style={styles.rect}>
                                <Text style={styles.header}>Basic Information</Text>
                            </View>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Last Name:</Text>
                            <Text style={styles.detailInput}>{applicant?.user?.lastName}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Middle Name:</Text>
                            <Text style={styles.detailInput}>{applicant?.user?.middleName}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>First Name:</Text>
                            <Text style={styles.detailInput}>{applicant?.user?.firstName}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Date of Birth</Text>
                            <Text style={styles.detailInput}>{formatDate(applicant?.user?.dateOfBirth)}</Text>
                        </View>
                    </View>
                    <View style={styles.devider}></View>
                    <View style={styles.group3}>
                        <View style={styles.group}>
                            <View style={styles.rect}>
                                <Text style={styles.header}>Address</Text>
                            </View>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Unit/Rm/House/Bldg No.:</Text>
                            <Text style={styles.detailInput}>{applicant?.unit}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Barangay</Text>
                            <Text style={styles.detailInput}>{applicant?.barangay}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Province:</Text>
                            <Text style={styles.detailInput}>{applicant?.province}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>City/Municipality:</Text>
                            <Text style={styles.detailInput}>{applicant?.city}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Zip Code:</Text>
                            <Text style={styles.detailInput}>{applicant?.zipCode}</Text>
                        </View>
                    </View>
                    <View style={styles.devider}></View>
                    <View style={styles.group3}>
                        <View style={styles.group}>
                            <View style={styles.rect}>
                                <Text style={styles.header}>Additional Details</Text>
                            </View>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>School Attended:</Text>
                            <Text style={styles.detailInput}>{applicant?.schoolAttended}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Course Taken:</Text>
                            <Text style={styles.detailInput}>{applicant?.courseTaken}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Year Graduated:</Text>
                            <Text style={styles.detailInput}>{applicant?.yearGraduated}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Contact Number::</Text>
                            <Text style={styles.detailInput}>{applicant?.user?.contactNumber}</Text>
                        </View>
                        <View style={styles.group2}>
                            <Text style={styles.detail}>Email:</Text>
                            <Text style={styles.detailInput}>{applicant?.user?.email}</Text>
                        </View>
                    </View>
                    <View style={styles.devider}></View>

                </View>

            </View>
        </View>
       }
    </ScrollView>

}
const styles = StyleSheet.create({
    icon2: {
        color: "rgba(248,170,55,1)",
        fontSize: 10
    },
    role: {

        fontWeight: "bold",
        fontSize: 10,
        textAlign: "left",
        paddingRight: "7%" ,
        paddingLeft: "2%"
    },
    submitted: {
        color: "rgba(105,114,135,1)",
        textAlign: "right",
        fontSize: 10
    },
    container: {

        flex: 1
    },
    group4: {
    },
    group3: {

       paddingRight:10,
        paddingLeft: 10
    },
    group: {
        
    },
    rect: {
      
        backgroundColor: "#EFF0F6"
    },
    header: {
        fontWeight: "500",
        color: "#565961",
        padding: 5,
        marginLeft: 5
    },
    group2: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 8
    },
    detail: {
        color: "#565961",
           fontWeight: "400",
        paddingRight: 0,
        textAlign: "left",
        flex: 1,
        alignSelf: "flex-start"
    },
    detailInput: {
       fontWeight: "500",
        color: "#121212",
        flex: 1,
        textAlign: "left"
    },
    devider: {
        padding: 2,
        //backgroundColor: "#F0F0F0",
        marginTop: 14,
        marginBottom: 20
    }
});
export default BasicInfo