import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';

const NewMeetIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(20)}
    height={RFValue(15)}
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M14 11.75C14 13.5449 12.5449 15 10.75 15H3.25C1.45507 15 0 13.5449 0 11.75V3.25C0 1.45507 1.45507 0 3.25 0H10.75C12.5449 0 14 1.45507 14 3.25V11.75ZM19.762 1.39334C19.9156 1.57414 20 1.80368 20 2.04096V12.9588C20 13.5111 19.5523 13.9588 19 13.9588C18.7627 13.9588 18.5332 13.8744 18.3524 13.7208L15 10.8709V4.12794L18.3524 1.27899C18.7732 0.92132 19.4043 0.97252 19.762 1.39334Z"
        fill={props.color || "white"}
      />
  </Svg>
);

export default NewMeetIcon;
