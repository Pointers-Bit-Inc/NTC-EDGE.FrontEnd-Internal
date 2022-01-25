import React, {useState} from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Entypo, EvilIcons} from "@expo/vector-icons";
import PaymentModal from "@pages/activities/application/paymentModal/index";
import Text from "@atoms/text";
import {styles} from "@pages/activities/application/paymentModal/styles"
import {requirementStyle} from "@pages/activities/application/requirementModal/styles"
import ChevronUpIcon from "@assets/svg/chevron-up";
import ChevronDownIcon from "@assets/svg/chevron-down";
import Collapsible from "react-native-collapsible";
const {width, height} = Dimensions.get("screen") 
const Payment = (props:any) => {
    const [visibleModal, setVisibleModal] = useState(false)
    const [selectCollapsed, setSelectCollapsed] = useState(false)
    const onDismissed = () =>{
        setVisibleModal(false)
    }

    const getTotal = (soa) => {
        let total = 0;
        soa.map(s => total += s.amount);
        return total;
    }

    return <ScrollView style={{width, paddingTop: 10}}>
        <View style={[styles.container, {marginTop: 12}]}>
            
            <View style={{  padding: 5, alignItems: 'center' }}>
                <Text
                    weight="600"
                    color="#37405B"
                    fontSize={14}
                >
                    Statement of Account
                </Text>
            </View>
            <View style={{ paddingVertical: 10, marginTop: 20 }}>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                >
                    <Text
                        weight="600"
                        color="#37405B"
                        fontSize={14}
                    >
                        Particular
                    </Text>
                    <Text
                        weight="600"
                        color="#37405B"
                        fontSize={14}
                    >
                        Amount
                    </Text>
                </View>
                {
                    props?.soa?.map(soa => (
                        <View
                            key={soa._id}
                            style={styles.soaItem}
                        >
                            <Text
                                color="#37405B"
                                fontSize={14}
                            >
                                {soa.item}
                            </Text>
                            <Text
                                color="#37405B"
                                fontSize={14}
                            >
                                P{soa.amount}
                            </Text>
                        </View>
                    ))
                }
                <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 15 }}
                >
                    <Text
                        weight="600"
                        color="#37405B"
                        fontSize={16}
                        style={{ marginRight: 15 }}
                    >
                        Total
                    </Text>
                    <Text
                        weight="600"
                        color="#37405B"
                        fontSize={16}
                    >
                        P{props.totalFee}
                    </Text>
                </View>
            </View>
            <View style={styles.rect5}></View>
            <View  style={[requirementStyle.group6, {alignSelf: "center"}  ]}>
                <TouchableWithoutFeedback onPress={()=>{
                    setSelectCollapsed((collapsed) => !collapsed )
                }
                }>
                    <View style={requirementStyle.group5}>
                        <View style={requirementStyle.rect1}>
                            <Text style={requirementStyle.prcLicensePdf}>  <Text style={styles.payment2}>Payment</Text></Text>
                           
                            <View style={requirementStyle.rect2}>
                                {selectCollapsed ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                            </View>
                        </View>


                    </View>
                </TouchableWithoutFeedback>
                <View style={requirementStyle.group3}>

                    <View style={requirementStyle.group4}>
                        <Collapsible collapsed={selectCollapsed}>
                            <View style={requirementStyle.rect}>

                                <Text style={styles.paymentReceivedFor}>Payment received for</Text>
                                <Text style={styles.ntcEdge}>NTC-EDGE</Text>
                                <Text style={styles.theAmoutOf}>the amout of PHP {props?.totalFee}</Text>
                                {props?.paymentMethod && <Text style={styles.php5000}>Payment method: {props?.paymentMethod}</Text> }
                                {props?.proofOfPayment?.small &&<View style={requirementStyle.rect5}>
                                     <Image
                                        style={{width: 350, height: 216}}
                                        source={{
                                            uri: props?.proofOfPayment?.small,
                                        }}
                                    />

                                </View> }
                                <View style={requirementStyle.group2}>
                                    <View style={requirementStyle.rect6}>
                                        <View style={requirementStyle.group}>
                                            <TouchableOpacity onPress={()=>{

                                                setVisibleModal(true)
                                            }
                                            }>
                                                <View style={requirementStyle.iconRow}>
                                                    <EvilIcons name="eye" style={requirementStyle.icon}/>
                                                    <Text style={requirementStyle.rect8}>View</Text>
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                            </View>


                        </Collapsible>
                    </View>
                </View>
            </View>
        </View>
        <PaymentModal   updatedAt={props?.updatedAt} paymentMethod={props?.paymentMethod} applicant={props?.applicant}  totalFee={props?.totalFee} visible={visibleModal} onDismissed={onDismissed}  />
    </ScrollView>

}


export default Payment