import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {EvilIcons} from "@expo/vector-icons";
import {styles} from "@pages/activities/application/styles";
import PaymentModal from "@pages/activities/application/paymentModal/index";
const Payment = () => {
    const [visibleModal, setVisibleModal] = useState(false)
    const onDismissed = () =>{
        setVisibleModal(false)
    }

    return <>
        <View style={styles.container}>

            <View style={styles.group6}>

                    <View style={styles.group5}>
                        <View style={styles.rect1}>
                            <Text style={styles.prcLicensePdf}>{'PRC License.pdf'}</Text>
                            <View style={styles.prcLicensePdfFiller}></View>
                            <View style={styles.rect2}></View>
                        </View>
                    </View>

                <View style={styles.group3}>
                    <View style={styles.group4}>
                            <View style={styles.rect}>
                                <View style={styles.rect5}></View>
                                <View style={styles.group2}>
                                    <View style={styles.rect6}>
                                        <View style={styles.group}>
                                            <TouchableOpacity onPress={() =>{
                                                setVisibleModal(true)
                                            }
                                            }>
                                                <View style={styles.iconRow}>
                                                    <EvilIcons name="eye" style={styles.icon}/>
                                                    <Text style={styles.rect8}>View</Text>
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                            </View>
                    </View>
                </View>
            </View>

        </View>
        <PaymentModal visible={visibleModal} onDismissed={onDismissed}  />
    </>

}

export default Payment