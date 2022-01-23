import React, {useEffect, useMemo, useState} from "react";
import {Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {formatDate} from "@pages/activities/script";

const {width, height} = Dimensions.get("screen")

const BasicInfo = (props: any) => {
    const applicant = props.applicant
    return <ScrollView style={{width, backgroundColor: "#fff", }}>

        {props.applicant &&  <View style={[styles.container, {marginTop: 12}]}>
            <View style={styles.group4}>
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

        </View>}
    </ScrollView>

}
const styles = StyleSheet.create({
    container: {

        flex: 1
    },
    group4: {
    },
    group3: {
       paddingRight:20,
        paddingLeft: 20
    },
    group: {
        height: 27
    },
    rect: {
        height: 27,
        backgroundColor: "#E0E0E0"
    },
    header: {
        fontFamily: "Helvetica Neue",
        color: "#565961",
        paddingTop: 5,
        marginLeft: 5
    },
    group2: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 8
    },
    detail: {
        fontFamily: "Helvetica Neue",
        color: "#565961",
        paddingRight: 0,
        textAlign: "left",
        flex: 1,
        alignSelf: "flex-start"
    },
    detailInput: {
        fontFamily: "Helvetica Neue",
        color: "#121212",
        flex: 1,
        textAlign: "left"
    },
    devider: {
        height: 10,
        backgroundColor: "#F0F0F0",
        marginTop: 14,
        marginBottom: 20
    }
});
export default BasicInfo