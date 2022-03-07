import React from "react";
import {Dimensions , ScrollView , StyleSheet , Text , View} from "react-native";
import {Bold , Regular500} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import Loader from "@pages/activities/bottomLoad";
import {fontValue} from "@pages/activities/fontValue";

const { width , height } = Dimensions.get("screen");
const ApplicationDetails = (props: any) => {

    return <ScrollView style={ { paddingTop : 20 , width : "100%" , backgroundColor : "#f8f8f8" , } }>

            <View style={ [styles.container , { marginVertical : 12 }] }>
                <View style={ styles.group2 }>
                    <View style={ styles.rect }>
                        <Text style={ styles.file }>APPLICATION FORM</Text>
                    </View>
                    <Text style={ styles.applicationType }>{ props?.applicantType }</Text>
                    <Text style={ [styles.service, {fontFamily: Regular500}] }>{ props?.service?.name }</Text>
                    <Text style={ [styles.service, {fontFamily: Regular500}] }>{ props?.service?.radioType?.label }</Text>
                    <Text style={ [styles.service, {fontFamily: Regular500}] }>{ `\u2022${ props?.service?.radioType?.selected }` }</Text>
                    { props?.selectedType?.map((type: any , idx: number) => {
                        return <Text key={ idx } style={ styles.text }>
                            { type.name } { type.selectedItems.map((item: string , index: number) => {
                            return <Text  key={ index } style={{fontFamily: Bold}}>{ `\n\u2022${ item }` }</Text>
                        }) }
                        </Text>
                    })
                    }


                </View>
            </View>

    </ScrollView> 

};
const styles = StyleSheet.create({
    container : {

        flex : 1 ,
        paddingHorizontal : 15 ,
    } ,
    group2 : {
        paddingBottom : 20 ,
        width: "100%",
        borderRadius : 5 ,
        alignSelf : "center" ,

        backgroundColor : "#fff" ,
        shadowColor : "rgba(0,0,0,1)" ,
        shadowOffset : {
            height : 0 ,
            width : 0
        } ,
        elevation : 2 ,
        shadowOpacity : 0.1 ,
        shadowRadius : 2 ,
        padding : 10
    } ,
    rect : {
        padding : 10 ,
        paddingVertical : 5 ,
        backgroundColor : "#EFF0F6"
    } ,
    file : {
        fontSize : fontValue(12) ,
          fontFamily: Regular500   ,
        color : "#565961" ,
    } ,
    applicationType : {
        fontFamily: Bold,
        color : "#121212" ,
        fontSize : fontValue(16) ,
        marginTop : 8 ,
        marginLeft : 1
    } ,
    service : {
        fontSize: fontValue(14),
        color : "#121212" ,
        marginLeft : 1
    } ,
    text : {
        fontSize: fontValue(14),
        color : "#121212" ,
        marginTop : 2 ,
        marginLeft : 1
    } ,
    rect4 : {
        width : '100%' ,
        paddingBottom : 10 ,
        //backgroundColor: "#E6E6E6",
        marginTop : 15
    }
});
export default ApplicationDetails