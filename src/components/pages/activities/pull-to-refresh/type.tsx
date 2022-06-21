import { ReactElement, RefAttributes } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { WithSpringConfig } from 'react-native-reanimated';

export interface PullToRefreshHeaderRef {
    setProgress: (percent: number) => void;
}

export interface PullToRefreshProps {
    offset?:any,
    HeaderComponent?: React.ComponentType<PullToRefreshHeaderProps & RefAttributes<PullToRefreshHeaderRef>>;
    refreshing: boolean;
    headerHeight?: number;
    onRefresh: () => void;
    springConfig?: WithSpringConfig;
    renderChildren?: ({
                          onScroll,
                          onMomentumScrollEnd,
                          scrollEnabled,
                      }: {
        onScroll: () => void;
        onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        scrollEnabled: boolean;
    }) => ReactElement;
}

export type PullToRefreshHeaderProps = Pick<PullToRefreshProps, 'refreshing' | 'headerHeight'>;