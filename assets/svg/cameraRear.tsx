import * as React from "react";
import Svg, { Path } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: title */

const CameraRear = (props) => (
    <Svg
        width={props.width ||"24"}
        height={props.height ||"24"}
        viewBox="0 0 24 24"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby="cameraRearIconTitle"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        color="#fff"
        {...props}
    >
        <Path d="M6 12l2-2 2 2" />
        <Path d="M8 13a4 4 0 0 0 4 4m4-4a4 4 0 0 0-4-4" />
        <Path strokeLinecap="butt" d="M8 12v1m0-3v3m8 0v3" />
        <Path d="M18 14l-2 2-2-2" />
        <Path d="M8 7l.74-1.11A2 2 0 0 1 10.404 5h3.192a2 2 0 0 1 1.664.89L16 7h5v13H3V7h5z" />
    </Svg>
);

export default CameraRear;
