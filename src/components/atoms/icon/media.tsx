import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';
import {fontValue} from "@pages/activities/fontValue";

const MediaIcon: FC = (props: SvgProps) => (
  <Svg
    width={fontValue(30)}
    height={fontValue(30)}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M1.66699 21.6667L9.30997 14.0237C10.6117 12.7219 12.7223 12.7219 14.024 14.0237L21.667 21.6667M18.3337 18.3333L20.9766 15.6904C22.2784 14.3886 24.3889 14.3886 25.6907 15.6904L28.3337 18.3333M18.3337 8.33334H18.3503M5.00033 28.3333H25.0003C26.8413 28.3333 28.3337 26.841 28.3337 25V5C28.3337 3.15906 26.8413 1.66667 25.0003 1.66667H5.00033C3.15938 1.66667 1.66699 3.15906 1.66699 5V25C1.66699 26.841 3.15938 28.3333 5.00033 28.3333Z"
        stroke={props.color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
  </Svg>
);

export default MediaIcon;
