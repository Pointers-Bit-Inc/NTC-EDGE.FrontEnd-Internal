import * as React from "react";
import Svg, {Defs, Ellipse, G, Mask, Path, RadialGradient, Rect, Stop,} from "react-native-svg";

const EvaluationStatus = (props: any) => (
    <Svg
        width={15}
        height={16}
        viewBox="0 0 15 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Mask
            id="mask0_43_5977"
            style={{
                maskType: "alpha",
            }}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={15}
            height={16}
        >
            <Path
                d="M15 8C15 12.1421 11.6421 15.5 7.5 15.5C3.35786 15.5 0 12.1421 0 8C0 3.85786 3.35786 0.5 7.5 0.5C11.6421 0.5 15 3.85786 15 8ZM2.64125 8C2.64125 10.6834 4.81659 12.8588 7.5 12.8588C10.1834 12.8588 12.3588 10.6834 12.3588 8C12.3588 5.31659 10.1834 3.14125 7.5 3.14125C4.81659 3.14125 2.64125 5.31659 2.64125 8Z"
                fill="#C4C4C4"
            />
        </Mask>
        <G mask="url(#mask0_43_5977)">
            <Rect
                x={-0.94281}
                y={-0.442871}
                width={16.8857}
                height={16.8857}
                fill="url(#paint0_angular_43_5977)"
            />
            <Ellipse
                cx={7.60081}
                cy={14.1999}
                rx={1.33574}
                ry={1.33574}
                fill="#F7771B"
            />
        </G>
        <Defs>
            <RadialGradient
                id="paint0_angular_43_5977"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(7.50005 7.99999) rotate(90) scale(8.44286)"
            >

                <Stop stopColor="#F7771B"/>
                <Stop offset={1} stopColor="white" stopOpacity={0}/>
            </RadialGradient>
        </Defs>
    </Svg>
);

export default EvaluationStatus;
