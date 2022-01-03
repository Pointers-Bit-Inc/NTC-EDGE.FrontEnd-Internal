import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const UploadIcon = (props: SvgProps) => (
    <Svg
        width={26}
        height={26}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M1.66667 21.6667L1.66667 23.3333C1.66667 26.0948 3.90524 28.3333 6.66667 28.3333L23.3333 28.3333C26.0948 28.3333 28.3333 26.0948 28.3333 23.3333L28.3333 21.6667M21.6667 8.33333L15 1.66666M15 1.66666L8.33333 8.33333M15 1.66666L15 21.6667"
            stroke="#111827"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default UploadIcon;