import * as React from "react";
import Svg, {Defs, Ellipse, G, Mask, Path, RadialGradient, Rect, Stop,} from "react-native-svg";

const EvaluationStatus = (props: any) => (
    <Svg
        width={props.width || 17}
        height={props.height || 20}
        viewBox="0 0 17 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4"
            stroke="#F79E1B"
            strokeWidth={2}
            strokeLinecap="round"
        />
    </Svg>
);

export default EvaluationStatus;
