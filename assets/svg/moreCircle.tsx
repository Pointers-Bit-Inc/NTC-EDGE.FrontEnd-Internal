import * as React from "react";
import Svg, { SvgProps, Circle, Path } from "react-native-svg";

const MoreCircle = (props: SvgProps) => (
    <Svg
        width={props.width || 40}
        height={props.height || 40}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Circle cx={20} cy={20} r={20} fill={props.selected ? "#7473BD": "#FBFBFB"} />
        <Path
            d="M20 13L20 13.01M20 20L20 20.01M20 27L20 27.01M20 14C19.4477 14 19 13.5523 19 13C19 12.4477 19.4477 12 20 12C20.5523 12 21 12.4477 21 13C21 13.5523 20.5523 14 20 14ZM20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20C21 20.5523 20.5523 21 20 21ZM20 28C19.4477 28 19 27.5523 19 27C19 26.4477 19.4477 26 20 26C20.5523 26 21 26.4477 21 27C21 27.5523 20.5523 28 20 28Z"
            stroke={props.selected ? "#FFF" : "#4E4B66"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default MoreCircle;