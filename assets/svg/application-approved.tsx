import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const ApplicationApproved = (props:any) => (
    <Svg
        width={80}
        height={80}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Circle
            cx={40}
            cy={40}
            r={38.5}
            fill="#13C39C"
            stroke="#25FFAE"
            strokeWidth={3}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M60.1394 28.3983L37.2112 57.8016L19.2 42.4056L22.5984 38.223L36.4466 50.0573L55.9977 25L60.1394 28.3983V28.3983Z"
            fill="white"
        />
    </Svg>
);

export default ApplicationApproved;
