import React, {useState} from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {EvilIcons} from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import ChevronUpIcon from "@assets/svg/chevron-up";
import ChevronDownIcon from "@assets/svg/chevron-down";
import {requirementStyle} from "@pages/activities/application/requirementModal/styles";
import RequirementModal from "@pages/activities/application/requirementModal/index";
const {width, height} = Dimensions.get("screen")
const Requirement = (props:any) =>{
    const [selectCollapsed, setSelectCollapsed] = useState(0)
    const [visibleModal, setVisibleModal] = useState(false)
    const [selectImage, setSelectImage] = useState('')
    const onDismissed = () =>{
        setSelectImage("")
        setVisibleModal(false)
    }
    return <ScrollView style={{width}}>
        <View style={[requirementStyle.container, {marginTop: 12}]}>
            {props?.requirements.map((requirement:any, index:number) =>{
                return <View key={index} style={requirementStyle.group6}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setSelectCollapsed(selectCollapsed == index ? -1 : index)
                    }
                    }>
                        <View style={requirementStyle.group5}>
                            <View style={requirementStyle.rect1}>
                                <Text style={requirementStyle.prcLicensePdf}>{requirement?.title?.slice(0, 40)}</Text>
                                
                                <View style={requirementStyle.rect2}>
                                    {selectCollapsed == index ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                                </View>
                            </View>
                        </View>
                       </TouchableWithoutFeedback>
                    <View style={requirementStyle.group3}>
                        <View style={requirementStyle.group4}>
                            <Collapsible collapsed={index != selectCollapsed}>
                                <View style={requirementStyle.rect}>
                                    <View style={requirementStyle.rect5}>
                                        <Image
                                            style={{width: 350, height: 216}}
                                            source={{
                                                uri: requirement?.links?.large,
                                            }}
                                        />
                                    </View>
                                    <View style={requirementStyle.group2}>
                                        <View style={requirementStyle.rect6}>
                                            <View style={requirementStyle.group}>
                                                <TouchableOpacity onPress={()=>{
                                                    setSelectImage(requirement?.links?.large)
                                                    setVisibleModal(true)
                                                }
                                                }>
                                                    <View style={requirementStyle.iconRow}>
                                                        <EvilIcons name="eye" style={requirementStyle.icon}/>
                                                        <Text style={requirementStyle.rect8}>View</Text>
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
    </ScrollView>

}
export default Requirement
