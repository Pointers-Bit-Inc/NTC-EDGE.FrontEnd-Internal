import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ChevronLeft= (props: SvgProps) => (
    <Svg
        width={props.width || 24}
        height={props.height ||24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M15 19L8 12L15 5"
            stroke="#111827"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default ChevronLeft;
