import React from "react";
import BackgroundPayment from "@assets/svg/backgroundpayment";
import {Modal, View, Text, StyleSheet, Dimensions, TouchableOpacity, Image} from "react-native";
const { width } = Dimensions.get('window');

const RequirementModal = (props:any) => {
    return <Modal
        animationType="slide"
        transparent={false}
        visible={props.visible}
        onRequestClose={() => {
            props.onDismissed()
        }}>
        <View style={{
            backgroundColor: '#e6e6e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: "100%"
        }
        }>
            <BackgroundPayment style={{position:"absolute"}}></BackgroundPayment>
            <View style={styles.container}>
                <View style={styles.group7}>
                    <View style={styles.rect2}>
                        <TouchableOpacity onPress={()=>{
                            props.onDismissed()
                        }
                        }>
                            <Text style={styles.close}>Close</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={styles.group8}>
                    <Image
                        style={{width: 350, height: 350}}
                        source={{
                            uri: props?.image ? props?.image : 'https://dummyimage.com/350x350/fff/aaa',
                        }}
                    />
                </View>
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
        marginTop: 55,
        marginLeft: 313
    },
    group8: {
        width: "100%",
        height: 473,
        marginTop: 70,
        alignSelf: "center"
    },
})
export default RequirementModal