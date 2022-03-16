import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';
import {fontValue} from "@pages/activities/fontValue";

const NewMessageIcon: FC = (props: SvgProps) => (
  <Svg
    width={fontValue(23)}
    height={fontValue(23)}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M26.1708 16.3417C26.679 16.0876 27 15.5682 27 15C27 14.4319 26.679 13.9125 26.1708 13.6584L5.17082 3.15837C4.63877 2.89235 3.99979 2.96586 3.54205 3.34575C3.0843 3.72564 2.8943 4.34013 3.05771 4.9121L5.20056 12.4121C5.38455 13.056 5.97313 13.5 6.64285 13.5L13.5 13.5C14.3284 13.5 15 14.1716 15 15C15 15.8284 14.3284 16.5 13.5 16.5L6.64286 16.5C5.97314 16.5 5.38456 16.944 5.20057 17.5879L3.05771 25.0879C2.8943 25.6599 3.0843 26.2744 3.54204 26.6543C3.99979 27.0342 4.63877 27.1077 5.17082 26.8417L26.1708 16.3417Z"
        stroke={props.color || "white"}
        fill={props.color || "white"}
      />
  </Svg>
);

export default NewMessageIcon;
