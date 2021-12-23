import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {EvilIcons} from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import ChevronUpIcon from "@assets/svg/chevron-up";
import ChevronDownIcon from "@assets/svg/chevron-down";
import {styles} from "@pages/activities/application/styles";
import RequirementModal from "@pages/activities/application/requirementModal";

const Requirement = () =>{
    const [selectCollapsed, setSelectCollapsed] = useState(1)
    const [visibleModal, setVisibleModal] = useState(false)
    const onDismissed = () =>{
        setVisibleModal(false)
    }
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
                                            <TouchableOpacity onPress={()=>{
                                            setVisibleModal(true)
                                            }
                                            }>
                                                <View style={styles.iconRow}>
                                                    <EvilIcons name="eye" style={styles.icon}></EvilIcons>
                                                    <Text style={styles.rect8}>View</Text>
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                            </View>


                </Collapsible>
                    </View>
                </View>
            </View>

        </View>
        <RequirementModal visible={visibleModal} onDismissed={onDismissed}></RequirementModal>
    </>

}
export default Requirement