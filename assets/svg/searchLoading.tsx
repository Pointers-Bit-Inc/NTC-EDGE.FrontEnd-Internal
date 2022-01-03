import * as React from "react";
import Svg, {
    SvgProps,
    Line,
    Defs,
    LinearGradient,
    Stop,
} from "react-native-svg";

const SearchLoading = (props: SvgProps) => (
    <Svg
        width={390}
        height={4}
        viewBox="0 0 390 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Line
            x1={-1.74846e-7}
            y1={2.00006}
            x2={390}
            y2={2.00003}
            stroke="url(#paint0_linear_43_4458)"
            strokeWidth={4}
        />
        <Defs>
            <LinearGradient
                id="paint0_linear_43_4458"
                x1={0}
                y1={4.00006}
                x2={390}
                y2={4.00003}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="white" stopOpacity={0} />
                <Stop offset={1} stopColor="#2863D6" />
            </LinearGradient>
        </Defs>
    </Svg>
);

export default SearchLoading;