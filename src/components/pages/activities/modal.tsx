import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {primaryColor, text} from "@styles/color";
import Disapproval from "@pages/activities/disapproval";
import Endorsed from "@pages/activities/endorse";
import Approval from "@pages/activities/approval";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {
    formatDate,
    PaymentStatusText,
    statusColor,
    statusIcon,
    StatusText
} from "@pages/activities/script";
import {
    APPROVED,
    CASHIER,
    DECLINED,
    DIRECTOR,
    EVALUATOR,
    FOREVALUATION,
    PAID,
} from "../../../reducers/activity/initialstate";
import ProfileImage from "@components/atoms/image/profile";
import CustomText from "@components/atoms/text";
import AwesomeAlert from "react-native-awesome-alerts";
import Api from 'src/services/api';
import {updateApplicationStatus} from "../../../reducers/application/actions";
import {ModalTab} from "@pages/activities/modalTab";

const {width} = Dimensions.get('window');

function ActivityModal(props: any) {
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const applicant = props?.details?.applicant?.user
    const [change, setChange] = useState<boolean>(false)
    useEffect(() => {
        setChange(false)
    }, [])
    const [tabs, setTabs] = useState([
        {
            id: 1,
            name: 'Basic Info',
            active: true,
            isShow: [CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 2,
            name: 'Application Details',
            active: false,
            isShow: [CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 3,
            name: 'Requirements',
            active: false,
            isShow: [DIRECTOR, EVALUATOR]
        },
        {
            id: 4,
            name: 'SOA & Payment',
            active: false,
            isShow: [CASHIER]
        },
    ])
    const [visible, setVisible] = useState(false)
    const [endorseVisible, setEndorseVisible] = useState(false)
    const [approveVisible, setApproveVisible] = useState(false)
    const [status, setStatus] = useState("")
    const [message, setMessage] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [currentLoading, setCurrentLoading] = useState('');
    const [assignId, setAssignId] = useState("")
    const [remarks, setRemarks] = useState("")
    const onDismissed = () => {
        setVisible(false)
    }
    const onEndorseDismissed = () => {
        setEndorseVisible(false)
    }
    const onApproveDismissed = () => {
        setApproveVisible(false)
    }
    const onChangeApplicationStatus = async (status: string, callback = (err: any) => {
    }) => {
        const api = Api(user.sessionToken);
        const applicationId = props?.details?._id;
        let url = `/applications/${applicationId}/update-status`;
        let params: any = {
            status,
            remarks: remarks ? remarks : undefined,
            assignedPersonnel: assignId ? assignId : undefined,
        };
        setCurrentLoading(status);
        if (status == DECLINED) {
            setAssignId("")
        }
        if (user?.role?.key == CASHIER) {
            url = `/applications/${applicationId}/update-payment-status`;
            params = {
                paymentStatus: status,
                remarks: remarks ? remarks : undefined,
            };
        }

        

        console.log(url, params);
        if (applicationId) {
            await api.patch(url, params)
                .then(res => {
                    setCurrentLoading('');
                    if (res.status === 200) {
                        if (res.data) {
                            dispatch(updateApplicationStatus({
                                application: res.data,
                                status: status,
                                assignedPersonnel: assignId,
                                userType: user?.role?.key
                            }))
                            setAssignId("")
                            setStatus(PaymentStatusText(status))
                            setChange(true)
                            setStatus("")
                            props.onDismissed(true, applicationId)

                            return callback(null);
                        }
                    }

                    Alert.alert('Alert', 'Something went wrong.');

                    return callback('error');
                })
                .catch(e => {
                    setCurrentLoading('');
                    Alert.alert('Alert', e?.message || 'Something went wrong.')
                    return callback(e);
                })
        }
    }
    const [backgroundColour, setBackgroundColour] = useState("#fff")

    function onShowConfirmation(status: string) {
        const name = props?.details?.applicant?.user
        setMessage(`Are you sure you want to ${status.toLowerCase()} this application?`)
        setShowAlert(true)

    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.visible}
            onRequestClose={() => {

                props.onDismissed(change)
                setChange(false)
            }}>
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Confirm?"
                message={message}
                messageStyle={{textAlign: 'center'}}
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
                    let status = ""
                    if ([CASHIER, DIRECTOR, EVALUATOR].indexOf(user?.role?.key) != -1) {
                        status = APPROVED
                    } else {
                        status = DECLINED
                    }

                    setShowAlert(false)
                    onChangeApplicationStatus(status)
                }}
            />
            <View style={{flex: 1}}>
                <View style={{padding: 15, paddingTop: 35, backgroundColor: primaryColor}}>
                    <TouchableOpacity onPress={() => {
                        setStatus("")
                        props.onDismissed(change)
                        setChange(false)
                    }}>
                        <Ionicons
                            name="md-close"
                            color={'white'}
                            size={28}
                        ></Ionicons>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', padding: 15}}>
                    <ProfileImage
                        size={65}
                        textSize={22}
                        image={applicant?.image}
                        name={`${applicant?.firstName} ${applicant?.lastName}`}
                    />
                    <View style={{paddingHorizontal: 15, flex: 1}}>
                        <CustomText
                            weight="bold"
                            color={text.default}
                            size={18}
                            numberOfLines={1}
                        >
                            {`${applicant?.firstName} ${applicant?.lastName}`}
                        </CustomText>
                        <CustomText
                            style={{marginVertical: 3}}
                            color={text.default}
                            size={14}
                            numberOfLines={1}
                        >
                            {props?.details?.applicationType}
                        </CustomText>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {
                                statusIcon(
                                    status ?
                                        status :
                                        (user?.role?.key == CASHIER ?
                                                PaymentStatusText(props?.details?.paymentStatus) :
                                                (status ?
                                                        status :
                                                        StatusText(props?.details?.status)
                                                )
                                        ),
                                    styles.icon2
                                )
                            }
                            <CustomText
                                style={[
                                    styles.role,
                                    statusColor(
                                        status ?
                                            status :
                                            (user?.role?.key == CASHIER ?
                                                    PaymentStatusText(props?.details?.paymentStatus) :
                                                    (status ?
                                                            status :
                                                            StatusText(props?.details?.status)
                                                    )
                                            )
                                    ),
                                    {
                                        fontSize: 16,
                                        fontWeight: 'normal',
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {
                                    status ?
                                        status :
                                        (user?.role?.key == CASHIER ?
                                                PaymentStatusText(props?.details?.paymentStatus) :
                                                (status ?
                                                        status :
                                                        StatusText(props?.details?.status)
                                                )
                                        )
                                }
                            </CustomText>
                        </View>
                    </View>
                    <View>
                        <Text
                            style={styles.submitted}
                        >
                            Submitted:{"\n"}{props?.details?.createdAt ? formatDate(props?.details?.createdAt) : ""}
                        </Text>
                    </View>
                </View>
                <ModalTab details={props.details}/>
                {
                    true &&
                    <View style={styles.footer}>
                        {[DIRECTOR, EVALUATOR, CASHIER].indexOf(user?.role?.key) != -1 &&
                        <View style={{flex: 1, paddingRight: 5}}>
                            <TouchableOpacity
                                disabled={currentLoading === APPROVED}
                                onPress={() => {
                                    setApproveVisible(true)
                                }}
                            >
                                {/* <View style={styles.rect22Filler}></View>
                                <View style={styles.rect22}>
                                    <View style={styles.approvedFiller}></View>
                                    <Text style={styles.approved}>Approved</Text>
                                </View> */}
                                <View style={[styles.rect22, {
                                    height: undefined,
                                    paddingVertical: currentLoading === APPROVED ? 6 : 8
                                }]}>
                                    {
                                        currentLoading === APPROVED ? (
                                            <ActivityIndicator color={'white'} size={'small'}/>
                                        ) : (
                                            <Text style={styles.approved}>
                                                Approve
                                            </Text>
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>}
                        {[EVALUATOR].indexOf(user?.role?.key) != -1 &&
                        <View style={{flex: 1, paddingHorizontal: 5}}>
                            <TouchableOpacity
                                disabled={currentLoading === FOREVALUATION}
                                onPress={() => {
                                    setEndorseVisible(true)
                                }}
                            >
                                {/* <View style={styles.rect23Filler}></View>
                                    <View style={styles.rect23}>
                                        <View style={styles.endorseFiller}></View>
                                        <Text style={styles.endorse}>Endorse</Text>
                                    </View> */}
                                <View style={[styles.rect23, {
                                    height: undefined,
                                    paddingVertical: currentLoading === FOREVALUATION ? 6.5 : 8
                                }]}>
                                    {
                                        currentLoading === FOREVALUATION ? (
                                            <ActivityIndicator color={'white'} size={'small'}/>
                                        ) : (
                                            <Text style={styles.endorse}>Endorse</Text>
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>}
                        {[DIRECTOR, EVALUATOR, CASHIER].indexOf(user?.role?.key) != -1 &&
                        <View style={{flex: 1, paddingLeft: 5}}>
                            <TouchableOpacity
                                disabled={currentLoading === DECLINED}
                                onPress={() => {
                                    setVisible(true)
                                }}
                            >
                                <View
                                    style={[
                                        styles.rect24,
                                        {
                                            height: undefined,
                                            paddingVertical: currentLoading === DECLINED ? 5 : 6.5,
                                            borderWidth: 1,
                                            borderColor: "rgba(194,0,0,1)",
                                        }]
                                    }>
                                    {
                                        currentLoading === DECLINED ? (
                                            <ActivityIndicator color={"rgba(194,0,0,1)"} size={'small'}/>
                                        ) : (
                                            <Text style={styles.endorse1}>Decline</Text>
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                        }
                    </View>
                }
            </View>
            <Approval
                onChangeRemarks={(remark: string) => {
                    setRemarks(remark)
                }}
                visible={approveVisible}
                confirm={(event: any) => {
                    setAssignId(event.cashier)
                    let status = ""
                    if ([DIRECTOR, EVALUATOR].indexOf(user?.role?.key) != -1) {
                        status = APPROVED
                    } else if ([CASHIER].indexOf(user?.role?.key) != -1) {
                        status = PAID
                    }
                    onChangeApplicationStatus(status)
                    setShowAlert(false)
                    onApproveDismissed()

                }}
                isCashier={user?.role?.key === CASHIER}
                onDismissed={onApproveDismissed}
            />
            <Disapproval
                user={props?.details?.applicant?.user}
                remarks={setRemarks}
                onChangeApplicationStatus={(event: any) => {
                    onChangeApplicationStatus(DECLINED, (err) => {
                        if (!err) {
                            onDismissed()
                        }
                    })
                }
                }
                visible={visible}
                onDismissed={onDismissed}
            />
            <Endorsed
                remarks={(event: any) => {
                    setRemarks(event.remarks)
                    setAssignId(event.endorseId)
                }}
                onChangeApplicationStatus={(event: any) => {
                    onChangeApplicationStatus(event.status);
                }}
                visible={endorseVisible}
                onDismissed={onEndorseDismissed}
            />
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
        marginTop: 8
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
        fontSize: 10,
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
    },
    footer: {
        padding: 15,
        paddingTop: 10,
        paddingBottom: 25,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        borderTopWidth: 1,
    }
});