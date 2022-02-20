import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';

const NewCallIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(23)}
    height={RFValue(23)}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M7 9.27778C7 8.29594 7.79594 7.5 8.77778 7.5H11.6927C12.0753 7.5 12.4149 7.74483 12.5359 8.1078L13.8673 12.102C14.0072 12.5216 13.8172 12.9803 13.4216 13.1781L11.4151 14.1813C12.3949 16.3544 14.1456 18.1051 16.3187 19.0849L17.3219 17.0784C17.5197 16.6828 17.9784 16.4928 18.398 16.6327L22.3922 17.9641C22.7552 18.0851 23 18.4247 23 18.8073V21.7222C23 22.7041 22.2041 23.5 21.2222 23.5H20.3333C12.9695 23.5 7 17.5305 7 10.1667V9.27778Z"
        stroke={props.color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
  </Svg>
);

export default NewCallIcon;
