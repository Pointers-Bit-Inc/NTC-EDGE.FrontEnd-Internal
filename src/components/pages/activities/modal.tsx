import React, {useEffect, useRef, useState} from "react";
import {Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Entypo, Ionicons} from "@expo/vector-icons";
import Svg, {Ellipse} from "react-native-svg";
import {primaryColor, text} from "@styles/color";
import Disapproval from "@pages/activities/disapproval";
import Endorsed from "@pages/activities/endorse";
import Approval from "@pages/activities/approval";
import BasicInfo from "@pages/activities/application/basicInfo";
import Requirement from "@pages/activities/application/requirement";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Payment from "@pages/activities/application/payment";
import {RootStateOrAny, useSelector} from "react-redux";
const {width} = Dimensions.get('window');

function handleInfinityScroll(event: any) {
    let mHeight = event.nativeEvent.layoutMeasurement.height;
    let cSize = event.nativeEvent.contentSize.height;
    let Y = event.nativeEvent.contentOffset.y;
    if (Math.ceil(mHeight + Y) >= cSize) return true;
    return false;
}

function ActivityModal(props: any) {
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [groupButtonVisible, setGroupButtonVisible] = useState(false)
    const [tabs, setTabs] = useState([
        {
            id: 1,
            name: 'Basic Info',
            active: true,
            isShow: ['cashier', 'director', 'evaluator']
        },
        {
            id: 2,
            name: 'Application Details',
            active: false,
            isShow: ['cashier', 'director', 'evaluator']
        },
        {
            id: 3,
            name: 'Requirements',
            active: false,
            isShow: ['cashier', 'director', 'evaluator']
        },
        {
            id: 4,
            name: 'Payment',
            active: false,
            isShow: ['cashier']
        },
    ])
    const [visible, setVisible ] = useState(false)
    const [endorseVisible, setEndorseVisible ] = useState(false)
    const [approveVisible, setApproveVisible ] = useState(false)

    const onDismissed = () =>{
        setVisible(false)
    }
    const onEndorseDismissed = () =>{
        setEndorseVisible(false)
    }
    const onApproveDismissed = () => {
      setApproveVisible(false)
    }

    const [backgroundColour, setBackgroundColour] = useState("#fff")

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.visible}
            onRequestClose={() => {
                props.onDismissed()
            }}>

            <View style={visible || endorseVisible || approveVisible ? {
                position: "absolute",
                zIndex: 2,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: "rgba(0, 0, 0, 0.5)",}: {}}/>

            <View style={styles.container}>
                <View style={styles.group13Stack}>
                    <View style={styles.group13}>
                        <View style={styles.rect16}>
                            <View style={styles.groupColumn}>
                                <View style={styles.group}>
                                    <View style={styles.rect3}>
                                        <View style={styles.rect2}>
                                            <TouchableOpacity onPress={() => {
                                                props.onDismissed()
                                            }}>
                                                <Ionicons
                                                    name="md-close"
                                                    style={styles.icon}
                                                ></Ionicons>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                                <View style={styles.group3}>
                                    <View style={styles.rect4Stack}>
                                        <View style={styles.rect4}></View>
                                        <Svg viewBox="0 0 80.5 80.5" style={styles.ellipse}>
                                            <Ellipse
                                                strokeWidth={0}
                                                fill="rgba(230, 230, 230,1)"
                                                cx={40}
                                                cy={40}
                                                rx={40}
                                                ry={40}
                                            ></Ellipse>
                                        </Svg>
                                    </View>
                                </View>
                                <View style={styles.group8}>
                                    <View style={styles.rect11}>
                                        <View style={styles.group5Row}>
                                            {
                                                tabs.map((tab, index) => {

                                                    return tab.isShow.indexOf(user?.role?.key) != -1 &&   <TouchableOpacity key={index} onPress={() => {
                                                        let newArr = [...tabs]
                                                        for (let i = 0; i < newArr.length; i++) {
                                                            if(newArr[i].active){
                                                                newArr[i].active = !newArr[i].active
                                                            }
                                                        }
                                                        newArr[index].active = true
                                                        if(newArr[index].id == 3 || newArr[index].id == 4){
                                                            setBackgroundColour("#f0f0f0")
                                                        }else{
                                                            setBackgroundColour("#fff")
                                                        }

                                                        setTabs(newArr)
                                                    }
                                                    }>
                                                        { <View style={[styles.group5]}>
                                                            <Text style={{color: tab.active ? primaryColor : text.default }}>{tab.name}</Text>
                                                            <View
                                                                style={[styles.rect6, {backgroundColor: tab.active ? primaryColor : "rgba(255,255,255,0)"}]}></View>
                                                        </View>}
                                                    </TouchableOpacity>
                                                })
                                            }


                                        </View>
                                    </View>
                                    <View style={styles.rect12}></View>
                                </View>

                            </View>
                            <View style={[styles.groupColumnFiller, {backgroundColor: backgroundColour}]}>
                                <ScrollView onScroll={(event) => {

                                    if (event.nativeEvent.contentOffset.y < 10) {
                                        setGroupButtonVisible(false)
                                    }
                                    if (handleInfinityScroll(event)) {
                                        setGroupButtonVisible(true)
                                    }
                                }
                                } scrollEventThrottle={16} style={[styles.group10]}>

                                    {
                                        tabs.map((tab, index) =>{
                                            const isShow = tab.isShow.indexOf(user?.role?.key) != -1
                                            console.log(isShow)
                                            if(isShow && tab.id == 1 && tab.active){
                                                return <BasicInfo key={index}/>
                                            }else if(isShow && tab.id == 2 && tab.active){
                                                return  <ApplicationDetails key={index}/>
                                            }else if(isShow && tab.id == 3 && tab.active){
                                                return  <Requirement key={index}/>
                                            }else if(isShow && tab.id == 4 && tab.active){
                                                return  <Payment key={index}/>
                                            }
                                        })
                                    }


                                </ScrollView>
                            </View>

                            {groupButtonVisible && <View style={styles.group14}>
                                <View style={styles.rect18Filler}></View>
                                <View style={styles.rect18}>
                                    <View style={styles.endWrapperFiller}></View>
                                    <View style={styles.rect19Column}>
                                        <View style={styles.rect19}></View>
                                        <View style={styles.group15}>
                                            <View style={styles.button3Row}>
                                                <TouchableOpacity onPress={()=>{
                                                    setApproveVisible(true)
                                                }} style={styles.button3}>
                                                    <View style={styles.rect22Filler}></View>
                                                    <View style={styles.rect22}>
                                                        <View style={styles.approvedFiller}></View>
                                                        <Text style={styles.approved}>Approved</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={()=>{
                                                setEndorseVisible(true)
                                                }
                                                } style={styles.button2}>
                                                    <View style={styles.rect23Filler}></View>
                                                    <View style={styles.rect23}>
                                                        <View style={styles.endorseFiller}></View>
                                                        <Text style={styles.endorse}>Endorse</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.button3RowFiller}></View>
                                            <TouchableOpacity onPress={()=>{
                                                setVisible(true)
                                            }} style={styles.button}>
                                                <View style={styles.rect24Filler}></View>
                                                <View style={styles.rect24}>
                                                    <View style={styles.endorse1Filler}></View>
                                                    <Text style={styles.endorse1}>Decline</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>}
                        </View>
                    </View>
                    <View style={styles.group4}>
                        <View style={styles.rect5Stack}>
                            <View style={styles.rect5}>
                                <View style={styles.group11}>
                                    <Text style={styles.name}>Name</Text>
                                    <Text style={styles.job}>Radio Operator</Text>
                                </View>
                                <View style={styles.group2}>
                                    <View style={styles.icon2Row}>
                                        <Entypo name="circle" style={styles.icon2}></Entypo>
                                        <Text style={styles.role}>FOR EVALUATION</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.group12}>
                                <Text style={styles.submitted}>Submitted:{"\n"}99/99/99</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Approval visible={approveVisible} onDismissed={onApproveDismissed}/>
            <Disapproval visible={visible} onDismissed={onDismissed}/>
            <Endorsed visible={endorseVisible} onDismissed={onEndorseDismissed}/>
        </Modal>


    );
}

