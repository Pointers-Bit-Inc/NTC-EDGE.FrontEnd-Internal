import React , {useEffect} from "react";
import {View, Text} from "react-native";
const  PdfViewr = (props: { width: any, height: any, requirement: any }) => {
       
    return <View>
        <object
            {...props}
            style={{height: props?.height, width: props?.width}}
            
            data={ `https://docs.google.com/viewer?url=${encodeURIComponent(props.requirement?.small)}`  }
        >
            <Text>Could not load PDF. Make sure the source is correct and the browser is not on device mode.</Text>
        </object>

    </View>;
}

export default PdfViewr