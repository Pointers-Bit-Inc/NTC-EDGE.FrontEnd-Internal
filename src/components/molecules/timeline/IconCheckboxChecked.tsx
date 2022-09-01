import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IconCheckboxChecked = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={32}
        height={32}
        viewBox="0 0 24 24"
        {...props}
    >
        <Path
            d="M10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m0-5H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
            fill={props.color ? props.color:   "#999999"}
        />
    </Svg>
);

export default IconCheckboxChecked;
