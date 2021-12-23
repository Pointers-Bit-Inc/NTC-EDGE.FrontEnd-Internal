import * as React from "react";
import Svg, { Path } from "react-native-svg";

const FileIcon = (props:any) => (
    <Svg
        width={props.widhth}
        height={props.height}
        viewBox="0 0 13 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M4.16665 8H8.83332M4.16665 11.1111H8.83332M10.3889 15H2.6111C2.19854 15 1.80288 14.8361 1.51115 14.5444C1.21943 14.2527 1.05554 13.857 1.05554 13.4444V2.55556C1.05554 2.143 1.21943 1.74733 1.51115 1.45561C1.80288 1.16389 2.19854 1 2.6111 1H6.95576C7.16203 1.00004 7.35983 1.08202 7.50565 1.22789L11.7165 5.43878C11.8624 5.58461 11.9444 5.7824 11.9444 5.98867V13.4444C11.9444 13.857 11.7805 14.2527 11.4888 14.5444C11.1971 14.8361 10.8014 15 10.3889 15Z"
            stroke="#606A80"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default FileIcon;
