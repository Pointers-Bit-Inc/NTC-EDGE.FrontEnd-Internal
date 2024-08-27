import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ForwardIcon = (props: SvgProps) => (
  <Svg
    width={14}
    height={12}
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8 1L13 6M13 6L8 11M13 6L1 6"
      stroke={!!props?.isdisable ? "#C4C4C4" : (props.color ? "#fff" : "#041B6E")}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ForwardIcon;