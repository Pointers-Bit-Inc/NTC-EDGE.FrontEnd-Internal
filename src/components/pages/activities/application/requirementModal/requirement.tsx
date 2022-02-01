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
import FileIcon from "@assets/svg/file";
import FileOutlineIcon from "@assets/svg/fileOutline";
import ThumbnailIcon from "@assets/svg/thumbnail";
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
        {props?.requirements.map((requirement:any, index:number) =>{
            return <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.cardContainer}>
                    <View style={styles.cardLabel}>
                        <View style={styles.cardTitle}>
                            <Text style={styles.title}>{requirement?.title}</Text>
                            <Text style={styles.description}>{requirement?.description}</Text>
                        </View>
                        <View style={[{paddingTop: 30, paddingBottom: 9}, styles.cardDocument]}>
                            <View  style={{paddingRight: 10}}>
                                <FileOutlineIcon/>
                            </View>

                            <Text style={styles.text}>{requirement?.file?.name}</Text>
                        </View>

                    </View>
                    <View style={{
                    
                    height: 216,
                    backgroundColor: "rgba(220,226,229,1)",
                    borderWidth: 1,
                    borderColor: "rgba(213,214,214,1)",
                    borderStyle: "dashed",
                }}>
                        <TouchableOpacity onPress={()=>{
                            setSelectImage(requirement?.links?.large)
                            setVisibleModal(true)
                        }
                        }>
                        <Image
                            style={{width: 350, height: 216}}
                            source={{
                                uri: requirement?.links?.large,
                            }}
                        />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
        })
        }
       {/* <View style={[requirementStyle.container, {marginTop: 12}]}>
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


        </View>*/}
        <RequirementModal image={selectImage}  visible={visibleModal} onDismissed={onDismissed}/>
    </ScrollView>

}
export default Requirement
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        padding: 10,
        width: "100%",
        
    },
    cardContainer: {

        backgroundColor: "rgba(255,255,255,1)",
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 30,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderRadius: 5
    },
    cardLabel: {
        width: "100%",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingLeft: 12
    },
    cardTitle: {
        justifyContent: "space-between",
    },
    title: {
        fontWeight: "600",
        color: "#1F2022"
    },
    description: {
        color: "#1F2022"
    },
    cardDocument: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        margin: 0
    },
    text: {

        width: "80%",
        color: "#606A80"  
    },
    cardPicture: {

        height: "70%",

        backgroundColor: "#E6E6E6"
    }
});