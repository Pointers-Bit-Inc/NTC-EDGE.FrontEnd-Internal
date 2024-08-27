import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const RadioButtonOffIcon = (props: SvgProps) => (
    <Svg
        width={props.width || 32}
        height={props.height || 32}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
            fill="#D9DBE9"
        />
    </Svg>
);

export default RadioButtonOffIcon;
