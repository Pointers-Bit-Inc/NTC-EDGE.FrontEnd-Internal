import React, {useEffect, useMemo, useState} from "react";
import {Dimensions,Modal,Platform,ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import moment from "moment";
import {Bold,Regular} from "@styles/font";
import {capitalize} from "@pages/activities/script";
import {useComponentLayout} from "../../../../../hooks/useComponentLayout";
import BorderPaymentTop from "@assets/svg/borderPayment";
import BorderPaymentBottom from "@assets/svg/borderPaymentBottom";
import {fontValue} from "@pages/activities/fontValue";
import {RootStateOrAny,useSelector} from "react-redux";
import {OnBackdropPress} from "@pages/activities/modal/onBackdropPress";
import {isMobile} from "@pages/activities/isMobile";
import useMemoizedFn from "../../../../../hooks/useMemoizedFn";

const {width, height} = Dimensions.get('window');
const PaymentModal = (_props: any) => {
    const props = useMemo(() => _props, [_props])
    const rightLayoutComponent = useSelector((state: RootStateOrAny) => state.application?.rightLayoutComponent)
    function Cell({ data }) {
        return (
            <View style={styles.cellStyle}>
                <Text style={{fontSize: fontValue(12), fontFamily: Regular}}>{data}</Text>
            </View>
        );
    }
    const Row = (({ column }) => {
        return (
            <View style={styles.rowStyle}>
                {column.map((data, index) => (
                    <Cell key={index} data={data} />
                ))}
            </View>
        );
    })

    const data = [
        ["Email", props?.applicant?.user?.email],
        ["Fee", "PHP " +  props?.totalFee],
        ["Account", props?.applicant?.user?.firstName && props?.applicant?.user?.lastName ? props?.applicant?.user?.firstName + " " + props?.applicant?.user?.lastName : (props?.applicant?.fullName || (props?.applicant?.companyName || props?.applicant?.applicantName)  )],
        ["Amount paid", "PHP" + props?.totalFee],
    ];
    const [sizeComponent, onLayoutComponent] = useComponentLayout()
    const [amountOfBorder, setAmountOfBorder] = useState()
    return <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
            props.onDismissed()
        }}>

         <View style={[styles.modalContainer]}>
             <OnBackdropPress onPressOut={ props.onDismissed} />
             <View style={{
                 ...Platform.select({
                     native: {   },
                     default: {
                         width: rightLayoutComponent?.width,
                         top : rightLayoutComponent?.top,
                     }
                 }),

                 backgroundColor: "rgba(0,0,0,0.5)",
                 flex: 1
             }
             }>
                 <View style={styles.container}>
                     <View style={
                         {
                             paddingHorizontal: 15,
                             paddingVertical: 25,
                             alignItems: 'flex-end',
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
                            <View style={[styles.group8, { height: isMobile ? undefined : rightLayoutComponent?.height- rightLayoutComponent?.top , alignItems: 'center'}]}>

                                <View style={styles.paymentModal}>
                                     <View>
                                         {!isMobile && <View style={{position: "absolute", height: "100%", width: "100%",backgroundColor: "#2863D6"}}/>}
                                         <View style={{flexDirection: "row", }} >

                                             {
                                                 !!sizeComponent && Array(Math?.round(sizeComponent?.width/20))?.fill(0)?.map((top, index)=> <BorderPaymentTop key={index}  style={{marginBottom: -1}}/>)
                                             }
                                         </View>
                                     </View>


                                    <View  onLayout={onLayoutComponent} style={{backgroundColor: "white", paddingVertical: 20 }}>
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
                                                {props?.officialReceipt?.orNumber ?
                                                    <Text style={styles.refNo12345678910}>Ref.
                                                        No. {props?.officialReceipt?.orNumber}</Text> : <></>
                                                }
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
                                    <View>
                                        {!isMobile && <View style={{position: "absolute", height: "100%", width: "100%",backgroundColor: "#2863D6"}}/> }
                                        <View style={{ overflow: "hidden",flexDirection: "row", }}>
                                            {
                                                !!sizeComponent && Array(Math?.round(sizeComponent?.width/20))?.fill(0)?.map((bottom, index)=> <BorderPaymentBottom key={index} style={{marginTop: -1}}/>)
                                            }
                                        </View>
                                    </View>

                                </View>


                            </View>


                     </ScrollView>
                 </View>
             </View>
         </View>

    </Modal>
}

const styles = StyleSheet.create({
    modalContainer:{
       ...Platform.select({
           native:{

               flex: 1,
               justifyContent: 'center',
               alignItems: "center"
           },
           web:{
               alignItems: "flex-end"
           }
       })
    },
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
        paddingHorizontal: 10,

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
        fontWeight: "bold",
        fontFamily: Bold,
        color: "rgba(239,231,231,1)",
        fontSize: fontValue(18),
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
        fontSize: fontValue(12),
        fontFamily: Bold,
        color: "#121212",
        textAlign: 'center'
    },
    description: {
        fontSize: fontValue(12),
        fontFamily: Regular,
    },
    ntcEdge: {
        fontSize: fontValue(12),
        color: "#121212",
        marginTop: 4,
        textAlign: 'center'
    },
    theAmoutOf: {
        fontSize: fontValue(12),
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
        fontSize: fontValue(16),
        textAlign: 'center',
    },
    text: {
        fontSize: fontValue(12),
        color: "#121212",
        marginTop: 11,
        textAlign: 'center',
    },
    group6: {

        marginTop: 23
    },
    details: {
          fontSize: fontValue(12),
        fontFamily: Bold,
        color: "#121212",
        alignSelf: "center"
    },
    group3: {
        paddingVertical: 20,
        alignItems: "flex-start",
        justifyContent: "space-around"
    },
    paymentModal:{
        ...Platform.select({
                native:{
                    top:-60
                },
                web:{
                    top:-80,
                    borderWidth:20,
                    borderColor:"#2863D6"
                }
            }
        ),

    }


});
export default PaymentModal