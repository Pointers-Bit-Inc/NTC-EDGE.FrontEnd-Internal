import * as React from "react";
import Svg, {
    SvgProps,
    Path,
    Defs,
    LinearGradient,
    Stop,
} from "react-native-svg";

const SearchLoading = (props: SvgProps) => (
    <Svg
        width={63}
        height={10}
        viewBox="0 0 63 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM22.5 10C25.2614 10 27.5 7.76142 27.5 5C27.5 2.23858 25.2614 0 22.5 0C19.7386 0 17.5 2.23858 17.5 5C17.5 7.76142 19.7386 10 22.5 10ZM45 5C45 7.76142 42.7614 10 40 10C37.2386 10 35 7.76142 35 5C35 2.23858 37.2386 0 40 0C42.7614 0 45 2.23858 45 5ZM57.5 10C60.2614 10 62.5 7.76142 62.5 5C62.5 2.23858 60.2614 0 57.5 0C54.7386 0 52.5 2.23858 52.5 5C52.5 7.76142 54.7386 10 57.5 10Z"
            fill="url(#paint0_linear_1214_14268)"
        />
        <Defs>
            <LinearGradient
                id="paint0_linear_1214_14268"
                x1={0.25}
                y1={0}
                x2={62.25}
                y2={0}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#407BFF" />
                <Stop offset={1} stopColor="#D0E1FF" />
            </LinearGradient>
        </Defs>
    </Svg>
);

export default SearchLoading;
