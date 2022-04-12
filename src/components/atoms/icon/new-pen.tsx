import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import {fontValue as RFValue} from "@pages/activities/fontValue";

const NewPenIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(17)}
    height={RFValue(17)}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M11.1935 2.36019L14.1398 5.30647M12.4435 1.11019C13.2571 0.296602 14.5762 0.296602 15.3898 1.11019C16.2034 1.92379 16.2034 3.24288 15.3898 4.05647L3.91667 15.5296H1V12.5537L12.4435 1.11019Z"
        stroke={props.color || "white"}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
  </Svg>
);

export default NewPenIcon;
