import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SplitIcon = (props) => (
    <Svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fill="none"
            stroke="#000"
            strokeWidth={2}
            d="M1,22 L23,22 L23,2 L1,2 L1,22 Z M12,2 L12,22 L12,2 Z"
        />
    </Svg>
);

export default SplitIcon;
