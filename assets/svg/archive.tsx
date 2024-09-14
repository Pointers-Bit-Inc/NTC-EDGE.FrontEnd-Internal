import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ArchiveIcon = (props: SvgProps) => (
    <Svg
        width={props.width || 24}
        height={props.height ||24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M5 8.00006H19M5 8.00006C3.89543 8.00006 3 7.10463 3 6.00006C3 4.89549 3.89543 4.00006 5 4.00006H19C20.1046 4.00006 21 4.89549 21 6.00006C21 7.10463 20.1046 8.00006 19 8.00006M5 8.00006L5 18.0001C5 19.1046 5.89543 20.0001 7 20.0001H17C18.1046 20.0001 19 19.1046 19 18.0001V8.00006M10 12.0001H14"
            stroke={props.color || "#111827"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default ArchiveIcon;
