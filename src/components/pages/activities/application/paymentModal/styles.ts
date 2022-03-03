import {StyleSheet} from "react-native";
import {Bold} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        marginBottom: 15
    },
    group: {
        width: 375,
        marginLeft: 20
    },
    statementOfAccount: {
        fontFamily: Bold,
        color: "#37405B",
        fontSize: RFValue(14)
    },
    soaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D1D6',
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
        fontFamily: Bold,
        top: 0,
        left: 0,

        fontSize: RFValue(16)
    },
    text: {
        width: 350,

        left: 0,

        fontSize: RFValue(14)
    },
    applicantStack: {
    },
    selectedTypes: {

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

    },
    billingDetailFiller: {
        flex: 1,
        flexDirection: "row"
    },
    loremIpsum8: {

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
        width: 328,
        height: 65,
        position: "absolute",
        borderWidth: 1,
        borderStyle: "dashed",
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        alignItems: "flex-end"
    },
    subtotal2: {

        fontSize: RFValue(16),
        textAlign: "right",
        marginTop: 13,
        marginRight: 62
    },
    vat: {


        fontSize: RFValue(32),
        textAlign: "right",
        marginTop: 1,
        marginRight: 63
    },
    p0000: {
        top: 14,
        position: "absolute",

        right: 0
    },
    p9: {
        top: 35,
        position: "absolute",

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
        width: '100%',
        height: 10,
        backgroundColor: "#E6E6E6",
        marginTop: 20,
        marginBottom: 20,
    },
    payment2: {
        fontFamily: Bold,

        marginTop: 15,
        marginLeft: 21
    },
    paymentReceiptPng: {

        fontSize: RFValue(16),
        marginTop: 10,
        textAlign: "center"
    },
    paymentReceivedFor: {

        marginTop: 17,
        textAlign: "center"
    },
    ntcEdge: {

        fontSize: RFValue(16),
        marginTop: 17,
        textAlign: "center"
    },
    theAmoutOf: {

        marginTop: 16,
        textAlign: "center"
    },
    php5000: {

        fontSize: RFValue(16),
        textAlign: "center"
    },
    text2: {

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
        fontSize: RFValue(18)
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