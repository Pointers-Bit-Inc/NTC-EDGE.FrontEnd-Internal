import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { RFValue } from 'react-native-responsive-fontsize';

const NewVideoMeetingIcon: FC = (props: SvgProps) => (
  <Svg
    width={RFValue(23)}
    height={RFValue(23)}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M18.8574 13.1427L24.0605 10.5411C24.8204 10.1612 25.7145 10.7137 25.7145 11.5633V19.2935C25.7145 20.1431 24.8204 20.6957 24.0605 20.3157L18.8574 17.7141M7.42878 22.2856H16.5716C17.834 22.2856 18.8574 21.2622 18.8574 19.9999V10.857C18.8574 9.59464 17.834 8.57129 16.5716 8.57129H7.42878C6.16642 8.57129 5.14307 9.59464 5.14307 10.857V19.9999C5.14307 21.2622 6.16642 22.2856 7.42878 22.2856Z"
      stroke={props.color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default NewVideoMeetingIcon;
