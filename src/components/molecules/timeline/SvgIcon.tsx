import React, { FC } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import IconCheckcircleo from './IconCheckcircleo';
import IconClockcircleo from './IconClockcircleo';
import IconClosecircleo from './IconClosecircleo';
import IconCheckcircle from "@molecules/timeline/IconCheckcircle";

export type IconNames = 'arrowdown' | 'bells' | 'check' | 'checkcircle' | 'checkcircleo' | 'checkboxChecked' | 'checkboxHalfchecked' | 'checkboxUnchecked' | 'clockcircleo' | 'close' | 'closecircleo' | 'date' | 'down' | 'ellipsis' | 'eyeclose' | 'eyeopen' | 'left' | 'minus' | 'plus' | 'radio-checked' | 'radio-unchecked' | 'reload' | 'right' | 'search' | 'up';

export interface SvgIconProps extends GProps, ViewProps {
    name: IconNames;
    size?: number;
    color?: string | string[];
}

let SvgIcon: FC<SvgIconProps> = ({ name, ...rest }) => {
    switch (name) {
        case 'checkcircle':
            return <IconCheckcircle {...rest} />;
        case 'checkcircleo':
            return <IconCheckcircleo {...rest} />;
        case 'clockcircleo':
            return <IconClockcircleo {...rest} />;
        case 'closecircleo':
            return <IconClosecircleo {...rest} />;
        default:
            return null;
    }
};

SvgIcon = React.memo ? React.memo(SvgIcon) : SvgIcon;

export default SvgIcon;