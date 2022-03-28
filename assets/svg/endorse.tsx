import * as React from "react";
import Svg, { SvgProps, Path, Rect } from "react-native-svg";

const EndorseIcon = (props: SvgProps) => (
    <Svg
        width={22}
        height={20}
        viewBox="0 0 22 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Rect width={21.1111} height={20} rx={10} fill="#EAEDFF" />
        <Path
            d="M11.6667 10.2778H16.1111M16.1111 10.2778L13.8889 8.05556M16.1111 10.2778L13.8889 12.5M10.5556 7.22222C10.5556 8.44952 9.56063 9.44444 8.33333 9.44444C7.10603 9.44444 6.11111 8.44952 6.11111 7.22222C6.11111 5.99492 7.10603 5 8.33333 5C9.56063 5 10.5556 5.99492 10.5556 7.22222ZM5 14.4444C5 12.6035 6.49238 11.1111 8.33333 11.1111C10.1743 11.1111 11.6667 12.6035 11.6667 14.4444V15H5V14.4444Z"
            stroke="#606A80"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default EndorseIcon;
