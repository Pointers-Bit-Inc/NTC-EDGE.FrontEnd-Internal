import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const CalendarDateIcon = (props) => (
    <Svg
        width={props.width || "30px"}
        height={props.height || "30px"}
        viewBox="0 0 30 30"
        id="_04_-_Calendar"
        data-name="04 - Calendar"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            id="Path_219"
            data-name="Path 219"
            d="M31,7.8a4,4,0,0,0-4-4H5a4,4,0,0,0-4,4V27a4,4,0,0,0,4,4H27a4,4,0,0,0,4-4V7.8Zm-2,0V27a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2V7.8a2,2,0,0,1,2-2H27a2,2,0,0,1,2,2Z"
            transform="translate(-1 -1)"
            fillRule="evenodd"
            fill={props.color || "#000"}
        />
        <Path
            id="Path_220"
            data-name="Path 220"
            d="M8,2V7.6a1,1,0,1,0,2,0V2A1,1,0,0,0,8,2Z"
            transform="translate(-1 -1)"
            fillRule="evenodd"
            fill={props.color || "#000"}
        />
        <Path
            id="Path_221"
            data-name="Path 221"
            d="M2,14.2H30v-2H2Z"
            transform="translate(-1 -1)"
            fillRule="evenodd"
            fill={props.color || "#000"}
        />
        <Path
            id="Path_222"
            data-name="Path 222"
            d="M22,2V7.6a1,1,0,1,0,2,0V2a1,1,0,0,0-2,0Z"
            transform="translate(-1 -1)"
            fillRule="evenodd"
            fill={props.color || "#000"}
        />
        <Circle
            id="Ellipse_2"
            data-name="Ellipse 2"
            cx={1.505}
            cy={1.505}
            r={1.505}
            transform="translate(5.795 15.595)"
            fill={props.color || "#000"}
        />
        <Circle
            id="Ellipse_3"
            data-name="Ellipse 3"
            cx={1.505}
            cy={1.505}
            r={1.505}
            transform="translate(13.495 15.595)"
            fill={props.color || "#000"}
        />
        <Circle
            id="Ellipse_4"
            data-name="Ellipse 4"
            cx={1.505}
            cy={1.505}
            r={1.505}
            transform="translate(21.195 15.595)"
            fill={props.color || "#000"}
        />
        <Circle
            id="Ellipse_5"
            data-name="Ellipse 5"
            cx={1.505}
            cy={1.505}
            r={1.505}
            transform="translate(21.195 22.486)"
            fill={props.color || "#000"}
        />
        <Circle
            id="Ellipse_6"
            data-name="Ellipse 6"
            cx={1.505}
            cy={1.505}
            r={1.505}
            transform="translate(13.495 22.486)"
            fill={props.color || "#000"}
        />
        <Circle
            id="Ellipse_7"
            data-name="Ellipse 7"
            cx={1.505}
            cy={1.505}
            r={1.505}
            transform="translate(5.795 22.486)"
            fill={props.color || "#000"}
        />
    </Svg>
);

export default CalendarDateIcon;
