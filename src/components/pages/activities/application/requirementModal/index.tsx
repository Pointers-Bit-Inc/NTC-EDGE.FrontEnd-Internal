import React, {useState} from "react";
import BackgroundPayment from "@assets/svg/backgroundpayment";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
    TouchableWithoutFeedback, ActivityIndicator
} from "react-native";
import Loader from "@pages/activities/bottomLoad";
const { width, height } = Dimensions.get('window');

const RequirementModal = (props:any) => {
     const [onLoad, setOnLoad] = useState(false)
    return <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
            props.onDismissed()
        }}>


            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={props.onDismissed}>
                    <View style={{
                        position: "absolute",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: "100%" ,
                        width: "100%"
                    }
                    }>

                    </View>
                </TouchableWithoutFeedback>
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
                {onLoad && <View  style={{zIndex: 1, elevation: 1,height: "100%", justifyContent: "center", alignSelf: "center", position: "absolute"}}>
                    <Loader/> 
                </View> }

                <ScrollView showsVerticalScrollIndicator={false} style={styles.group8}>
                    <View style={{ flex: 1, height, paddingVertical: 30 }}>

                        <Image
                            onLoadStart={()=> setOnLoad(true)}
                            onLoadEnd={() =>  setOnLoad(false)}
                            style={{ flex: 1 }}
                            resizeMode="contain"
                            source={{
                                uri: props?.image ? props?.image : 'https://dummyimage.com/350x350/fff/aaa',
                            }}
                        />

                    </View>
                </ScrollView>
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
        width: "100%",
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