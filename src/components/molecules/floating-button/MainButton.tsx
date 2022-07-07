import React, { FC } from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { mix, mixColor } from 'react-native-redash';

import { MainButtonProps } from './type';
import SvgIcon from "@molecules/timeline/SvgIcon";

const MainButton: FC<MainButtonProps> = ({
                                             size,
                                             progress,
                                             buttonColor,
                                             btnOutRange,
                                             zIndex,
                                             onPress,
                                             onLongPress,
                                             outRangeScale,
                                             renderIcon,
                                         }) => {


    const wrapperStyle = useAnimatedStyle(() => ({
        zIndex,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: mixColor(progress.value, buttonColor, btnOutRange || buttonColor),
    }));

    const buttonStyle: StyleProp<ViewStyle> = {
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
    };

    const style = useAnimatedStyle(() => ({
        transform: [
            {
                scale: mix(progress.value, 1, outRangeScale),
            },
            {
                rotateZ: `${mix(progress.value, 0, 135)}deg`,
            },
        ],
    }));

    return (
        <Animated.View style={wrapperStyle as any}>
            <Animated.View style={[buttonStyle, style]}>
                <TouchableOpacity style={buttonStyle} activeOpacity={0.5} onPress={onPress} onLongPress={onLongPress}>
                    {renderIcon ? renderIcon : <SvgIcon name="plus" color={'#000'} size={size / 2} />}
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

export default MainButton;