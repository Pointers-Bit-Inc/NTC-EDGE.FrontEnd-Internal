import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ActivitySidebar = (props: SvgProps) => (
    <Svg
        width={props.width || 24}
        height={props.height || 25}
        viewBox={`0 0 24 25`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M8.30216 21.7537H15.6979C15.3995 23.5264 13.8575 24.8769 12 24.8769C10.1425 24.8769 8.60046 23.5264 8.30216 21.7537ZM12 0.50489C17.1776 0.50489 21.375 4.70221 21.375 9.87989V14.878L23.1479 18.8281C23.2165 18.981 23.252 19.1467 23.252 19.3144C23.252 19.9702 22.7204 20.5019 22.0645 20.5019H1.94024C1.773 20.5019 1.60766 20.4666 1.45502 20.3982C0.856437 20.1302 0.588412 19.4277 0.856387 18.8291L2.62501 14.8785L2.62514 9.86374L2.63066 9.55134C2.8045 4.51294 6.94485 0.50489 12 0.50489Z"
            fill={props.fill || "#113196"}
        />
    </Svg>
);

export default ActivitySidebar;
