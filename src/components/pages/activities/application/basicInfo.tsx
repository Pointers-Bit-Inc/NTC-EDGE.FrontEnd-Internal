import React, {useEffect, useMemo, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import axios from "axios";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    contactNumber: string;
    dateOfBirth: string;
    gender: string;
}

interface Barangay {
    id: string;
    name: string;
}
interface City {
    id: string;
    name: string;
}
interface Province {
    id: string;
    name: string;
}

interface Applicant {
    id: string;
    createdAt: string;
    user: User;
    street: string;
    unit: string;
    barangay: Barangay;
    city: City;
    province: Province;
    zipCode: string;
    company: string;
    schoolAttended: string;
    courseTaken: string;
    yearGraduated: string;
    category: string;
}

interface Service {
    id: string;
    createdAt: Date;
    name: string;
    revisionNumber: string;
    serviceCode: string;
    revisionDate: Date;
}

interface Application {
    id: string;
    createdAt: string;
    applicant: Applicant;
    service: Service;
    status: string;
    totalFee: string;
    paymentStatus: string;
}

const BasicInfo = (props: any) => {

    const [basicInfo, setBasicInfo] = useState([
        {
            id: 1,
            title: "Basic Information",
            detail: [
                {
                    id: 1,
                    label: "Last Name:",
                    input: "Lorem Ipsum"
                },
                {
                    id: 2,
                    label: "Middle Name:",
                    input: "Lorem Ipsum"
                },
                {
                    id: 3,
                    label: "First Name:",
                    input: "Lorem Ipsum"
                },
                {
                    id: 4,
                    label: "Date of birth:",
                    input: "Lorem Ipsum"
                },
                {
                    id: 5,
                    label: "Gender:",
                    input: "Lorem Ipsum"
                }, {
                    id: 6,
                    label: "Nationality:",
                    input: "Lorem Ipsum"
                }
            ]
        },
        {
            id: 2,
            title: "Address",
            detail: [
                {
                    id: 7,
                    label: "Unit/Rm/House/Bldg no::",
                    input: "Lorem Ipsum"
                }, {
                    id: 8,
                    label: "Barangay:",
                    input: "Lorem Ipsum"
                },
                {
                    id: 9,
                    label: "Province:",
                    input: "Lorem Ipsum"
                }, {
                    id: 10,
                    label: "City/Municipality:",
                    input: "Lorem Ipsum"
                }, {
                    id: 11,
                    label: "Zip Code:",
                    input: "Lorem Ipsum"
                }
            ]
        },
        {
            id: 3,
            title: "Additional Details",
            detail: [
                {
                    id: 12,
                    label: "School Attended:",
                    input: "Lorem Ipsum"
                }, {
                    id: 13,
                    label: "Course Taken:",
                    input: "Lorem Ipsum"
                }, {
                    id: 14,
                    label: "Year Graduated:",
                    input: "Lorem Ipsum"
                }, {
                    id: 15,
                    label: "Contact number:",
                    input: "Lorem Ipsum"
                }, {
                    id: 16,
                    label: "Email address:",
                    input: "Lorem Ipsum"
                },
            ]
        }
    ])
    const [info, setInfo] = useState<Application>()

    useEffect(() => {
           axios.get('https://private-anon-c8cd4eafe8-ntcedgeustp.apiary-mock.com/applications/' + props.applicantId).then((response) => {
                setInfo(response.data)

            })
    }, [props.applicantId])
    return <>
        {/* {basicInfo.map((basicinfo, index)=>{
            return <View key={index} style={styles.group9Stack}>
                <View style={styles.group9}>
                    <View style={styles.rect15Filler}></View>
                    <View style={styles.rect15}>
                        <Text style={styles.details}>{basicinfo.input}</Text>
                    </View>
                </View>
                <View style={styles.rect13}>
                    <View style={styles.rect14}>
                        <Text style={styles.field}>{basicinfo.label}</Text>
                    </View>
                </View>
            </View>
        })}*/}

        {info && <View style={styles.container}>
            <View style={styles.group2}>
                <View style={styles.rect}>
                    <Text style={styles.basicInfo}>Basic Information</Text>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                    <Text style={styles.label}>Last Name</Text>
                    <View style={styles.labelFiller}></View>
                    <Text style={styles.input}>{info.applicant.user.lastName}</Text>
                </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Middle Name</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.user.middleName}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>First Name</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.user.firstName}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.user.dateOfBirth}</Text>
                    </View>
                </View>

                <View style={[styles.rect4]}></View>
                <View style={[styles.rect4, {backgroundColor: "#E6E6E6"}]}></View>
            </View>
            <View style={styles.group2}>
                <View style={styles.rect}>
                    <Text style={styles.basicInfo}>Address</Text>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Unit/Rm/House/Bldg No.:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.unit}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Barangay:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.barangay.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Province:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.province.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>City/Municipality:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.city.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Zip Code:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.zipCode}</Text>
                    </View>
                </View>
                <View style={[styles.rect4]}></View>
                <View style={[styles.rect4, {backgroundColor: "#E6E6E6"}]}></View>
            </View>
            <View style={styles.group2}>
                <View style={styles.rect}>
                    <Text style={styles.basicInfo}>Additional Details</Text>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>School Attended:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.schoolAttended}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Course Taken:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.courseTaken}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Year Graduated:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.yearGraduated}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Contact Number:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.user.contactNumber}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Email:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.user.email}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>City/Municipality:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.city.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Zip Code:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.applicant.zipCode}</Text>
                    </View>
                </View>
                <View style={[styles.rect4]}></View>
                <View style={[styles.rect4, {backgroundColor: "#E6E6E6"}]}></View>
            </View>
        </View>}
    </>

}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group2: {
        marginBottom: 10,
        width: 350,
        alignSelf: "center"
    },
    rect: {
        width: 350,
        height: 27,
        backgroundColor: "#E6E6E6"
    },
    basicInfo: {

        color: "rgba(86,89,97,1)",
        marginTop: 6,
        marginLeft: 13
    },
    group: {
        width: 350,
        marginTop: 11
    },
    rect3: {
        width: 350,
        height: 14,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row"
    },
    label: {

        color: "rgba(86,89,97,1)",
        fontSize: 12,
        marginLeft: 13
    },
    labelFiller: {
        flex: 1,
        flexDirection: "row"
    },
    input: {
        fontWeight: "bold",
        color: "#000",
        fontSize: 12,
        marginRight: 80
    },
    rect4: {
        width: 350,

        height: 10,
    }
});
export default BasicInfo