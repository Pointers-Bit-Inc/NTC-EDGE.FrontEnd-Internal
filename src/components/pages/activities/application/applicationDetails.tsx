import React from "react";
import {Dimensions , ScrollView , StyleSheet , Text , View} from "react-native";

const { width , height } = Dimensions.get("screen");
const ApplicationDetails = (props: any) => {

    return <ScrollView style={ { paddingTop : 20 , width : "100%" , backgroundColor : "#fff" , } }>
        <View style={ {
            marginBottom : 20 ,
            borderRadius : 5 ,
            alignSelf : "center" ,
            width : "90%" ,
            backgroundColor : "#fff" ,
            shadowColor : "rgba(0,0,0,1)" ,
            shadowOffset : {
                height : 0 ,
                width : 0
            } ,
            elevation : 10 ,
            shadowOpacity : 0.1 ,
            shadowRadius : 2 ,
        } }>
            <View style={ [styles.container , { marginTop : 12 }] }>
                <View style={ styles.group2 }>
                    <View style={ styles.rect }>
                        <Text style={ styles.file }>APPLICATION FORM</Text>
                    </View>
                    <Text style={ styles.applicationType }>{ props?.applicantType }</Text>
                    <Text style={ styles.service }>{ props?.service?.name }</Text>
                    <Text style={ styles.service }>{ props?.service?.radioType?.label }</Text>
                    <Text style={ styles.service }>{ `\u2022${ props?.service?.radioType?.selected }` }</Text>
                    { props?.selectedType?.map((type: any , idx: number) => {
                        return <Text key={ idx } style={ styles.text }>
                            { type.name } { type.selectedItems.map((item: string , index: number) => {
                            return <Text key={ index }>{ `\n\u2022${ item }` }</Text>
                        }) }
                        </Text>
                    })
                    }


                </View>
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
        paddingVertical : 10
    } ,
    rect : {
        padding : 10 ,
        paddingVertical : 5 ,
        backgroundColor : "#EFF0F6"
    } ,
    file : {
        fontSize : 12 ,
         fontFamily: 'Poppins_500Medium'  ,
        color : "#565961" ,
    } ,
    applicationType : {
        fontWeight : "bold" ,
        color : "#121212" ,
        fontSize : 16 ,
        marginTop : 8 ,
        marginLeft : 1
    } ,
    service : {
        color : "#121212" ,
        marginLeft : 1
    } ,
    text : {
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