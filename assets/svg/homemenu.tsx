import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const HomeMenuIcon = (props: SvgProps) => (
    <Svg
        width={props.width || 24}
        height={props.height || 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default HomeMenuIcon;
