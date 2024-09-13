import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const FilledSuccessIcon = (props: SvgProps) => (
    <Svg
        width={70}
        height={70}
        viewBox="0 0 70 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M35 67.0833C52.7192 67.0833 67.0834 52.7191 67.0834 35C67.0834 17.2808 52.7192 2.91663 35 2.91663C17.2809 2.91663 2.91669 17.2808 2.91669 35C2.91669 52.7191 17.2809 67.0833 35 67.0833ZM28.3124 32.7909C27.1734 31.6518 25.3267 31.6518 24.1876 32.7909C23.0486 33.9299 23.0486 35.7766 24.1876 36.9157L32.4372 45.1652L46.874 30.7285C48.013 29.5895 48.013 27.7427 46.874 26.6037C45.7349 25.4647 43.8882 25.4647 42.7492 26.6037L32.4372 36.9157L28.3124 32.7909Z"
            fill="#041B6E"
        />
    </Svg>
);
export default FilledSuccessIcon;
