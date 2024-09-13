import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const VideoOutlineIcon = (props: SvgProps) => (
    <Svg
        width={20}
        height={15}
        viewBox="0 0 20 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M11.75 0C13.5449 0 15 1.45507 15 3.25V3.423L18.8639 1.105C19.3638 0.80486 20 1.16493 20 1.748V13.25C20 13.833 19.364 14.1931 18.8641 13.8931L15 11.575V11.75C15 13.5449 13.5449 15 11.75 15H3.25C1.45507 15 0 13.5449 0 11.75V3.25C0 1.45507 1.45507 0 3.25 0H11.75ZM11.75 1.5H3.25C2.2835 1.5 1.5 2.2835 1.5 3.25V11.75C1.5 12.7165 2.2835 13.5 3.25 13.5H11.75C12.7165 13.5 13.5 12.7165 13.5 11.75V3.25C13.5 2.2835 12.7165 1.5 11.75 1.5ZM18.5 3.0731L15 5.1745V9.8254L18.5 11.9254V3.0731Z"
            fill="#606A80"
        />
    </Svg>
);

export default VideoOutlineIcon;
