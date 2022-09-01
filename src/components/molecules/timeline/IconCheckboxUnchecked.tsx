import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IconCheckedboxUnchecked = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={32}
        height={32}
        viewBox="0 0 24 24"
        {...props}
    >
        <Path
            d="M19 3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"
            fill="#999999"
        />
    </Svg>
);

export default IconCheckedboxUnchecked;