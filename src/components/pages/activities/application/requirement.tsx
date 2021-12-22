import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {EvilIcons} from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import ChevronUpIcon from "@assets/svg/chevron-up";
import ChevronDownIcon from "@assets/svg/chevron-down";

const Requirement = () =>{
    const [selectCollapsed, setSelectCollapsed] = useState(1)
    return <>
        <View style={styles.container}>

            <View style={styles.group6}>
                <TouchableWithoutFeedback onPress={()=>{
                    setSelectCollapsed(selectCollapsed == 1 ? 0 : 1)
                }
                }>
                    <View style={styles.group5}>
                        <View style={styles.rect1}>
                            <Text style={styles.prcLicensePdf}>PRC License.pdf</Text>
                            <View style={styles.prcLicensePdfFiller}></View>
                            <View style={styles.rect2}>
                                {selectCollapsed == 1 ? <ChevronUpIcon></ChevronUpIcon> : <ChevronDownIcon></ChevronDownIcon>}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.group3}>
                    <View style={styles.group4}>
                <Collapsible collapsed={1 != selectCollapsed}>


                            <View style={styles.rect}>
                                <View style={styles.rect5}></View>
                                <View style={styles.group2}>
                                    <View style={styles.rect6}>
                                        <View style={styles.group}>
                                            <View style={styles.iconRow}>
                                                <EvilIcons name="eye" style={styles.icon}></EvilIcons>
                                                <Text style={styles.rect8}>View</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>


                </Collapsible>
                    </View>
                </View>
            </View>
            <View style={styles.group6}>
                <TouchableWithoutFeedback onPress={()=>{
                    setSelectCollapsed(selectCollapsed == 2 ? 0 : 2)
                }
                }>
                    <View style={styles.group5}>
                        <View style={styles.rect1}>
                            <Text style={styles.prcLicensePdf}>PRC License.pdf</Text>
                            <View style={styles.prcLicensePdfFiller}></View>
                            <View style={styles.rect2}>
                                {selectCollapsed == 2 ? <ChevronUpIcon></ChevronUpIcon> : <ChevronDownIcon></ChevronDownIcon>}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.group3}>
                    <View style={styles.group4}>
                        <Collapsible collapsed={2 != selectCollapsed}>


                            <View style={styles.rect}>
                                <View style={styles.rect5}></View>
                                <View style={styles.group2}>
                                    <View style={styles.rect6}>
                                        <View style={styles.group}>
                                            <View style={styles.iconRow}>
                                                <EvilIcons name="eye" style={styles.icon}></EvilIcons>
                                                <Text style={styles.rect8}>View</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>


                        </Collapsible>
                    </View>
                </View>
            </View>
        </View>
    </>

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    group6: {
        width: 350,
        marginBottom: 5,
    },
    group5: {
        width: 350,
        height: 36,
        alignSelf: "center"
    },
    rect1: {
        width: 350,
        height: 36,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 6,
        flexDirection: "row"
    },
    prcLicensePdf: {
        color: "rgba(24,39,58,1)",
        marginLeft: 20,
        marginTop: 10
    },
    prcLicensePdfFiller: {
        flex: 1,
        flexDirection: "row"
    },
    rect2: {
        marginRight: 18,
        marginTop: 10
    },
    group3: {
        width: 303,
        marginTop: 25,
        marginLeft: 20
    },
    group4: {
        width: 350,
        marginTop: -35,
        marginLeft: -20
    },
    rect: {
        width: 350,
        height: 307,
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14,
        backgroundColor: "#fff"
    },
    rect5: {
        width: 350,
        height: 216,
        backgroundColor: "rgba(220,226,229,1)",
        borderWidth: 1,
        borderColor: "rgba(213,214,214,1)",
        borderStyle: "dashed",
        marginTop: 30
    },
    group2: {
        width: 91,
        height: 35,
        marginTop: 8,
        marginLeft: 129
    },
    rect6: {
        width: 91,
        height: 35,
        backgroundColor: "rgba(243,245,247,1)",
        borderRadius: 6
    },
    group: {
        width: 51,
        height: 17,
        flexDirection: "row",
        marginTop: 9,
        marginLeft: 20
    },
    icon: {
        color: "rgba(40,99,214,1)",
        fontSize: 20
    },
    rect8: {
        color: "rgba(40,99,214,1)"
    },
    iconRow: {
        height: 17,
        flexDirection: "row",
        flex: 1,
        marginRight: 1
    }
});
export default Requirement