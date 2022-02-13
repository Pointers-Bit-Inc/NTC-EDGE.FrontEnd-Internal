import React from "react";
import BackgroundPayment from "@assets/svg/backgroundpayment";
import {Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";

const {width, height} = Dimensions.get('window');
const PaymentModal = (props: any) => {
    function Cell({ data }) {
        return (
            <View style={styles.cellStyle}>
                <Text>{data}</Text>
            </View>
        );
    }
    function Row({ column }) {
        return (
            <View style={styles.rowStyle}>
                {column.map((data) => (
                    <Cell data={data} />
                ))}
            </View>
        );
    }
    const data = [
        ["Email", props?.applicant?.user?.email],
        ["Fee", "PHP " +  props?.totalFee],
        ["Account number", "1234567"],
        ["Account", props?.applicant?.user?.firstName + " " + props?.applicant?.user?.lastName],
        ["Amount paid", "PHP" + props?.totalFee],
    ];
    return <Modal
        supportedOrientations={['portrait', 'landscape']}
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
                        backgroundColor: "#041B6E"
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
                            <View style={styles.gridContainer}>
                                {data.map((column, index) => (
                                    <Row key={index} column={column} />
                                ))}
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    gridContainer: {
        justifyContent: "center",


        alignItems: "center"
    },
    rowStyle: {
        width: width,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    cellStyle: {
        flex: 1,
        margin: 10,
    },
    container: {
        flex: 1
    },
    group7: {

        height: 100
    },
    rect2: {
        width: "100%",
        height: 100,
        backgroundColor: "#041B6E"
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

        marginTop: 23
    },
    details: {
        fontWeight: "bold",
        color: "#121212",
        alignSelf: "center"
    },
    group3: {
        paddingVertical: 20,
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

        paddingVertical: 20,
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