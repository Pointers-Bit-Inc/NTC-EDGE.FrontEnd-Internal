import Pdf from "react-native-pdf";
import {View,Text,ActivityIndicator} from "react-native";
import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import React, {useEffect, useState} from "react";
import WebView from "react-native-webview";
import {Bold} from "@styles/font";
import axios from "axios";


const PdfViewr=(props:{requirement:any,extension:any})=>{

    const extension=props?.requirement?.substring(props.requirement.lastIndexOf('.')+1,props.requirement.length)||props.requirement;
    const [link, setLink] = useState('https://docs.google.com/gview?url='+props?.requirement+'&embedded=true')
    useEffect(() => {
        setLink('https://docs.google.com/gview?url='+props?.requirement+'&embedded=true')
    }, [])
    return extension=="pdf" ? <View style={{flex:1, alignItems: "center", justifyContent: "center",  }}><Pdf  cache={true} style={requirementStyles.pdf}
                                                                                                              source={{uri:props.requirement,}}/><Text style={{position: "absolute", textAlign: "center", color: "#fff", fontFamily: Bold, fontSize: 18}}><ActivityIndicator color={"#fff"}/></Text></View> :
           <WebView

               style={requirementStyles.pdf} originWhitelist={['*']}
                     javaScriptEnabled={true}
                     domStorageEnabled={true}
                     source={{uri:link}}
                    />
        ;
};

export default PdfViewr