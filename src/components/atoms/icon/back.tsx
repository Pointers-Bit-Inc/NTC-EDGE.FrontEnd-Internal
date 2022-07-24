import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';

const BackIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(20)}
    height={RFValue(16)}
    viewBox="0 0 20 16"
    fill="none"
    {...props}
  >
     <Path
        d="M8 15L1 8M1 8L8 1M1 8H19"
        stroke={props.color || "#1F2022"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
  </Svg>
);

export default BackIcon;
