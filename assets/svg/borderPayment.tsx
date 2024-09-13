import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const BorderPaymentTop = (props: SvgProps) => (
    <Svg
        width={20}
        height={10}
        viewBox="0 0 20 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M3.006 1.27861C1.49061 -0.426205 -1.17315 -0.426205 -2.68855 1.27861L-10 9.504H30L22.6885 1.27861C21.1731 -0.426205 18.5094 -0.426205 16.994 1.27861L12.2422 6.62435C11.0489 7.9669 8.95114 7.9669 7.75777 6.62435L3.006 1.27861Z"
            fill="white"
        />
    </Svg>
);

export default BorderPaymentTop;
