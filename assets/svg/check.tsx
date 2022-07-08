import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const CheckIcon = (props: SvgProps) => (
    <Svg
        width={props.width || 18}
        height={props.height || 14}
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M2 8L6 12L16 2"
            stroke={props.color || "#00AB76"}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default CheckIcon;