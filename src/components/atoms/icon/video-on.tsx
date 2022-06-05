import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { fontValue } from '@components/pages/activities/fontValue';

const VideoOnIcon: FC = (props: SvgProps) => (
  <Svg
    width={fontValue(25)}
    height={fontValue(20)}
    viewBox="0 0 25 20"
    fill="none"
    {...props}
  >
     <Path
        d="M17.5 15.3125C17.5 17.5561 15.6811 19.375 13.4375 19.375H4.0625C1.81884 19.375 0 17.5561 0 15.3125V4.6875C0 2.44384 1.81884 0.625 4.0625 0.625H13.4375C15.6811 0.625 17.5 2.44384 17.5 4.6875V15.3125ZM24.7025 2.36668C24.8945 2.59268 25 2.8796 25 3.1762V16.8235C25 17.5139 24.4404 18.0735 23.75 18.0735C23.4534 18.0735 23.1665 17.968 22.9405 17.776L18.75 14.2136V5.78493L22.9405 2.22374C23.4665 1.77665 24.2554 1.84065 24.7025 2.36668Z"
        fill={props.color || "white"}
      />
  </Svg>
);

export default VideoOnIcon;
