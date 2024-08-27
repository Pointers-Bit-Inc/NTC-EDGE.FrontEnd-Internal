import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';

const NewPhoneIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(14)}
    height={RFValue(20)}
    viewBox="0 0 14 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M2.36291 0.43899L3.4395 0.0949794C4.44832 -0.227371 5.52621 0.293579 5.95821 1.31232L6.81791 3.33967C7.19261 4.22312 6.98471 5.26203 6.30391 5.90815L4.40963 7.70616C4.52651 8.7816 4.88801 9.8406 5.49421 10.8832C6.10031 11.9257 6.85731 12.7905 7.76521 13.4776L10.0404 12.7189C10.9028 12.4313 11.842 12.7618 12.371 13.539L13.6034 15.3495C14.2183 16.2529 14.1077 17.4993 13.3447 18.2653L12.5269 19.0862C11.713 19.9033 10.5505 20.1997 9.47511 19.8643C6.93621 19.0723 4.60191 16.7211 2.47214 12.8107C0.339271 8.8945 -0.413479 5.57189 0.213891 2.84289C0.477891 1.69457 1.2954 0.78009 2.36291 0.43899Z"
        fill={props.color || "white"}
      />
  </Svg>
);

export default NewPhoneIcon;
