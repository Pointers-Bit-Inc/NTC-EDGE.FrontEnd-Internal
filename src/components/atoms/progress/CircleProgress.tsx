import React, { FC } from 'react';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import {StyleSheet, View} from 'react-native';
import {px} from "../../../utils/normalized";
import {disabledColor, primaryColor} from "@styles/color";
import useCircleProgress from "../../../hooks/useCircleProgress";
import {ProgressProps} from "@atoms/progress/type";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleProgress: FC<Omit<ProgressProps, 'labelPosition'>> = props => {

    const {
        width = px(150),
        color = primaryColor,
        bgColor =disabledColor,
        strokeWidth = px(10),
        value = 0,
        showLabel = true,
        showUnit = true,
    } = props;

    const { radius, label, circumference, animatedProps } = useCircleProgress({ width, strokeWidth, showUnit, value });

    return (
        <View style={{width, height: width}}>
            <Svg width={width} height={width}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor={typeof color === 'string' ? color : color[0]} stopOpacity="1" />
                        <Stop offset="1" stopColor={typeof color === 'string' ? color : color[1]} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <G rotation="-90" origin={`${width / 2}, ${width / 2}`}>
                    <Circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        stroke={bgColor}
                        strokeWidth={strokeWidth}
                        strokeOpacity={1}
                        fill="none"
                    />
                    <AnimatedCircle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        stroke="url(#grad)"
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${circumference} ${circumference}`}
                        animatedProps={animatedProps}
                    />
                </G>
            </Svg>
            {showLabel && value > 0 && (
                <ReText
                    text={label}
                    style={[
                        StyleSheet.absoluteFillObject,
                        {
                            fontSize: px(14),
                            color: typeof color === 'string' ? color : primaryColor,
                            fontWeight: '500',
                            textAlign: 'center',
                        },
                    ]}
                />
            )}
        </View>
    );
};

export default CircleProgress;
