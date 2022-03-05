import React  from "react";
import {StyleSheet, View, Text, Modal, TouchableOpacity} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/script";

function QrBasicInfo(props: any) {
    return (

        <View style={styles.container}>
            <View style={styles.group}>
                <View style={styles.rect}>
                    <View style={styles.rect2}>
                        <View style={styles.group2}>
                            <MaterialCommunityIcons
                                name="check-circle-outline"
                                style={styles.icon}
                            ></MaterialCommunityIcons>
                            <Text style={styles.verified}>Verified</Text>
                        </View>

                           <TouchableOpacity onPress={()=>{
                               props.dismiss()
                           }} >
                               <Ionicons  name="md-close" style={styles.icon2}></Ionicons>
                           </TouchableOpacity>


                    </View>
                    <View style={styles.rect3}></View>
                    <View style={styles.group4}>
                        <Text style={styles.basicInfo}>BASIC INFO</Text>
                        <View style={styles.group3}>
                            <Text style={styles.nameAddress}>Name:{"\n"}Address:</Text>
                            <Text style={styles.nameAddress1}>
                                NameInput{"\n"}AddressInput
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>


);
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    group: {
        width: 345,
        height: 495,
        borderRadius: 10,
        marginTop: 112,
    },
    rect: {
        height: 495,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 22
    },
    rect2: {
        height: 50,
        backgroundColor: "rgba(0,171,118,0.1)",
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        flexDirection: "row"
    },
    group2: {
        width: 129,
        height: 37,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 110,
        marginTop: 8
    },
    icon: {
        color: "rgba(5,150,105,1)",
        fontSize: 34
    },
    verified: {
        color: "rgba(0,171,118,1)",
        fontSize: fontValue(25)
    },
    icon2: {
        color: "rgba(128,128,128,1)",
        fontSize: 40,
        height: 44,
        width: 50,
        flex: 1,
        marginLeft: 50,
        marginTop: 5
    },
    rect3: {
        width: 150,
        height: 150,
        backgroundColor: "#E6E6E6",
        marginTop: 15,
        marginLeft: 98
    },
    group4: {
        width: 177,
        height: 58,
        justifyContent: "space-around",
        marginTop: 16,
        marginLeft: 11
    },
    basicInfo: {
        color: "#121212"
    },
    group3: {
        width: 177,
        height: 38,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    nameAddress: {
        color: "rgba(96,106,128,1)",
        fontSize: 16
    },
    nameAddress1: {
        color: "rgba(96,106,128,1)",
        fontSize: 16
    }
});
export default QrBasicInfo;
