import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ArrowRightIcon = (props: SvgProps) => (
    <Svg
        width={24}
height={24}
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
{...props}
>
<Path
    d="M14 5L21 12M21 12L14 19M21 12L3 12"
stroke="#2863D6"
strokeWidth={2}
strokeLinecap="round"
strokeLinejoin="round"
    />
    </Svg>
);

export default ArrowRightIcon;