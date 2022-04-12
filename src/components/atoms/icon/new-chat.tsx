import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';

const   NewChatIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(23)}
    height={RFValue(23)}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
     <Path
        d="M11.4582 5.2083H6.24984C5.6973 5.2083 5.1674 5.42779 4.7767 5.81849C4.386 6.20919 4.1665 6.7391 4.1665 7.29163V18.75C4.1665 19.3025 4.386 19.8324 4.7767 20.2231C5.1674 20.6138 5.6973 20.8333 6.24984 20.8333H17.7082C18.2607 20.8333 18.7906 20.6138 19.1813 20.2231C19.572 19.8324 19.7915 19.3025 19.7915 18.75V13.5416M18.3186 3.73538C18.5108 3.5364 18.7407 3.37769 18.9948 3.2685C19.249 3.15932 19.5224 3.10185 19.799 3.09944C20.0756 3.09704 20.35 3.14975 20.606 3.2545C20.862 3.35926 21.0946 3.51395 21.2902 3.70956C21.4859 3.90517 21.6405 4.13778 21.7453 4.39381C21.8501 4.64985 21.9028 4.92418 21.9004 5.2008C21.898 5.47743 21.8405 5.7508 21.7313 6.00498C21.6221 6.25915 21.4634 6.48903 21.2644 6.68122L12.3207 15.625H9.37484V12.6791L18.3186 3.73538Z"
        stroke={props.color || "white" }
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
  </Svg>
);

export default NewChatIcon;
