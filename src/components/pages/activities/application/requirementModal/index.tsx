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
import ImageView from "@pages/activities/application/ImageView";

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
                <View style={ { alignSelf : 'flex-end' , marginRight : 15 , marginTop : 35 } }>
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


                <ScrollView contentContainerStyle={ { flex : 1 , justifyContent : 'center' , alignItems : 'center' } }>
                    <View style={ { flexDirection : 'row' , flexWrap : 'wrap' , } }>
                        <ImageView
                            style={ [styles.imageStyle] }
                            source={ {
                                uri : props?.image ? props?.image : 'https://dummyimage.com/350x350/fff/aaa' ,
                            } }
                            resizeMode="center"
                            onLoadStart={ () => setOnLoad(true) }
                            onLoadEnd={ () => setOnLoad(false) }
                            onZoomBegin={ () => console.log("On Zoom begin") }
                            onZoomEnd={ () => console.log("On Zoom End") }
                        />
                    </View>
                </ScrollView>
            </View>


        </View>


    </Modal>
};
const styles = StyleSheet.create({
    imageStyle : {
        height : height ,
        width : width ,
    } ,
    container : {
        flex : 1
    } ,
    group7 : {} ,
    rect2 : {
        zIndex : 1 ,
        position : "absolute" ,
        width : "100%" ,
        height : 80 ,
        //  backgroundColor: "#041B6E"
    } ,
    close : {
        fontFamily : Regular500 ,
        color : "rgba(239,231,231,1)" ,
        fontSize : 18 ,
    } ,
});
export default RequirementModal