import React from "react";
import BackgroundPayment from "@assets/svg/backgroundpayment";
import {Modal, View, Text, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
const { width } = Dimensions.get('window');
const PaymentModal = (props:any) => {
    return <Modal
        animationType="slide"
        transparent={false}
        visible={props.visible}
        onRequestClose={() => {
            props.onDismissed()
        }}>
        <View style={{
            backgroundColor: '#e6e6e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: "100%"
        }
        }>
            <BackgroundPayment style={{position:"absolute"}}></BackgroundPayment>
            <View style={styles.container}>
                <View style={styles.group7}>
                    <View style={styles.rect2}>
                        <TouchableOpacity onPress={()=>{
                        props.onDismissed()
                        }
                        }>
                            <Text style={styles.close}>Close</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={styles.group8}>
                    <View style={styles.group5}>
                        <Text style={styles.paymentReceivedFor}>Payment received for</Text>
                        <Text style={styles.ntcEdge}>NTC-EDGE</Text>
                        <Text style={styles.theAmoutOf}>the amout of</Text>
                        <Text style={styles.php5000}>PHP 50.00</Text>
                        <Text style={styles.loremIpsum}>using your BPI Bank Account</Text>
                    </View>
                    <View style={styles.group2}>
                        <View style={styles.rect}>
                            <View style={styles.group}>
                                <Text style={styles.refNo12345678910}>Ref. No. 12345678910</Text>
                                <Text style={styles.text}>22 Decemeber 2021 08:04:12 AM</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.group6}>
                        <Text style={styles.details}>Details</Text>
                        <View style={styles.group3Row}>
                            <View style={styles.group3}>
                                <Text style={styles.email}>Email</Text>
                                <Text style={styles.fee}>Fee</Text>
                                <Text style={styles.accountNumber}>Account number</Text>
                                <Text style={styles.account2}>Account</Text>
                                <Text style={styles.amountPaid}>Amount paid</Text>
                            </View>
                            <View style={styles.group3Filler}></View>
                            <View style={styles.group4}>
                                <Text style={styles.emailInput}>@gmail.com</Text>
                                <Text style={styles.php000}>PHP 0.00</Text>
                                <Text style={styles.loremIpsum3}>1234567</Text>
                                <Text style={styles.jmGrills}>JM Grills</Text>
                                <Text style={styles.php50003}>PHP 50.00</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </View>

    </Modal>
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group7: {

        height: 100
    },
    rect2: {
        width: width,
        height: 100,
        backgroundColor: "rgba(0,65,172,1)"
    },
    close: {
        color: "rgba(239,231,231,1)",
        fontSize: 18,
        marginTop: 55,
        marginLeft: 313
    },
    group8: {
        width: "100%",
        height: 473,
        marginTop: 70,
        alignSelf: "center"
    },
    group5: {
        height: 133,
        marginLeft: 49
    },
    paymentReceivedFor: {
        color: "#121212",
        marginLeft: 24
    },
    ntcEdge: {
        color: "#121212",
        marginTop: 4,
        marginLeft: 57
    },
    theAmoutOf: {
        color: "#121212",
        marginTop: 24,
        marginLeft: 50
    },
    php5000: {
        color: "#121212",
        marginLeft: 56
    },
    loremIpsum: {
        color: "#121212",
        marginTop: 25
    },
    group2: {
        width: 251,
        height: 100,
        marginTop: 30,
        marginLeft: 13
    },
    rect: {
        width: 251,
        height: 100,
        borderWidth: 1,
        borderColor: "rgba(151,151,151,1)",
        borderStyle: "dashed"
    },
    group: {
        height: 46,
        marginTop: 27,
        marginLeft: 22
    },
    refNo12345678910: {
        color: "#121212",
        fontSize: 16,
        marginLeft: 22
    },
    text: {
        color: "#121212",
        marginTop: 11
    },
    group6: {

        height: 187,
        marginTop: 23
    },
    details: {
        color: "#121212",
        alignSelf: "center"
    },
    group3: {
        height: 148,
        alignItems: "flex-start",
        justifyContent: "space-around"
    },
    email: {
        color: "#121212"
    },
    fee: {
        color: "#121212"
    },
    accountNumber: {
        color: "#121212"
    },
    account2: {
        color: "#121212"
    },
    amountPaid: {
        color: "#121212"
    },
    group3Filler: {
        flex: 1,
        flexDirection: "row"
    },
    group4: {
        width: 125,
        height: 148,
        justifyContent: "space-around"
    },
    emailInput: {
        color: "#121212",
        alignSelf: "stretch"
    },
    php000: {
        color: "#121212",
        alignSelf: "stretch"
    },
    loremIpsum3: {
        color: "#121212",
        alignSelf: "stretch"
    },
    jmGrills: {
        color: "#121212",
        alignSelf: "stretch"
    },
    php50003: {
        color: "#121212",
        alignSelf: "stretch"
    },
    group3Row: {
        height: 148,
        flexDirection: "row",
        marginTop: 22,
        marginRight: 1
    }
});

export default PaymentModal