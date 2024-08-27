import * as React from "react";
import Svg, {
    SvgProps,
    Rect,
    Defs,
    LinearGradient,
    Stop,
} from "react-native-svg";

const FadeBackground = (props: SvgProps) => (
    <Svg
        width={props.width}
        height={60}
        viewBox={`0 0 ${props.width} 60`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Rect width={props.width} height={60} fill="url(#paint0_linear_1514_15686)" />
        <Defs>
            <LinearGradient
                id="paint0_linear_1514_15686"
                x1={175}
                y1={0}
                x2={175}
                y2={60}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopOpacity={0.6} />
                <Stop offset={1} stopColor="white" stopOpacity={0} />
            </LinearGradient>
        </Defs>
        
    </Svg>
);

export default FadeBackground;
