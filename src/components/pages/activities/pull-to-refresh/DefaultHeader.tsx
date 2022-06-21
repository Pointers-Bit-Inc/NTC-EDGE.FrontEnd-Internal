import React, { forwardRef, useImperativeHandle, useState, useMemo, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { PullToRefreshHeaderProps, PullToRefreshHeaderRef } from './type';

import { mix } from 'react-native-redash';
import ArrowDown from "@atoms/icon/arrow-down";
import UIActivityIndicator from "@atoms/indicator/UIActivityIndicator";

export const DefaultHeader = forwardRef<
    PullToRefreshHeaderRef,
    PullToRefreshHeaderProps & {
    pullDownText?: string;
    refreshingText?: string;
    releaseText?: string;
}
    >(
    (
        {
            refreshing,
            headerHeight,
            pullDownText = 'Pull down to refresh',
            refreshingText = 'Refreshing data...',
            releaseText = 'Release to refresh immediately',
        },
        ref
    ) => {
        const [progress, setProgress] = useState(0);

        useEffect(() => {
            setProgress(+refreshing);
        }, [refreshing]);

        useImperativeHandle(ref, () => {
            return {
                setProgress,
            };
        });

        const { text, icon } = useMemo(() => {
            let text = pullDownText;
            let icon = <ArrowDown/>
            if (progress >= 1) {
                if (refreshing) {
                    text = refreshingText;
                    icon = <UIActivityIndicator size={16} color="black" />;
                } else {
                    text = releaseText;
                }
            }
            return {
                text,
                icon,
            };
        }, [pullDownText, refreshing, refreshingText, releaseText, progress]);

        const style = useAnimatedStyle(() => ({
            opacity: progress,
            transform: [
                {
                    translateY: -(headerHeight ?? 0),
                },
            ],
        }));

        const iconStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    {
                        rotateZ: `${mix(progress, -Math.PI, Math.PI)}rad`,
                    },
                ],
            };
        });

        return (
            <Animated.View style={[styles.wrapper, { height: headerHeight }, style]}>
                <Animated.View style={iconStyle}>{icon}</Animated.View>
                <Text style={styles.title}>{text}</Text>
            </Animated.View>
        );
    }
);

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginLeft: 10,
    },
});