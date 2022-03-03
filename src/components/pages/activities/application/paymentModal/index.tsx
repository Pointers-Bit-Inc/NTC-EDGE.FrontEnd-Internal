import React , {useEffect , useState} from "react";
import BackgroundPayment from "@assets/svg/backgroundpayment";
import {Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";
import {Bold , Regular , Regular500} from "@styles/font";
import {capitalize} from "@pages/activities/script";
import {RFValue} from "react-native-responsive-fontsize";
import {useComponentLayout} from "@pages/activities/hooks/useComponentLayout";
import BorderPaymentTop from "@assets/svg/borderPayment";
import BorderPaymentBottom from "@assets/svg/borderPaymentBottom";

const {width, height} = Dimensions.get('window');
const PaymentModal = (props: any) => {
    function Cell({ data }) {
        return (
            <View style={styles.cellStyle}>
                <Text style={{fontSize: RFValue(12), fontFamily: Regular}}>{data}</Text>
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
    const [sizeComponent, onLayoutComponent] = useComponentLayout()
    const [amountOfBorder, setAmountOfBorder] = useState()
    useEffect(()=>{

    }, [sizeComponent])
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
                       paddingVertical: 25,
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



                    <View style={[styles.group8, { alignItems: 'center', marginBottom: 100}]}>

                        <View >
                            <View style={{flexDirection: "row"}}>
                                {
                                    !!sizeComponent && Array(Math?.round(sizeComponent?.width/20))?.fill(0)?.map(()=> <BorderPaymentTop/>)
                                }
                            </View>
                           <View  onLayout={onLayoutComponent} style={{backgroundColor: "white"}}>
                               <View style={styles.group5}>
                                   <Text style={styles.title}>Payment received for</Text>
                                   <Text style={[styles.description]}>NTC-EDGE</Text>
                                   <Text style={styles.description}>the amout of</Text>
                                   <Text style={[styles.description, {fontFamily: Bold}]}>PHP {props?.totalFee}</Text>

                                   {props?.paymentMethod &&
                                   <Text style={styles.description}>using your {capitalize(props?.paymentMethod.replace("-", " ")) }</Text>}
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
                            <View style={{flexDirection: "row"}}>
                                {
                                    !!sizeComponent && Array(Math?.round(sizeComponent?.width/20))?.fill(0)?.map(()=> <BorderPaymentBottom/>)
                                }
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
        alignSelf: "center",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    rowStyle: {

        width: "90%",
        paddingHorizontal: 20,
        flexDirection: "row",
       
        justifyContent: "space-around",
    },
    cellStyle: {
        flex: 1,
        margin: 10,
    },
    container: {
        flex: 1,
        

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
        fontSize: RFValue(18),
    },
    group8: {
        width: "100%",
        height: 473,
        marginTop: 70,
        alignSelf: "center"
    },
    group5: {
           paddingTop: 20,
        alignItems: "center"
    },
    title: {
        fontSize: RFValue(12),
        fontFamily: Bold,
        color: "#121212",
        textAlign: 'center'
    },
    description: {
        fontSize: RFValue(12),
        fontFamily: Regular,
    },
    ntcEdge: {
        fontSize: RFValue(12),
        color: "#121212",
        marginTop: 4,
        textAlign: 'center'
    },
    theAmoutOf: {
        fontSize: RFValue(12),
        color: "#121212",
        marginTop: 24,
        textAlign: 'center'
    },
    php5000: {
        color: "#121212",
          fontFamily: Bold
    },
    loremIpsum: {
        color: "#121212",

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
        fontSize: RFValue(16),
        textAlign: 'center',
    },
    text: {
        fontSize: RFValue(12),
        color: "#121212",
        marginTop: 11,
        textAlign: 'center',
    },
    group6: {

        marginTop: 23
    },
    details: {
          fontSize: RFValue(12), 
        fontFamily: Bold,
        color: "#121212",
        alignSelf: "center"
    },
    group3: {
        paddingVertical: 20,
        alignItems: "flex-start",
        justifyContent: "space-around"
    },
    
});
export default PaymentModal