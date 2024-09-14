import * as React from "react";
import Svg, { SvgProps, Line } from "react-native-svg";

const DottedLine = (props: SvgProps) => (
    <Svg
        width={"100%"}
        height={1}
        viewBox="0 0 726 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Line
            x1={0.308106}
            y1={0.5}
            x2={725.308}
            y2={0.500063}
            stroke="#808196"
            strokeDasharray="1 3"
        />
    </Svg>
);

export default DottedLine;
