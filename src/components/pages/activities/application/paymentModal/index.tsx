import React from "react";
import BackgroundPayment from "@assets/svg/backgroundpayment";
import {Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";

const {width, height} = Dimensions.get('window');
const PaymentModal = (props: any) => {

    return <Modal
        animationType="slide"
        transparent={false}
        visible={props.visible}
        onRequestClose={() => {
            props.onDismissed()
        }}>
        <View style={{
            backgroundColor: '#e6e6e6',
            flex: 1
        }
        }>
            <View style={styles.container}>
                <View style={
                    {
                        padding: 20,
                        paddingTop: 35,
                        paddingBottom: 10,
                        alignItems: 'flex-end',
                        backgroundColor: "rgba(0,65,172,1)"
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            props.onDismissed()
                        }}
                    >
                        <Text style={styles.close}>Close</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {/* <BackgroundPayment style={{position:"absolute", marginTop: -150}} width={width}></BackgroundPayment> */}
                    <View style={{position: "absolute", top: -60}}>
                        <BackgroundPayment width={width}></BackgroundPayment>
                    </View>
                    <View style={{position: "absolute", top: 60}}>
                        <BackgroundPayment width={width}></BackgroundPayment>
                    </View>
                    <View style={[styles.group8, {alignItems: 'center', marginBottom: 100}]}>
                        <View style={styles.group5}>
                            <Text style={styles.paymentReceivedFor}>Payment received for</Text>
                            <Text style={styles.ntcEdge}>NTC-EDGE</Text>
                            <Text style={styles.theAmoutOf}>the amout of</Text>
                            <Text style={styles.php5000}>PHP {props?.totalFee}</Text>

                            {props?.paymentMethod &&
                            <Text style={styles.loremIpsum}>using your {props?.paymentMethod}</Text>}
                        </View>
                        <View style={styles.group2}>
                            <View style={styles.rect}>
                                <Text style={styles.refNo12345678910}>Ref. No. 12345678910</Text>
                                {props?.updatedAt &&
                                <Text style={styles.text}>{moment(props?.updatedAt).format('LLL')}</Text>}
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
                                <View style={styles.group4}>

                                    <Text style={styles.emailInput}>{props?.applicant?.user?.email}</Text>
                                    <Text style={styles.php000}>PHP {props?.totalFee}</Text>
                                    <Text style={styles.loremIpsum3}>1234567</Text>
                                    <Text style={styles.jmGrills}>{props?.applicant?.user?.firstName}</Text>
                                    <Text style={styles.php50003}>PHP {props?.totalFee}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
    },
    group8: {
        width: "100%",
        height: 473,
        marginTop: 70,
        alignSelf: "center"
    },
    group5: {
        alignItems: "center"
    },
    paymentReceivedFor: {
        color: "#121212",
        textAlign: 'center'
    },
    ntcEdge: {
        color: "#121212",
        marginTop: 4,
        textAlign: 'center'
    },
    theAmoutOf: {
        color: "#121212",
        marginTop: 24,
        textAlign: 'center'
    },
    php5000: {
        color: "#121212",

    },
    loremIpsum: {
        color: "#121212",
        marginTop: 25
    },
    group2: {
        width: '100%',
        marginTop: 30,
        alignItems: 'center'
    },
    rect: {
        width: width * 0.65,
        padding: 15,
        paddingVertical: 25,
        borderWidth: 1,
        borderColor: "rgba(151,151,151,1)",
        borderStyle: "dashed",
        justifyContent: 'center',
        alignItems: 'center',
    },
    group: {},
    refNo12345678910: {
        color: "#121212",
        fontSize: 16,
        textAlign: 'center',
    },
    text: {
        color: "#121212",
        marginTop: 11,
        textAlign: 'center',
    },
    group6: {

        height: 187,
        marginTop: 23
    },
    details: {
        fontWeight: "bold",
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

        height: 148,
        justifyContent: "space-around"
    },
    emailInput: {
        color: "#121212",
        alignSelf: "stretch",
        textAlign: 'right'
    },
    php000: {
        color: "#121212",
        alignSelf: "stretch",
        textAlign: 'right'
    },
    loremIpsum3: {
        color: "#121212",
        alignSelf: "stretch",
        textAlign: 'right'
    },
    jmGrills: {
        color: "#121212",
        alignSelf: "stretch",
        textAlign: 'right'
    },
    php50003: {
        color: "#121212",
        alignSelf: "stretch",
        textAlign: 'right'
    },
    group3Row: {
        height: 148,
        flexDirection: "row",
        marginTop: 22,
        marginRight: 1
    }
});

export default PaymentModal