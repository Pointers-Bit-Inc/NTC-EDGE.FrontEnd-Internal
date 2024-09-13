import React, { FC } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import IconCheckcircleo from './IconCheckcircleo';
import IconClockcircleo from './IconClockcircleo';
import IconCheckboxChecked from './IconCheckboxChecked';
import IconCheckcircle from "@molecules/timeline/IconCheckcircle";
import IconCheckboxHalfchecked from './IconCheckboxHalfchecked';
import IconCheckboxUnchecked from './IconCheckboxUnchecked';

export interface SvgIconProps extends GProps, ViewProps {
    name,
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
        case 'checkboxChecked':
            return <IconCheckboxChecked {...rest} />;
        case 'checkboxHalfchecked':
            return <IconCheckboxHalfchecked {...rest} />
        case 'checkboxUnchecked':
            return <IconCheckboxUnchecked {...rest} />
        default:
            return null;
    }
};

SvgIcon = React.memo ? React.memo(SvgIcon) : SvgIcon;

export default SvgIcon;