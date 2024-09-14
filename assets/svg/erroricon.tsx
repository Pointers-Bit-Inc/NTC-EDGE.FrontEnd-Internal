import * as React from "react";
import Svg, { SvgProps, Circle, Path } from "react-native-svg";

const ErrorIcon = (props: SvgProps) => (
    <Svg
        width={60}
        height={61}
        viewBox="0 0 60 61"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Circle
            cx={30}
            cy={30.5}
            r={28.5}
            fill="#FB4B4B"
            stroke="#F6BDBD"
            strokeWidth={3}
        />
        <Path
            d="M40.2 40.7L19.8 20.3M40.2 20.3L19.8 40.7"
            stroke="white"
            strokeWidth={5}
            strokeLinecap="round"
        />
    </Svg>
);

export default ErrorIcon;
