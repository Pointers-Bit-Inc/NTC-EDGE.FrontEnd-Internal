import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';

const DownloadIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(16)}
    height={RFValue(16)}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M1 13L1 14C1 15.6569 2.34315 17 4 17L14 17C15.6569 17 17 15.6569 17 14L17 13M13 9L9 13M9 13L5 9M9 13L9 1"
        stroke={props.color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
  </Svg>
);

export default DownloadIcon;
