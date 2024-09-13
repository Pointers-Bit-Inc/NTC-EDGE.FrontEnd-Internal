
import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ApplicationApproved = (props: SvgProps) => (
    <Svg
        width={props.width || 80}
        height={props.height || 80}
        viewBox="0 0 67 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M25.125 33.5L30.7083 39.0833L41.875 27.9167M58.625 33.5C58.625 47.3762 47.3762 58.625 33.5 58.625C19.6238 58.625 8.375 47.3762 8.375 33.5C8.375 19.6238 19.6238 8.375 33.5 8.375C47.3762 8.375 58.625 19.6238 58.625 33.5Z"
            stroke="#00AB76"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default ApplicationApproved;


