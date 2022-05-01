import {Text,View} from "react-native";
import {Bold} from "@styles/font";
import React from "react";
import {ActivityIndicator} from "@ant-design/react-native";

const PdfViewr=(props:{width:any,height:any,requirement:any})=>{
    const extension=props?.requirement?.substring(props?.requirement.lastIndexOf('.')+1,props?.requirement.length)||props?.requirement;
    //document
    return <View style={{flex:1,alignItems:"center",justifyContent:"center",}}>
        <object
            {...props}
            style={{zIndex:2,height:props?.height,width:props?.width}}

            data={'https://docs.google.com/gview?url='+props?.requirement+'&embedded=true'}
        >
            <Text>Could not load Doc. Make sure the source is correct and the browser is not on device
                mode.</Text>
        </object>
        <Text style={{
            zIndex:-1,
            position:"absolute",
            textAlign:"center",
            color:"#fff",
            fontFamily:Bold,
            fontSize:18
        }}>
            <ActivityIndicator/>
        </Text>
    </View>
};

export default PdfViewr