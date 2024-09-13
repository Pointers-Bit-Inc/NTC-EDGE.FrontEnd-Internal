import React, { useMemo } from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {errorColor} from "@styles/color";
import Text from "@atoms/text"
export interface BadgeProps {
   noflex?: false,
    text?: string | number;
    /** 展示封顶的数值 */
    max?: number;
    /** badge的形态，小圆点 | 文字 */
    type?: 'dot' | 'text';
    /** badge的容器的style */
    containerStyle?: ViewStyle;
    /** badge中文字的style */
    textStyle?: TextStyle;
}

const DOT_SIZE = 8;
export default function useBadge({ type = 'text', containerStyle = {}, textStyle = {}, text, max = 99 }: BadgeProps) {

    text = typeof text === 'number' && text > max ? `${max}+` : text;

    const isHidden = useMemo(() => {
        const isZero = text === '0' || text === 0;
        const isEmpty = text === null || text === undefined || text === '';
        return isEmpty || isZero;
    }, [text]);

    const contentDom = useMemo(
        () =>
            type === 'dot' ? (
                <View
                    style={{
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                        borderRadius: DOT_SIZE / 2,
                        position: 'absolute',
                        top: -(DOT_SIZE / 2),
                        right: -(DOT_SIZE / 2),
                        backgroundColor: errorColor,
                        ...containerStyle,
                    }}
                />
            ) : (
                <View
                    style={{
                        borderRadius: 12,
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        paddingHorizontal: 6,
                        backgroundColor: errorColor,
                        justifyContent: 'center',
                        ...containerStyle,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            textAlign: 'center',
                            ...textStyle,
                        }}
                    >
                        {text}
                    </Text>
                </View>
            ),
        [containerStyle, text, textStyle, errorColor, "#fff", type]
    );

    return {
        isHidden,
        contentDom,
    };
}