export default ActivityModal
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group13: {
        top: 0,
        left: 0,
        width: width,
        height: 812,
        position: "absolute"
    },
    rect16: {
        backgroundColor: "rgba(255,255,255,1)",
        flex: 1
    },
    group: {
        height: 100,
        flex: 0
    },
    rect3: {
        height: 100
    },
    rect2: {
        height: 100,
        backgroundColor: "rgba(0,65,172,1)"
    },
    icon: {
        color: "rgba(255,255,255,1)",
        fontSize: 24,
        marginTop: 55,
        marginLeft: 14
    },
    group3: {
        width: 100,
        height: 97,
        flex: 0
    },
    rect4: {
        top: 0,
        left: 0,
        width: 100,
        height: 97,
        position: "absolute"
    },
    ellipse: {
        top: 17,
        left: 20,
        width: 81,
        height: 81,
        position: "absolute"
    },
    rect4Stack: {
        width: 101,
        height: 98
    },
    group8: {
        width: 309,
        height: 30,
        marginTop: 29,
        marginLeft: 33
    },
    rect11: {
        height: 28,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row",
        marginLeft: -33,
        marginRight: -33
    },
    group5: {
        height: 28
    },
    rect6: {
        height: 3,

        marginTop: 10
    },
    group6: {
        height: 28,
        marginLeft: 19
    },
    application: {
        color: primaryColor
    },
    rect8: {
        height: 2,
        backgroundColor: primaryColor,
        marginTop: 10
    },
    group7: {
        height: 28,
        marginLeft: 29
    },
    requirement: {
        color: primaryColor
    },
    rect10: {
        height: 2,
        backgroundColor: primaryColor,
        marginTop: 10
    },
    group5Row: {
        height: 28,
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        marginLeft: "5%"
    },
    rect12: {
        width: width,
        height: 1,
        backgroundColor: "#E6E6E6",
        marginTop: 1,
        marginLeft: -33
    },
    group10: {
        height: "60%",
        marginTop: 30
    },








    groupColumn: {},
    groupColumnFiller: {
        flex: 1,

    },
    group14: {},
    rect18Filler: {
        flex: 1
    },
    rect18: {
        height: 50,
        backgroundColor: "rgba(255,255,255,1)"
    },
    endWrapperFiller: {
        flex: 1
    },
    rect19: {
        height: 1,
        backgroundColor: "#E6E6E6",
        marginBottom: 14
    },
    group15: {
        width: 331,
        height: 32,
        flexDirection: "row",
        alignSelf: "center"
    },
    button3: {
        width: 100,
        height: 31
    },
    rect22Filler: {
        flex: 1
    },
    rect22: {
        height: 31,
        backgroundColor: "rgba(0,171,118,1)",
        borderRadius: 6
    },
    approvedFiller: {
        flex: 1
    },
    approved: {
        color: "rgba(255,255,255,1)",
        textAlign: "center",
        marginBottom: 8,
        alignSelf: "center"
    },
    button2: {
        width: 100,
        height: 31,
        marginLeft: 15
    },
    rect23Filler: {
        flex: 1
    },
    rect23: {
        height: 31,
        backgroundColor: "rgba(40,99,214,1)",
        borderRadius: 6
    },
    endorseFiller: {
        flex: 1
    },
    endorse: {
        color: "rgba(255,255,255,1)",
        textAlign: "center",
        marginBottom: 7
    },
    button3Row: {
        height: 31,
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 1
    },
    button3RowFiller: {
        flex: 1,
        flexDirection: "row"
    },
    button: {
        width: 100,
        height: 31,
        borderWidth: 1,
        borderColor: "rgba(194,0,0,1)",
        borderRadius: 6,
        alignSelf: "flex-end"
    },
    rect24Filler: {
        flex: 1
    },
    rect24: {
        height: 31,
        borderRadius: 6,
        marginBottom: 2
    },
    endorse1Filler: {
        flex: 1
    },
    endorse1: {
        color: "rgba(194,0,0,1)",
        textAlign: "center",
        marginBottom: 7
    },
    rect19Column: {
        marginBottom: 10
    },
    group4: {
        top: 100,
        width: 264,
        height: 97,
        position: "absolute",
        right: 0,
        flex: 0,
        backgroundColor: "rgba(230, 230, 230,1)"
    },
    rect5: {
        top: 0,
        width: 264,
        height: 97,
        position: "absolute",
        right: 0,
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,1)"
    },
    group11: {
        width: 264,
        height: 39,
        backgroundColor: "rgba(255,255,255,1)",
        marginTop: 26
    },
    name: {
        fontWeight: "bold",
        color: "#121212",
        textAlign: "left",
        fontSize: 20
    },
    job: {
        color: "rgba(98,108,130,1)",
        fontSize: 14,
        textAlign: "left"
    },
    group2: {
        width: 264,
        height: 21,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row",
        marginLeft: -264,
        marginTop: 65
    },
    icon2: {
        color: "rgba(248,170,55,1)",
        fontSize: 10
    },
    role: {
        fontWeight: "bold",
        color: "rgba(248,170,55,1)",
        fontSize: 10,
        textAlign: "left",
        marginLeft: 4
    },
    icon2Row: {
        height: 11,
        flexDirection: "row",
        flex: 1,
        marginRight: 171,
        marginTop: 6
    },
    group12: {
        top: 26,
        left: 195,
        width: 69,
        height: 72,
        position: "absolute"
    },
    submitted: {
        color: "rgba(105,114,135,1)",
        textAlign: "right",
        fontSize: 10
    },
    rect5Stack: {
        width: 264,
        height: 98
    },
    group13Stack: {
        width: 376,
        height: 812
    }
});