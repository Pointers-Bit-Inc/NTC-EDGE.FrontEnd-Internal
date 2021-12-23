import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";

const ApplicationDetails = () =>{

    return <>
        <View style={styles.container}>
            <View style={styles.group2}>
                <View style={styles.rect}>
                    <Text style={styles.file}>File</Text>
                </View>
                <Text style={styles.loremIpsum}>Issuance of Admission Slip</Text>
                <Text style={styles.loremIpsum3}>Radio Operator Examination</Text>
                <Text style={styles.text}>
                    Radiotelegraphy{"\n"}{`\u2022`}1RTG - Elements 1, 2, 5, 6 &amp; Code (25/20 wpm)
                </Text>
                <View style={styles.rect4}></View>
            </View>
        </View>
        </>

}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group2: {
        width: 350,
        marginLeft: 13
    },
    rect: {
        width: 350,
        height: 27,
        backgroundColor: "#E6E6E6"
    },
    file: {
        color: "rgba(86,89,97,1)",
        marginTop: 6,
        marginLeft: 13
    },
    loremIpsum: {
        fontWeight: "bold",
        color: "#121212",
        fontSize: 16,
        marginTop: 8,
        marginLeft: 1
    },
    loremIpsum3: {
        color: "#121212",
        marginLeft: 1
    },
    text: {
        color: "#121212",
        marginTop: 2,
        marginLeft: 1
    },
    rect4: {
        width: 350,
        height: 10,
        backgroundColor: "#E6E6E6",
        marginTop: 5
    }
});
export default ApplicationDetails