import React, {useEffect, useMemo, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import axios from "axios";
import {RootStateOrAny, useSelector} from "react-redux";
import {Applicant} from "@pages/activities/interface";
import {formatDate} from "@pages/activities/formatDate";



const BasicInfo = (props: any) => {
    const user = useSelector((state: RootStateOrAny) => state.user);

    const [info, setInfo] = useState<Applicant>()

    useEffect(() => {
           axios.get('https://ntc.astrotechenergy.com/applicants/' + props.applicantId,{
            headers: {
                Authorization: "Bearer ".concat(user.sessionToken)
            }
        }).then((response) => {

                setInfo(response.data)

            })
    }, [props.applicantId])
    return <>

        {info && <View style={styles.container}>
            <View style={styles.group2}>
                <View style={styles.rect}>
                    <Text style={styles.basicInfo}>Basic Information</Text>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                    <Text style={styles.label}>Last Name</Text>
                    <View style={styles.labelFiller}></View>
                    <Text style={styles.input}>{info.user.lastName}</Text>
                </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Middle Name</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.user.middleName}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>First Name</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.user.firstName}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{formatDate(info.user.dateOfBirth)}</Text>
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
                        <Text style={styles.input}>{info.unit}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Barangay:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.barangay.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Province:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.province.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>City/Municipality:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.city.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Zip Code:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.zipCode}</Text>
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
                        <Text style={styles.input}>{info.schoolAttended}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Course Taken:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.courseTaken}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Year Graduated:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.yearGraduated}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Contact Number:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.user.contactNumber}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Email:</Text>
                        <View style={styles.labelFiller}></View>
                        {/*<Text style={styles.input}>{info.user.email}</Text>*/}
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>City/Municipality:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.city.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Zip Code:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{info.zipCode}</Text>
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
        flex: 1,
        alignItems: "center"
    },
    group2: {
        marginBottom: 10,
        width: 350,

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

        height: 14,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row"
    },
    label: {

        color: "rgba(86,89,97,1)",
        fontSize: 12,

    },
    labelFiller: {
        flex: 1,
        flexDirection: "row"
    },
    input: {
        fontWeight: "bold",
        color: "#000",
        fontSize: 12,
    },
    rect4: {
        width: 350,

        height: 10,
    }
});
export default BasicInfo