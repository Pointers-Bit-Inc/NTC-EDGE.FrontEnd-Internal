import React, { FC } from 'react'
import Svg, { SvgProps, Path } from "react-native-svg";
import { fontValue } from '@components/pages/activities/fontValue';

const SpeakerOffIcon: FC = (props: SvgProps) => (
  <Svg
    width={fontValue(25)}
    height={fontValue(24)}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
     <Path
        d="M16.25 2.31311V21.6826C16.25 23.0309 14.6569 23.7463 13.6493 22.8503L8.03491 17.8581C7.86329 17.7055 7.64161 17.6212 7.41195 17.6212H2.8125C1.2592 17.6212 0 16.362 0 14.8087V9.18634C0 7.63304 1.2592 6.37384 2.8125 6.37384H7.41201C7.64166 6.37384 7.86331 6.28956 8.03493 6.13697L13.6494 1.14539C14.6569 0.249549 16.25 0.964837 16.25 2.31311ZM21.2395 4.37227C21.6555 4.0641 22.2426 4.15157"
        fill={props.color || "white"}
      />
  </Svg>
);

export default SpeakerOffIcon;
