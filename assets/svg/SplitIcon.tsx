import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SplitIcon = (props) => (
    <Svg
        width={props.width ||"24"}
        height={props.height || "24"}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fill="none"
            stroke={props.color || "#A0A3BD"}
            strokeWidth={2}
            d="M1,22 L23,22 L23,2 L1,2 L1,22 Z M12,2 L12,22 L12,2 Z"
        />
    </Svg>
);

export default SplitIcon;
