import Pdf from "react-native-pdf";

import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import React from "react";
import WebView from "react-native-webview";
const  PdfViewr = (props: { requirement: any }) => {
    return <WebView style={ requirementStyles.pdf }
                    source={ { uri : `https://docs.google.com/viewerng/viewer?url=${encodeURIComponent(props.requirement?.small)}` , } } ></WebView>;
}

export default PdfViewr