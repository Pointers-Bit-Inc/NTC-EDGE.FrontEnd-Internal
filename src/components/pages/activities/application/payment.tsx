import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Entypo} from "@expo/vector-icons";
import PaymentModal from "@pages/activities/application/paymentModal/index";
const Payment = (props:any) => {
    const [visibleModal, setVisibleModal] = useState(false)
    const onDismissed = () =>{
        setVisibleModal(false)
    }

    return <>
        <View style={styles.container}>
            <View style={styles.group}>
                <Text style={styles.statementOfAccount}>Statement of Account</Text>

            </View>
            <View style={styles.group4}>
                <View style={styles.rect3}></View>

            </View>
            <View style={styles.group2}>
                <Text style={styles.billingDetails}>Billing details</Text>
                <View style={styles.rect4Stack}>
                    <View style={styles.rect4}>
                        { props.soa.map((soa: any, index:number)=>{
                            return <Text >{soa.item}:{soa.amount} </Text>
                        })

                        }
                    </View>

                </View>
            </View>
            <View style={styles.rect5}></View>
            <View>
                <Text style={styles.payment2}>Payment</Text>
                <Text style={styles.paymentReceiptPng}>Payment Receipt.png</Text>
                <Text style={styles.paymentReceivedFor}>Payment received for</Text>
                <Text style={styles.ntcEdge}>NTC-EDGE</Text>
                <Text style={styles.theAmoutOf}>the amout of</Text>
                <Text style={styles.php5000}>PHP {props.totalFee}</Text>
                <View style={styles.group6}>
                    <View style={styles.rect6}>
                        <View style={styles.group5}>
                            <TouchableOpacity onPress={()=>{
                                setVisibleModal(true)
                            }
                            }>
                                <View style={styles.iconRow}>
                                    <Entypo name="eye" style={styles.icon}></Entypo>
                                    <Text style={styles.rect7}>View</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </View>

        </View>
        <PaymentModal visible={visibleModal} onDismissed={onDismissed}  />
    </>

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "center",
    },
    group: {

        width: 375,
        marginLeft: 20
    },
    statementOfAccount: {
        fontWeight: "bold",
        color: "#121212",
        fontSize: 16
    },
    rect2: {
        width: 328,
        height: 27,
        backgroundColor: "#E6E6E6"
    },
    file: {
        color: "rgba(86,89,97,1)",
        marginTop: 5,
        marginLeft: 9
    },
    applicant: {
        fontWeight: "bold",
        top: 0,
        left: 0,
        color: "#121212",
        fontSize: 16
    },
    text: {
        width: 350,

        left: 0,
        color: "#121212",
        fontSize: 14
    },
    applicantStack: {
    },
    selectedTypes: {
        color: "#121212",
        marginTop: 6
    },
    group4: {
        width: 328,
        height: 58,
        marginTop: 12,
        marginLeft: 21
    },
    rect3: {
        width: 328,
        height: 27,
        backgroundColor: "#E6E6E6"
    },
    group3: {
        width: 328,
        height: 16,
        flexDirection: "row",
        marginTop: 15
    },
    billingDetail: {
        color: "#121212"
    },
    billingDetailFiller: {
        flex: 1,
        flexDirection: "row"
    },
    loremIpsum8: {
        color: "#121212"
    },
    group2: {
        width: 328,
        height: 65,
        marginTop: 12,
        marginLeft: 21
    },
    billingDetails: {
        color: "rgba(86,89,97,1)",
        marginTop: -65,
        marginLeft: 9
    },
    rect4: {
        top: 0,
        left: 0,
        width: 328,
        height: 65,
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(128,129,150,1)",
        borderStyle: "dashed",
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        alignItems: "flex-end"
    },
    subtotal2: {
        color: "#121212",
        fontSize: 16,
        textAlign: "right",
        marginTop: 13,
        marginRight: 62
    },
    vat: {

        color: "#121212",
        fontSize: 16,
        textAlign: "right",
        marginTop: 1,
        marginRight: 63
    },
    p0000: {
        top: 14,
        position: "absolute",
        color: "#121212",
        right: 0
    },
    p9: {
        top: 35,
        position: "absolute",
        color: "#121212",
        right: 0
    },
    rect4Stack: {
        width: 329,
        height: 65,
        alignSelf: "flex-end",
        marginTop: 49,
        marginRight: -1
    },
    rect5: {
        width: 375,
        height: 10,
        backgroundColor: "#E6E6E6",
        marginTop: 40
    },
    payment2: {
        color: "#121212",
        marginTop: 15,
        marginLeft: 21
    },
    paymentReceiptPng: {
        color: "#121212",
        fontSize: 16,
        marginTop: 10,
        textAlign: "center"
    },
    paymentReceivedFor: {
        color: "#121212",
        marginTop: 17,
        textAlign: "center"
    },
    ntcEdge: {
        color: "#121212",
        fontSize: 16,
        marginTop: 17,
        textAlign: "center"
    },
    theAmoutOf: {
        color: "#121212",
        marginTop: 16,
        textAlign: "center"
    },
    php5000: {
        color: "#121212",
        fontSize: 16,
        marginTop: 14,
        textAlign: "center"
    },
    text2: {
        color: "#121212",
        marginTop: 21,
        marginLeft: 100
    },
    group6: {
        width: 90,
        height: 36,
        marginTop: 15,
        alignSelf:"center"
    },
    rect6: {

        alignSelf:"center",
        width: 90,
        borderRadius: 10,
        height: 36,
        backgroundColor: "rgba(243,245,247,1)"
    },
    group5: {
        width: 52,
        height: 21,
        flexDirection: "row",
        marginTop: 8,
        marginLeft: 19
    },
    icon: {
        color: "rgba(40,99,214,1)",
        fontSize: 18
    },
    rect7: {
        color: "#2763d6",
        marginLeft: 4,
        marginTop: 3
    },
    iconRow: {
        height: 21,
        flexDirection: "row",
        flex: 1
    }
});

export default Payment