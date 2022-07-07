import React, { FC, ReactElement } from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import ActionButtonItem from './ActionButtonItem';

import { ActionsProps } from './type';

const Actions: FC<ActionsProps> = props => {
    const { children, size, verticalOrientation, spacing, zIndex } = props;

    let actionButtons = !Array.isArray(children) ? [children] : children;
    actionButtons = actionButtons.filter(child => typeof child === 'object');

    const actionStyle: StyleProp<ViewStyle> = {
        alignSelf: 'stretch',
        justifyContent: verticalOrientation === 'up' ? 'flex-end' : 'flex-start',
        paddingTop: verticalOrientation === 'down' ? spacing / 2 : 0,
        paddingBottom: verticalOrientation === 'up' ? spacing / 2 : 0,
        zIndex: zIndex - 1,
    };

    return (
        <View style={actionStyle} >
            {actionButtons.map((ActionButton, index) => {
                return <ActionButtonItem key={index} {...props} {...(ActionButton as ReactElement).props} parentSize={size} />;
            })}
        </View>
    );
};

export default Actions;