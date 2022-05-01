import Pdf from "react-native-pdf";
import {View,Text} from "react-native";
import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import React from "react";
import WebView from "react-native-webview";
import {Bold} from "@styles/font";
import {ActivityIndicator} from "@ant-design/react-native";


const PdfViewr=(props:{requirement:any,extension:any})=>{
    const extension=props.requirement?.small.substring(props.requirement?.small.lastIndexOf('.')+1,props.requirement?.small.length)||props.requirement?.small;

    return extension=="pdf" ? <View style={{flex:1, alignItems: "center", justifyContent: "center",  }}><Pdf  cache={true} style={requirementStyles.pdf}
                                                                                                             source={{uri:props.requirement?.small,}}/><Text style={{position: "absolute", textAlign: "center", color: "#fff", fontFamily: Bold, fontSize: 18}}><ActivityIndicator/></Text></View> :
         <WebView  style={{flex:1}} originWhitelist={['*']}
                                           javaScriptEnabled={true}
                                           domStorageEnabled={true}
                                           source={{uri:'https://docs.google.com/gview?url='+props.requirement?.small+'&embedded=true'}}
                                           style={requirementStyles.pdf}/>
               ;
};

export default PdfViewr