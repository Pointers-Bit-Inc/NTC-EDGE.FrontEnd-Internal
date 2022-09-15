import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const CaretDownIcon = (props: SvgProps) => (
    <Svg
        width={props.width ||24}
        height={props.height || 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M12.9182 7.99397C12.4233 7.45822 11.5768 7.45822 11.0818 7.99397L7.01006 12.4018C6.2705 13.2024 6.83834 14.5 7.92825 14.5H16.0718C17.1617 14.5 17.7296 13.2024 16.99 12.4018L12.9182 7.99397Z"
            fill="#14142B"
        />
    </Svg>
);

export default CaretDownIcon;
