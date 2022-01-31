import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const EndorseIcon = (props: SvgProps) => (
    <Svg
        width={19}
        height={16}
        viewBox="0 0 19 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M11.0555 8.38889H17.2777M17.2777 8.38889L14.1666 5.27778M17.2777 8.38889L14.1666 11.5M9.49995 4.11111C9.49995 5.82933 8.10705 7.22222 6.38883 7.22222C4.67062 7.22222 3.27772 5.82933 3.27772 4.11111C3.27772 2.39289 4.67062 1 6.38883 1C8.10705 1 9.49995 2.39289 9.49995 4.11111ZM1.72217 14.2222C1.72217 11.6449 3.81151 9.55555 6.38883 9.55555C8.96616 9.55555 11.0555 11.6449 11.0555 14.2222V15H1.72217V14.2222Z"
            stroke="#606A80"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default EndorseIcon;
