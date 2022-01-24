import React from "react";
import BackgroundPayment from "@assets/svg/backgroundpayment";
import {Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";


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


export default PaymentModal