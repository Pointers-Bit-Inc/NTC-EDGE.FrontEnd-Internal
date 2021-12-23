import * as React from "react";
import Svg, { Path } from "react-native-svg";

const FilterIcon = (props: any) => (
    <Svg
        width={props.width}
        height={props.height}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V3.586C5.66374e-05 3.85119 0.105451 4.10551 0.293 4.293L6.707 10.707C6.89455 10.8945 6.99994 11.1488 7 11.414V18L11 14V11.414C11.0001 11.1488 11.1055 10.8945 11.293 10.707L17.707 4.293C17.8946 4.10551 17.9999 3.85119 18 3.586V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893Z"
            fill={props.fill}
        />
    </Svg>
);

export default FilterIcon;