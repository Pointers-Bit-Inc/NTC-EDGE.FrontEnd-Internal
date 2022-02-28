import * as React from "react";
import Svg, { Path } from "react-native-svg";

const FilterIcon = (props: any) => (
    <Svg
        width={props.width || 24}
        height={props.height || 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.6001 3.60002C3.6001 2.93728 4.13736 2.40002 4.8001 2.40002H19.2001C19.8628 2.40002 20.4001 2.93728 20.4001 3.60002V7.20002C20.4001 7.51828 20.2737 7.82351 20.0486 8.04855L14.4001 13.6971V18C14.4001 18.3183 14.2737 18.6235 14.0486 18.8486L11.6486 21.2486C11.3054 21.5917 10.7893 21.6944 10.3409 21.5087C9.89247 21.3229 9.6001 20.8854 9.6001 20.4V13.6971L3.95157 8.04855C3.72653 7.82351 3.6001 7.51828 3.6001 7.20002V3.60002Z"
            fill="white"
        />
    </Svg>
);

export default FilterIcon;