import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  RefreshControl,
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  FlatList,
} from "react-native";
import { CBAnimatedTabView } from "../lib";

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;


interface SceneProps {
  isActive: boolean;
  routeKey: string;
  scrollY: Animated.Value;
  trackRef: (key: string, ref: FlatList<any>) => void;
  onMomentumScrollBegin: (e: ScrollEvent) => void;
  onMomentumScrollEnd: (e: ScrollEvent) => void;
  onScrollEndDrag: (e: ScrollEvent) => void;
  data: any,
  renderItem: any,
  refreshControl: any,
  headerHeight: any,
  ListEmptyComponent: any,ListFooterComponent: any,ListHeaderComponent:any,showsVerticalScrollIndicator:any, nestedScrollEnabled: any
}

export const Scene: FunctionComponent<SceneProps> = ({
                                                       headerHeight,
  isActive,
  routeKey,
  scrollY,
  trackRef,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollEndDrag,
    data,
    renderItem,ListEmptyComponent,ListFooterComponent,ListHeaderComponent,nestedScrollEnabled,
                                                       refreshControl,showsVerticalScrollIndicator
}) => (
  <View style={styles.container}>
    <CBAnimatedTabView
        headerHeight={headerHeight}
        ListEmptyComponent={ListEmptyComponent}
      data={data}
        ListHeaderComponent={ListHeaderComponent}
      windowSize={3}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      initialNumToRender={15}
      refreshControl={refreshControl}
      renderItem={renderItem}
        nestedScrollEnabled={nestedScrollEnabled}
      onRef={(ref: any) => {
        trackRef(routeKey, ref);
      }}
        ListFooterComponent={ListFooterComponent}
      scrollY={isActive ? scrollY : undefined}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
});
