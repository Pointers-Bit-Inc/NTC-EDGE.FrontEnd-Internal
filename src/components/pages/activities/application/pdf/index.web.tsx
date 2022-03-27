import React from "react";
import {Text , View} from "react-native";
import WebView from "react-native-webview";
import {requirementStyles} from "@pages/activities/application/requirementModal/styles";

const PdfViewr = (props: { width: any, height: any, requirement: any }) => {
    const extension = props.requirement?.small.substring(props.requirement?.small.lastIndexOf('.') + 1 , props.requirement?.small.length) || props.requirement?.small;

    return extension == "docx" ?
           <object
               { ...props }
               style={ { zIndex: 2, height : props?.height , width : props?.width } }

               data={ 'https://docs.google.com/gview?url=' + props.requirement?.small+ '&embedded=true'}
           >
               <Text>Could not load Doc. Make sure the source is correct and the browser is not on device
                   mode.</Text>
           </object>: <View>
               <object
                   { ...props }
                   style={ { height : props?.height , width : props?.width } }

                   data={ props.requirement?.small }
               >
                   <Text>Could not load PDF. Make sure the source is correct and the browser is not on device
                       mode.</Text>
               </object>

           </View>;
};

export default PdfViewr