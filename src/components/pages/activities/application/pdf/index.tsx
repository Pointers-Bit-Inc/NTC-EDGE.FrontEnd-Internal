import Pdf from "react-native-pdf";

import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import React from "react";
import WebView from "react-native-webview";
import {View} from "react-native";
const  PdfViewr = (props: { requirement: any, extension: any }) => {
    const extension = props.requirement?.small.substring(props.requirement?.small.lastIndexOf('.')+1, props.requirement?.small.length) || props.requirement?.small

    return extension == "docx" ?  <View style={{ flex: 1}}><WebView originWhitelist={['*']}
                                          javaScriptEnabled={true}
                                          domStorageEnabled={true}
                                          source={{ uri: 'https://docs.google.com/gview?url=' + 'https://testedgeaccountstorage.blob.core.windows.net/files/a9ddf0cf-1312-445f-8f7d-872b6fc90b55.docx'+ '&embedded=true' }}
                                          style={ requirementStyles.pdf }/></View>:  <Pdf style={ requirementStyles.pdf }
                 source={ { uri : props.requirement?.small , } }/>;
}

export default PdfViewr