import React , {useState} from "react";
import {
    Dimensions ,
    Modal ,
    ScrollView ,
    StyleSheet ,
    Text ,
    TouchableOpacity ,
    TouchableWithoutFeedback ,
    View
} from "react-native";

import Loader from "@pages/activities/bottomLoad";
import {Regular500} from "@styles/font";
import FadeBackground from "@assets/svg/fade-background";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";
const { width , height } = Dimensions.get('window');

const RequirementModal = (props: any) => {
    const [onLoad , setOnLoad] = useState(false);
    return <Modal
        supportedOrientations={ ['portrait' , 'landscape'] }
        animationType="slide"
        transparent={ true }
        visible={ props.visible }
        onRequestClose={ () => {
            props.onDismissed()
        } }>


        <View style={ styles.container }>
            <TouchableWithoutFeedback onPress={ props.onDismissed }>
                <View style={ {
                    position : "absolute" ,
                    backgroundColor : "rgba(0,0,0,0.5)" ,
                    display : 'flex' ,
                    alignItems : 'center' ,
                    justifyContent : 'center' ,
                    height : "100%" ,
                    width : "100%"
                }
                }>

                </View>
            </TouchableWithoutFeedback>
            <View style={ styles.rect2 }>
                <View style={ { alignSelf : 'flex-end' ,  paddingHorizontal : 15 , paddingVertical : 15 } }>
                    <TouchableOpacity onPress={ () => {
                        props.onDismissed()
                    }
                    }>
                        <Text style={ styles.close }>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
            { onLoad && <View style={ {
                zIndex : 1 ,
                elevation : 1 ,
                height : "100%" ,
                justifyContent : "center" ,
                alignSelf : "center" ,

                } }>
                    <Loader/>
                </View> }

            <View style={ { height : '100%' , width : '100%' } }>

                {props?.fileName && <FadeBackground  style={{position: "absolute", zIndex: 1}} width={width}></FadeBackground>}

                <Text style={styles.fileName}>{ props?.fileName }</Text>

                    <View style={ {  justifyContent : 'center', flexDirection : 'row'  } }>

                        <ImageView
                            style={ [styles.imageStyle] }
                            source={ {
                                uri : props?.image ? props?.image : 'https://dummyimage.com/350x350/fff/aaa' ,
                            } }
                            resizeMode="contain"

                            onZoomBegin={ () => console.log("On Zoom begin") }
                            onZoomEnd={ () => console.log("On Zoom End") }
                        />
                    </View>
            </View>


        </View>


    </Modal>
};
const styles = StyleSheet.create({
    fileName:{
        flexWrap: "wrap",
        fontSize: fontValue(16),
        color: "#fff",
        paddingHorizontal: 30,
        position: "absolute",
        paddingVertical: 10,
        zIndex: 2
    },
    imageStyle : {
        height : height ,
        width : width ,
    } ,
    container : {
        flex : 1
    } ,
    group7 : {} ,
    rect2 : {
        zIndex : 3 ,

        width : "100%" ,
      
    } ,
    close : {
        fontFamily : Regular500 ,
        color : "rgba(239,231,231,1)" ,
        fontSize : fontValue(18) ,
    } ,
});
export default RequirementModal