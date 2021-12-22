import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {EvilIcons} from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import ChevronUpIcon from "@assets/svg/chevron-up";
import ChevronDownIcon from "@assets/svg/chevron-down";
import {styles} from "@pages/activities/application/styles";

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
export default Requirement