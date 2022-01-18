import React, {useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {EvilIcons} from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import ChevronUpIcon from "@assets/svg/chevron-up";
import ChevronDownIcon from "@assets/svg/chevron-down";
import {styles} from "@pages/activities/application/styles";
import RequirementModal from "@pages/activities/application/requirementModal";
const Requirement = (props:any) =>{
    const [selectCollapsed, setSelectCollapsed] = useState(1)
    const [visibleModal, setVisibleModal] = useState(false)
    const [selectImage, setSelectImage] = useState('')
    const onDismissed = () =>{
        setSelectImage("")
        setVisibleModal(false)
    }
    return <>
        <View style={styles.container}>
            {props.requirements.map((requirement:any, index:number) =>{
                return <View key={index} style={styles.group6}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setSelectCollapsed(selectCollapsed == index ? -1 : index)
                    }
                    }>
                        <View style={styles.group5}>
                            <View style={styles.rect1}>
                                <Text style={styles.prcLicensePdf}>{requirement?.title}</Text>
                                <View style={styles.prcLicensePdfFiller}>
                                </View>
                                <View style={styles.rect2}>
                                    {selectCollapsed == index ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                                </View>
                            </View>
                        </View>
                       </TouchableWithoutFeedback>
                    <View style={styles.group3}>
                        <View style={styles.group4}>
                            <Collapsible collapsed={index != selectCollapsed}>
                                <View style={styles.rect}>
                                    <View style={styles.rect5}>
                                        <Image
                                            style={{width: 350, height: 216}}
                                            source={{
                                                uri: requirement?.path ? requirement?.path : 'https://dummyimage.com/350x216/fff/aaa',
                                            }}
                                        />
                                    </View>
                                    <View style={styles.group2}>
                                        <View style={styles.rect6}>
                                            <View style={styles.group}>
                                                <TouchableOpacity onPress={()=>{
                                                    setSelectImage(requirement?.path)
                                                    setVisibleModal(true)
                                                }
                                                }>
                                                    <View style={styles.iconRow}>
                                                        <EvilIcons name="eye" style={styles.icon}/>
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
            })}


        </View>
        <RequirementModal image={selectImage}  visible={visibleModal} onDismissed={onDismissed}/>
    </>

}
export default Requirement