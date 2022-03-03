import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SearchIcon = (props:any) => (
    <Svg
        width={props.width || 20}
        height={props.height || 20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M9.16669 16.6667C13.3088 16.6667 16.6667 13.3088 16.6667 9.16666C16.6667 5.02452 13.3088 1.66666 9.16669 1.66666C5.02455 1.66666 1.66669 5.02452 1.66669 9.16666C1.66669 13.3088 5.02455 16.6667 9.16669 16.6667Z"
            stroke="#C1CADC"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M18.3333 18.3333L15 15"
            stroke="#C1CADC"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default SearchIcon;
