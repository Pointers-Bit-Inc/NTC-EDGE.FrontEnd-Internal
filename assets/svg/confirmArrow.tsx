import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ConfirmRightArrow = (props: SvgProps) => (
    <Svg
        width={props.width || 25}
        height={props.height ||24}
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M17.5 8L21.5 12M21.5 12L17.5 16M21.5 12L3.5 12"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default ConfirmRightArrow;
