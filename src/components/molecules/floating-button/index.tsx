import React, { FC } from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';


import ActionButtonItem from './ActionButtonItem';
import MainButton from './MainButton';
import Actions from './Actions';
import { ActionButtonProps } from './type';
import { useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import {px} from "../../../utils/normalized";
import useLatest from "../../../hooks/useLatest";

const getOverlayStyles: (zIndex: number, verticalOrientation: string) => StyleProp<ViewStyle> = (
    zIndex: number,
    verticalOrientation: string
) => {
    return [
        styles.overlay,
        {
            zIndex: zIndex,
            justifyContent: verticalOrientation === 'up' ? 'flex-end' : 'flex-start',
        },
    ];
};

const getPosition: (position: string) => StyleProp<ViewStyle> = (position: string) => {
    const alignItemsMap: { [key: string]: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' } = {
        center: 'center',
        left: 'flex-start',
        right: 'flex-end',
    };
    return { alignItems: alignItemsMap[position] };
};

const ActionButton: FC<ActionButtonProps> = props => {

    const {
        zIndex = 99,
        position = 'right',
        verticalOrientation = 'up',
        style,
        size = px(50),
        spacing = px(20),
        onPress,
        onLongPress,
        buttonColor = 'gray',
        btnOutRange = 'black',
        paddingHorizontal = px(20),
        paddingVertical = px(20),
        outRangeScale = 1.2,
        renderIcon,
        children,
    } = props;
    const onPressRef = useLatest(onPress);
    const onLongPressRef = useLatest(onLongPress);

    const active = useSharedValue(false);
    const progress = useDerivedValue(() => (active.value ? withSpring(1) : withTiming(0)));

    const handlePress = () => {
        if (children) {
            active.value = !active.value;
        } else if (onPress) {
            onPressRef.current?.();
        }
    };

    return (
        <View

            style={[
                getOverlayStyles(zIndex, verticalOrientation),
                getPosition(position),
                { paddingHorizontal, paddingVertical },
                style,
            ]}
        >
            {verticalOrientation === 'up' && children && (
                <Actions
                    {...{
                        children,
                        verticalOrientation,
                        spacing,
                        zIndex,
                        progress,
                        size,
                        position,
                        buttonColor,
                    }}
                />
            )}
            <MainButton
                {...{
                    progress,
                    size,
                    zIndex,
                    onLongPress: onLongPressRef.current,
                    buttonColor,
                    btnOutRange,
                    outRangeScale,
                    renderIcon,
                }}
                onPress={handlePress}
            />
            {verticalOrientation === 'down' && children && (
                <Actions
                    {...{
                        children,
                        verticalOrientation,
                        spacing,
                        zIndex,
                        progress,
                        size,
                        position,
                        buttonColor,
                    }}
                />
            )}
        </View>
    );
};

export default Object.assign(ActionButton, { Item: ActionButtonItem });

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
});
