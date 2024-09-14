import React, { ReactNode, FC } from 'react';
import {Platform,StyleSheet,Text as RNText} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {isMobile} from "@pages/activities/isMobile";
import {isTablet} from "@/src/utils/formatting";

const styles = StyleSheet.create({
  default: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'normal'
  }
});

interface Props {
  color?: string;
  size?: number;
  weight?: string;
  children: ReactNode;
  style?: any;
  align?: string;
  [x: string]: any;
}

const Text: FC<Props> = ({
  color = 'black',
  size = 12,
  weight,
  children,
  style,
  align,
    family,
  ...otherProps
}) => {
  return (
    <RNText
      style={[
        styles.default,
        { color, fontSize: (isMobile && !(Platform?.isPad || isTablet())) ? RFValue(size) : size, fontWeight: weight, textAlign: align, fontFamily: family || 'Poppins_400Regular' },
        style
      ]}
      {...otherProps}
    >
      {children}
    </RNText>
  );
};

export default Text;
