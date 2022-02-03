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
import {requirementStyle, requirementStyles} from "@pages/activities/application/requirementModal/styles"
import ChevronUpIcon from "@assets/svg/chevron-up";
import ChevronDownIcon from "@assets/svg/chevron-down";
import Collapsible from "react-native-collapsible";
import FileOutlineIcon from "@assets/svg/fileOutline";
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

    return <ScrollView style={{backgroundColor: "#fff", width, paddingTop: 10}}>
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




            <TouchableOpacity onPress={() => {
                setVisibleModal(true)
            }}  >
                <View style={requirementStyles.container}>
                    <View style={[requirementStyles.card, {padding: undefined}]}>
                        <View style={requirementStyles.cardContainer}>
                            <View style={requirementStyles.cardLabel}>

                                <View style={requirementStyles.cardTitle}>

                                    <Text style={requirementStyles.title}>Payment</Text>
                                        <Text style={styles.paymentReceivedFor}>Payment received for</Text>
                                        <Text style={styles.ntcEdge}>NTC-EDGE</Text>
                                        <Text style={styles.theAmoutOf}>the amout of PHP {props?.totalFee}</Text>
                                   
                                    <Text style={requirementStyles.description}>
                                        {props?.paymentMethod && <Text style={styles.php5000}>Payment method: {props?.paymentMethod}</Text> }
                                    </Text>
                                </View>
                                {props?.proofOfPayment?.small && <View style={[{paddingTop: 30, paddingBottom: 9}, requirementStyles.cardDocument]}>
                                    <View style={{paddingRight: 10}}>
                                        <FileOutlineIcon/>
                                    </View>

                                </View>}

                            </View>
                            {props?.proofOfPayment?.small && <View style={{
                                height: 216,
                                backgroundColor: "rgba(220,226,229,1)",
                                borderWidth: 1,
                                borderColor: "rgba(213,214,214,1)",
                                borderStyle: "dashed",
                            }}>

                                
                                    <Image
                                        style={{height: 216}}
                                        source={{
                                            uri: props?.proofOfPayment?.small,
                                        }}
                                    />

                            </View> }

                        </View>
                    </View>
                </View>

                </TouchableOpacity>
        </View>
        <PaymentModal   updatedAt={props?.updatedAt} paymentMethod={props?.paymentMethod} applicant={props?.applicant}  totalFee={props?.totalFee} visible={visibleModal} onDismissed={onDismissed}  />
    </ScrollView>

}


export default Payment