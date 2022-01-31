import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const CloseCircleIcon = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M6 6.00002L12.3871 12.3871M12.3871 12.3871L18.7742 18.7742M12.3871 12.3871L6 18.7742M12.3871 12.3871L18.7742 6"
            stroke="#A0A3BD"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default CloseCircleIcon;
