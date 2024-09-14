import * as React from "react";
import Svg, { SvgProps, Rect, Path } from "react-native-svg";

const TrashIcon = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Rect width={24} height={24} rx={12} fill="#F3F3F3" />
        <Path
            d="M17.8333 7.83333L17.1106 17.9521C17.0483 18.8243 16.3225 19.5 15.4481 19.5H8.55186C7.67746 19.5 6.95173 18.8243 6.88943 17.9521L6.16666 7.83333M10.3333 11.1667V16.1667M13.6667 11.1667V16.1667M14.5 7.83333V5.33333C14.5 4.8731 14.1269 4.5 13.6667 4.5H10.3333C9.87309 4.5 9.49999 4.8731 9.49999 5.33333V7.83333M5.33333 7.83333H18.6667"
            stroke="#808196"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default TrashIcon;
