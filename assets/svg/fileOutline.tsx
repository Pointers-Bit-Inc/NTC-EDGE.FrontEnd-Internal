import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const FileOutlineIcon = (props: SvgProps) => (
    <Svg
        width={props.width || 16}
        height={props.height || 20}
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M5 10H11M5 14H11M13 19H3C1.89543 19 1 18.1046 1 17V3C1 1.89543 1.89543 1 3 1H8.58579C8.851 1 9.10536 1.10536 9.29289 1.29289L14.7071 6.70711C14.8946 6.89464 15 7.149 15 7.41421V17C15 18.1046 14.1046 19 13 19Z"
            stroke="#606A80"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default FileOutlineIcon;
