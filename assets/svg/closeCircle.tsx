import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const CloseCircleIcon = (props: SvgProps) => (
    <Svg
        width={22}
height={22}
viewBox="0 0 22 22"
fill="none"
xmlns="http://www.w3.org/2000/svg"
{...props}
>
<Path
    d="M8.5 8.49998L13.5 13.5M8.5 13.5L13.5 8.49998M20.1667 11C20.1667 16.0626 16.0626 20.1666 11 20.1666C5.93739 20.1666 1.83334 16.0626 1.83334 11C1.83334 5.93737 5.93739 1.83331 11 1.83331C16.0626 1.83331 20.1667 5.93737 20.1667 11Z"
stroke="#14142B"
strokeWidth={2}
strokeLinecap="round"
strokeLinejoin="round"
    />
    </Svg>
);

export default CloseCircleIcon;
