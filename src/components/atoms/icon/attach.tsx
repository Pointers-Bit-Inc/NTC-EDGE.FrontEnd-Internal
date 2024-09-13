import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';
import {fontValue} from "@pages/activities/fontValue";

const AttachIcon: FC = (props: SvgProps) => (
  <Svg
    width={fontValue(31)}
    height={fontValue(32)}
    viewBox="0 0 31 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M20.2863 7.66667L9.30997 18.643C8.00822 19.9447 8.00822 22.0553 9.30997 23.357C10.6117 24.6588 12.7223 24.6588 14.024 23.357L24.7144 12.3807C27.3179 9.77722 27.3179 5.55612 24.7144 2.95262C22.1109 0.349126 17.8898 0.349126 15.2863 2.95262L4.59592 13.9289C0.690681 17.8342 0.690681 24.1658 4.59592 28.0711C8.50117 31.9763 14.8328 31.9763 18.7381 28.0711L29.167 17.6667"
        stroke={props.color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
  </Svg>
);

export default AttachIcon;
