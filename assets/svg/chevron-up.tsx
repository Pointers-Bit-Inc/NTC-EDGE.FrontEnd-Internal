import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ChevronUpIcon = (props:any) => (
    <Svg
        width={props.width || 24}
        height={props.height || 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M19 15L12 8L5 15"
            stroke={props.color || "#3F3F46"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default ChevronUpIcon;
