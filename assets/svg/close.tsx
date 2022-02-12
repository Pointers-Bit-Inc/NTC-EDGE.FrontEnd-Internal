import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const CloseIcon = (props: SvgProps) => (
    <Svg
        width={props.width || 16}
        height={props.height || 16}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M1 1L15 15M1 15L15 1L1 15Z"
            stroke={props.color ? (props.color || "#606A80"): "black"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default CloseIcon;
