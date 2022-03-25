import Pdf from "react-native-pdf";

import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import React from "react";
const  PdfViewr = (props: { requirement: any }) => {
    return  <Pdf style={ requirementStyles.pdf }
                 source={ { uri : props.requirement?.small , } }/>;
}

export default PdfViewr