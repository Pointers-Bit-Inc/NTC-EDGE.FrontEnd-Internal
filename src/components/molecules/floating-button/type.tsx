import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';

export interface ActionButtonProps {
    size?: number;
    zIndex?: number;
    verticalOrientation?: 'up' | 'down';
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    onLongPress?: () => void;
    buttonColor?: string;
    btnOutRange?: string;
    paddingHorizontal?: number;
    paddingVertical?: number;
    outRangeScale?: number;
    renderIcon?: ReactNode;
    position?: 'left' | 'center' | 'right';
    spacing?: number;
}

export type MainButtonProps = Required<
    Pick<ActionButtonProps, 'size' | 'zIndex' | 'onPress' | 'buttonColor' | 'outRangeScale'>
    > &
    Pick<ActionButtonProps, 'onLongPress' | 'btnOutRange' | 'renderIcon'> & {
    progress: Animated.SharedValue<number>;
};

export type ActionsProps = Required<
    Pick<ActionButtonProps, 'position' | 'size' | 'zIndex' | 'spacing' | 'verticalOrientation'>
    > & {
    progress: Animated.SharedValue<number>;
};

export type ActionButtonItemProps = Partial<ActionsProps & Pick<MainButtonProps, 'buttonColor'>> & {
    parentSize?: number;
    title?: string;
    onPress?: () => void;
    textStyle?: StyleProp<TextStyle>;
    textContainerStyle?: StyleProp<ViewStyle>;
    spaceBetween?: number;
};

export type TitleProps = Required<Pick<ActionButtonItemProps, 'position' | 'spaceBetween' | 'size' | 'parentSize'>> &
    Pick<ActionButtonItemProps, 'title' | 'textStyle' | 'textContainerStyle' | 'onPress'>;