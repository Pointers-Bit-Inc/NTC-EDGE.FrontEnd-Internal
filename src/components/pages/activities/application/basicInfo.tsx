import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
const BasicInfo = () => {
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
        <View style={styles.container}>
        {basicInfo.map((info, index) => {
            return  <View style={styles.group2}>
                    <View style={styles.rect}>
                        <Text style={styles.basicInfo}>{info.title}</Text>
                    </View>
                <View style={styles.group}>
                {info.detail.map((item)=>{
                    return <View style={styles.rect3}>
                        <Text style={styles.label}>{item.label}</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{item.input}</Text>
                    </View>
                })}
                </View>


                    <View style={[styles.rect4]}></View>
                    <View style={[styles.rect4, {backgroundColor: "#E6E6E6"}]}></View>
                </View>

        })
        }
        </View>
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