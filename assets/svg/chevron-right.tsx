import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ChevronRight = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M9 19L16 12L9 5"
            stroke="#111827"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default ChevronRight;
