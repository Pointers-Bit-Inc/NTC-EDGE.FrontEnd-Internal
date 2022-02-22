import React, {useState} from "react";
import {Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Entypo, Ionicons} from "@expo/vector-icons";
import {primaryColor, text} from "@styles/color";
import Disapproval from "@pages/activities/modal/disapproval";
import Endorsed from "@pages/activities/modal/endorse";
import Approval from "@pages/activities/modal/approval";
import BasicInfo from "@pages/activities/application/basicInfo";
import Requirement from "@pages/activities/application/requirementModal/requirement";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Payment from "@pages/activities/application/paymentModal/payment";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {formatDate, handleInfinityScroll, statusColor, statusIcon} from "@pages/activities/script";
import axios from "axios";
import {BASE_URL} from "../../../services/config";
import {APPROVED, DECLINED, FOREVALUATION} from "../../../reducers/activity/initialstate";
import {updateActivityStatus} from "../../../reducers/activity/actions";
import AwesomeAlert from "react-native-awesome-alerts";
import {Bold} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";

const {width} = Dimensions.get('window');


function ActivityModal(props: any) {
    const dispatch = useDispatch();
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
            isShow: ['director', 'evaluator']
        },
        {
            id: 4,
            name: 'SOA & Payment',
            active: false,
            isShow: ['cashier']
        },
    ])
    const [visible, setVisible] = useState(false)
    const [endorseVisible, setEndorseVisible] = useState(false)
    const [approveVisible, setApproveVisible] = useState(false)
    const [status, setStatus] = useState("")
    const [message, setMessage] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const onDismissed = () => {
        setVisible(false)
    }
    const onEndorseDismissed = () => {
        setEndorseVisible(false)
    }
    const onApproveDismissed = () => {
        setApproveVisible(false)
    }
    const onChangeApplicationStatus = async (status:string) => {

        const id = props?.details?.activityDetails?.application?._id,
            config = {
                headers: {
                    Authorization: "Bearer ".concat(user.sessionToken)
                }
            }

        if (id) {
            await axios.patch(BASE_URL + `/applications/${id}/update-status`, {
                status: status
            }, config ).then((response) => {

                return axios.get(BASE_URL + `/application/${id}`, config)
            }).then((response) => {
                dispatch(updateActivityStatus({application: response.data, status: status}))
                setStatus(status)
            })
        }

    }
    const [backgroundColour, setBackgroundColour] = useState("#fff")

    function onShowConfirmation(status: string) {
        const name = props?.details?.activityDetails?.application?.applicant?.user
        setMessage(`are you sure you want to ${status.toLowerCase()} ` + name.firstName + " " + name.lastName)
        setShowAlert(true)

    }

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
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            } : {}}/>
            <AwesomeAlert
                actionContainerStyle={{
                    flexDirection: "row-reverse"
                }}
                show={showAlert}
                showProgress={false}
                title="Confirm?"
                message={message}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Cancel"
                confirmText="Yes"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setShowAlert(false)
                }}
                onConfirmPressed={() => {
                    onChangeApplicationStatus(APPROVED).then(r =>  setApproveVisible(true))
                    setShowAlert(false)
                }}
            />
            <View style={styles.container}>
                <View style={styles.group13Stack}>
                    <View style={styles.group13}>
                        <View style={styles.rect16}>
                            <View>
                                <View style={styles.group}>
                                    <View style={styles.rect3}>
                                        <View style={styles.rect2}>
                                            <TouchableOpacity onPress={() => {
                                                setStatus("")
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
                                        <Image source={{
                                            uri: 'https://reactnative.dev/img/tiny_logo.png'
                                        }} style={styles.ellipse}/>

                                    </View>
                                </View>
                                <View style={styles.group8}>
                                    <View style={styles.rect11}>
                                        <View style={styles.group5Row}>
                                            {
                                                tabs.map((tab, index) => {

                                                    return tab.isShow.indexOf(user?.role?.key) != -1 &&
                                                        <TouchableOpacity key={index} onPress={() => {
                                                            let newArr = [...tabs]
                                                            for (let i = 0; i < newArr.length; i++) {
                                                                if (newArr[i].active) {
                                                                    newArr[i].active = !newArr[i].active
                                                                }
                                                            }
                                                            newArr[index].active = true
                                                            if (newArr[index].id == 3) {
                                                                setBackgroundColour("#f0f0f0")
                                                            } else {
                                                                setBackgroundColour("#fff")
                                                            }

                                                            setTabs(newArr)
                                                        }
                                                        }>
                                                            {<View style={[styles.group5]}>
                                                                <Text
                                                                    style={{color: tab.active ? primaryColor : text.default}}>{tab.name}</Text>
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
                                        tabs.map((tab, index) => {
                                            const isShow = tab.isShow.indexOf(user?.role?.key) != -1,
                                                applicant = props?.details?.activityDetails?.application?.applicant,
                                                selectedTypes = props?.details?.activityDetails?.application?.selectedTypes,
                                                applicationType = props?.details?.activityDetails?.application?.applicationType,
                                                service = props?.details?.activityDetails?.application?.service,
                                                soa = props?.details?.activityDetails?.application?.soa,
                                                totalFee = props?.details?.activityDetails?.application?.totalFee,
                                                requirements = props?.details?.activityDetails?.application?.requirements,
                                                proofOfPayment = props?.details?.activityDetails?.application?.proofOfPayment
                                            if (isShow && tab.id == 1 && tab.active) {
                                                return <BasicInfo
                                                    applicant={applicant}
                                                    key={index}/>
                                            } else if (isShow && tab.id == 2 && tab.active) {
                                                return <ApplicationDetails
                                                    service={service}
                                                    selectedType={selectedTypes}
                                                    applicantType={applicationType}
                                                    key={index}/>
                                            } else if (isShow && tab.id == 3 && tab.active) {
                                                return <Requirement requirements={requirements} key={index}/>
                                            } else if (isShow && tab.id == 4 && tab.active) {
                                                return <Payment proofOfPayment={} applicant={applicant}  totalFee={totalFee}
                                                                soa={soa} key={index}/>
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
                                                {["director", 'evaluator', 'cashier'].indexOf(user?.role?.key) != -1 &&
                                                <TouchableOpacity onPress={() => {
                                                    onShowConfirmation(APPROVED)


                                                }}
                                                                  style={[styles.button3, {width: user?.role?.key == "cashier" ? 220 : 100,}]}>
                                                    <View style={styles.rect22Filler}></View>
                                                    <View style={styles.rect22}>
                                                        <View style={styles.approvedFiller}></View>
                                                        <Text style={styles.approved}>Approved</Text>
                                                    </View>
                                                </TouchableOpacity>}
                                                {["director", 'evaluator'].indexOf(user?.role?.key) != -1 &&
                                                <TouchableOpacity onPress={() => {
                                                    setEndorseVisible(true)
                                                }
                                                } style={styles.button2}>
                                                    <View style={styles.rect23Filler}></View>
                                                    <View style={styles.rect23}>
                                                        <View style={styles.endorseFiller}></View>
                                                        <Text style={styles.endorse}>Endorse</Text>
                                                    </View>
                                                </TouchableOpacity>}
                                            </View>
                                            {["director", 'evaluator', 'cashier'].indexOf(user?.role?.key) != -1 &&
                                            <><View style={styles.button3RowFiller}></View>
                                                <TouchableOpacity onPress={() => {
                                                    setVisible(true)
                                                }} style={styles.button}>
                                                    <View style={styles.rect24Filler}></View>
                                                    <View style={styles.rect24}>
                                                        <View style={styles.endorse1Filler}></View>
                                                        <Text style={styles.endorse1}>Decline</Text>
                                                    </View>
                                                </TouchableOpacity></>
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>}
                        </View>
                    </View>
                    <View style={styles.group4}>
                        <View>
                            <View style={styles.rect5}>
                                <View style={styles.group11}>
                                    <Text
                                        style={styles.name}>{props?.details?.activityDetails?.application?.applicant?.user?.firstName + " " + props?.details?.activityDetails?.application?.applicant?.user?.lastName}</Text>
                                    <Text style={styles.job}>{props?.details?.activityDetails?.applicationType}</Text>
                                </View>
                                <View style={styles.group2}>
                                    <View style={styles.icon2Row}>
                                        {statusIcon(props?.details?.activityDetails?.status, styles.icon2)}
                                        <Text style={[styles.role,statusColor(status ? status : props?.details?.activityDetails?.status)]}>{status ? status : props?.details?.activityDetails?.status}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.group12}>
                                <Text
                                    style={styles.submitted}>Submitted:{"\n"}{props?.details?.createdAt ? formatDate(props?.details?.createdAt) : ""}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Approval  visible={approveVisible} onDismissed={onApproveDismissed}/>
            <Disapproval user={props?.details?.activityDetails?.application?.applicant?.user} onChangeApplicationStatus={(event:string)=>{
                onChangeApplicationStatus(DECLINED).then(() =>{
                    onDismissed()
                })
            }} visible={visible} onDismissed={onDismissed}/>
            <Endorsed onChangeApplicationStatus={(event:string)=>{
                onChangeApplicationStatus(event)


            }} visible={endorseVisible} onDismissed={onEndorseDismissed}/>
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
        backgroundColor: "#041B6E"
    },
    icon: {
        color: "rgba(255,255,255,1)",
        fontSize: RFValue(24),
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
        borderRadius: 40,
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
        fontFamily: Bold,
        color: "#121212",
        textAlign: "left",
        fontSize: RFValue(20)
    },
    job: {
        color: "rgba(98,108,130,1)",
        fontSize:  RFValue(10),
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
        fontSize: RFValue(10)
    },
    role: {
        fontFamily: Bold,
        fontSize: RFValue(10),
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




