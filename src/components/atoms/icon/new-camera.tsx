import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';
import {fontValue} from "@pages/activities/fontValue";

const NewCameraIcon: FC = (props: SvgProps) => (
  <Svg
    width={fontValue(32)}
    height={fontValue(30)}
    viewBox="0 0 32 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M1 10C1 8.15906 2.49238 6.66667 4.33333 6.66667H5.88272C6.99723 6.66667 8.038 6.10967 8.65622 5.18234L10.0104 3.151C10.6287 2.22367 11.6694 1.66667 12.7839 1.66667H19.2161C20.3306 1.66667 21.3713 2.22368 21.9896 3.151L23.3438 5.18234C23.962 6.10967 25.0028 6.66667 26.1173 6.66667H27.6667C29.5076 6.66667 31 8.15906 31 10V25C31 26.841 29.5076 28.3333 27.6667 28.3333H4.33333C2.49238 28.3333 1 26.841 1 25V10Z"
      stroke={props.color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 16.6667C21 19.4281 18.7614 21.6667 16 21.6667C13.2386 21.6667 11 19.4281 11 16.6667C11 13.9052 13.2386 11.6667 16 11.6667C18.7614 11.6667 21 13.9052 21 16.6667Z"
      stroke={props.color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default NewCameraIcon;
