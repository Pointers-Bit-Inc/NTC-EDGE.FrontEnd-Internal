import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const CheckItemIcon = (props: SvgProps) => (
    <Svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M6.28033 9.77488C5.98744 9.48199 5.51256 9.48199 5.21967 9.77488C4.92678 10.0678 4.92678 10.5426 5.21967 10.8355L7.94202 13.5579C8.23491 13.8508 8.70979 13.8508 9.00268 13.5579L15.447 7.11358C15.7399 6.82069 15.7399 6.34582 15.447 6.05292C15.1541 5.76003 14.6792 5.76003 14.3863 6.05292L8.47235 11.9669L6.28033 9.77488Z"
            fill="#1676F3"
        />
    </Svg>
);

export default CheckItemIcon;
