import React, {useState} from "react";
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import RequirementModal from "@pages/activities/application/requirementModal/index";
import FileOutlineIcon from "@assets/svg/fileOutline";

const {width, height} = Dimensions.get("screen")
const Requirement = (props: any) => {
    const [visibleModal, setVisibleModal] = useState(false)
    const [selectImage, setSelectImage] = useState('')
    const onDismissed = () => {
        setSelectImage("")
        setVisibleModal(false)
    }
    return <ScrollView style={{backgroundColor: "#fff", width}}>
        {props?.requirements?.map((requirement: any, index: number) => {
            return <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.cardContainer}>
                        <View style={styles.cardLabel}>
                            <View style={styles.cardTitle}>
                                <Text style={styles.title}>{requirement?.title}</Text>
                                <Text style={styles.description}>{requirement?.description}</Text>
                            </View>
                            <View style={[{paddingTop: 30, paddingBottom: 9}, styles.cardDocument]}>
                                <View style={{paddingRight: 10}}>
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
                            <TouchableOpacity onPress={() => {
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
        <RequirementModal image={selectImage} visible={visibleModal} onDismissed={onDismissed}/>
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