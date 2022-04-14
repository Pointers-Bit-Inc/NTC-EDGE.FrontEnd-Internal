import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import {fontValue as RFValue} from "@pages/activities/fontValue";

const NewFileIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(23)}
    height={RFValue(29)}
    viewBox="0 0 23 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M7.12533 14.5H15.8753M7.12533 20.3333H15.8753M18.792 27.625H4.20866C3.43511 27.625 2.69325 27.3177 2.14626 26.7707C1.59928 26.2237 1.29199 25.4819 1.29199 24.7083V4.29167C1.29199 3.51812 1.59928 2.77625 2.14626 2.22927C2.69325 1.68229 3.43511 1.375 4.20866 1.375H12.3549C12.7417 1.37508 13.1125 1.52878 13.386 1.80229L21.2814 9.69771C21.5549 9.97114 21.7086 10.342 21.7087 10.7287V24.7083C21.7087 25.4819 21.4014 26.2237 20.8544 26.7707C20.3074 27.3177 19.5655 27.625 18.792 27.625Z"
        stroke={props.color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
  </Svg>
);

export default NewFileIcon;
