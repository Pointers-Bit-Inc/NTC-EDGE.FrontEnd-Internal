import React from "react";
import BackgroundPayment from "@assets/svg/backgroundpayment";
import {Modal, View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView} from "react-native";
const { width, height } = Dimensions.get('window');

const RequirementModal = (props:any) => {

    return <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
            props.onDismissed()
        }}>
        <View style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: "100%"
        }
        }>
            <View style={styles.container}>
                <View style={styles.rect2}>
                    <View style={{ alignSelf: 'flex-end', marginRight: 15, marginTop: 35 }}>
                        <TouchableOpacity onPress={()=>{
                            props.onDismissed()
                        }
                        }>
                            <Text style={styles.close}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.group8}>
                    <View style={{ flex: 1, height, paddingVertical: 30 }}>
                        <Image
                            style={{ flex: 1 }}
                            resizeMode="contain"
                            source={{
                                uri: props?.image ? props?.image : 'https://dummyimage.com/350x350/fff/aaa',
                            }}
                        />
                    </View>
                </ScrollView>
            </View>

        </View>

    </Modal>
}
const styles = StyleSheet.create({
    container: {
        height,
        width,
    },
    group7: {
        height: 100
    },
    rect2: {
        width: width,
        height: 80,
      //  backgroundColor: "#041B6E"
    },
    close: {
        fontWeight: "500",
        color: "rgba(239,231,231,1)",
        fontSize: 18,
    },
    group8: {
        paddingHorizontal: 30,
        flex: 1
    },
})
export default RequirementModal