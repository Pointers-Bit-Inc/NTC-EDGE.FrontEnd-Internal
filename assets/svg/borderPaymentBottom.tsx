import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const BorderPaymentBottom = (props: SvgProps) => (
    <Svg
        stroke={"#E5E5E5"}
        width={20}
        height={10}
        viewBox="0 0 20 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        
        <Path
            d="M3.006 8.72139C1.49061 10.4262 -1.17315 10.4262 -2.68855 8.72139L-10 0.495997H30L22.6885 8.72139C21.1731 10.4262 18.5094 10.4262 16.994 8.72139L12.2422 3.37565C11.0489 2.0331 8.95114 2.0331 7.75777 3.37565L3.006 8.72139Z"
            fill="white"
        />
    </Svg>
);

export default BorderPaymentBottom;
