import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";

const ApplicationDetails = (props:any) =>{

    return <>
        <View style={styles.container}>
            <View style={styles.group2}>
                <View style={styles.rect}>
                    <Text style={styles.file}>File</Text>
                </View>
                <Text style={styles.applicationType}>{props?.applicantType}</Text>
                <Text style={styles.service}>{props?.service?.name}</Text>
                {props.selectedType.map((type:any, idx:number) => {
                    return <Text key={idx} style={styles.text}>
                        {type.name} {type.selectedItems.map((item:string, index:number)=>{
                            return <Text key={index}>{`\n\u2022${item}`}</Text>
                            })}
                    </Text>
                })
                }

                <View style={styles.rect4}></View>
            </View>
        </View>
        </>

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    group2: {
    },
    rect: {
        padding: 10,
        backgroundColor: "#E6E6E6"
    },
    file: {
        color: "rgba(86,89,97,1)",
    },
    applicationType: {
        fontWeight: "bold",
        color: "#121212",
        fontSize: 16,
        marginTop: 8,
        marginLeft: 1
    },
    service: {
        color: "#121212",
        marginLeft: 1
    },
    text: {
        color: "#121212",
        marginTop: 2,
        marginLeft: 1
    },
    rect4: {
        width: '100%',
        height: 10,
        backgroundColor: "#E6E6E6",
        marginTop: 15
    }
});
export default ApplicationDetails