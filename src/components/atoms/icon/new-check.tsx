import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';

const NewCheckIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(12)}
    height={RFValue(11)}
    viewBox="0 0 14 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M1.66699 5.2091L5.43823 8.98034L12.9807 1.43787"
        stroke={props.color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
      />
  </Svg>
);

export default NewCheckIcon;
