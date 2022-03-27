import Pdf from "react-native-pdf";

import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import React from "react";
import WebView from "react-native-webview";
import {View} from "react-native";
const  PdfViewr = (props: { requirement: any, extension: any }) => {
    const extension = props.requirement?.small.substring(props.requirement?.small.lastIndexOf('.')+1, props.requirement?.small.length) || props.requirement?.small
 
    return extension == "pdf" ?  <Pdf style={ requirementStyles.pdf }
                 source={ { uri : props.requirement?.small , } }/> :  <View style={{ flex: 1}}><WebView originWhitelist={['*']}
                                                                                                        javaScriptEnabled={true}
                                                                                                        domStorageEnabled={true}
                                                                                                        source={{ uri: 'https://docs.google.com/gview?url=' + props.requirement?.small+ '&embedded=true' }}
                                                                                                        style={ requirementStyles.pdf }/></View>;
}

export default PdfViewr