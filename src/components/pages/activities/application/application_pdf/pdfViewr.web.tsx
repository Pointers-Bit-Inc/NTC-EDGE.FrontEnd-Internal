import {ActivityIndicator,Text,View} from "react-native";
import {Bold} from "@styles/font";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useComponentLayout} from "../../../../../hooks/useComponentLayout";

const PdfViewr=(props:{width:any,height:any,requirement:any})=>{
    const extension=props?.requirement?.substring(props?.requirement.lastIndexOf('.')+1,props?.requirement.length)||props?.requirement;
   const [link, setLink] = useState('https://docs.google.com/gview?url='+props?.requirement+'&embedded=true')
    useEffect(() => {
        setLink('https://docs.google.com/gview?url='+props?.requirement+'&embedded=true')
    }, [])
    return <>

        <View   style={{flex:1,alignItems:"center",justifyContent:"center",}}>

           <object

               {...props}
               style={{zIndex:2,height:props?.height,width:props?.width}}

               data={link}
           >
               <View style={{flex: 1}}>
                   <Text >Could not load Doc. Make sure the source is correct and the browser is not on device
                       mode.</Text>
               </View>

           </object>

        <Text   style={{
            zIndex:-1,
            position:"absolute",
            textAlign:"center",
            color:"#fff",
            fontFamily:Bold,
            fontSize:18
        }}>
            <ActivityIndicator/>
        </Text>
    </View></>
};

export default PdfViewr