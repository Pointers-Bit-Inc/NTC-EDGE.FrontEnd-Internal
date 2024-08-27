import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const BackSpaceIcon = (props: SvgProps) => (
    <Svg
        width={props.width || 20}
        height={props.height || 16}
        viewBox="0 0 20 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M8 15L1 8M1 8L8 1M1 8H19"
            stroke="#1F2022"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default BackSpaceIcon;