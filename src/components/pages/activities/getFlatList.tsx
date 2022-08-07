import {FlatListProps, RefreshControl, View} from "react-native";
import {Connection} from "@pages/activities/types/Connection";
import Animated from "react-native-reanimated";
import {infoColor, primaryColor} from "@styles/color";
import React, {forwardRef, memo} from "react";

const GetFlatList = forwardRef(
    (props, ref) => {
    return <Animated.FlatList
        refreshControl={
            <RefreshControl
                tintColor={primaryColor} // ios
                progressBackgroundColor={infoColor} // android
                colors={["white"]} // android
                progressViewOffset={props.headerHeight + 42}
                refreshing={props.refreshing}
                onRefresh={props.onRefresh}
            />
        }
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        ListEmptyComponent={props.listEmptyComponent}
        ListHeaderComponent={props.header ? props.element : null}
        style={{flex: 1,}}
        data={props.data}
        keyExtractor={props.keyExtractor}
        ListFooterComponent={props.refreshing ? <View/> : props.bottomLoader}
        onEndReached={props.onEndReached}
        ref={ref}
        onScroll={props.onScroll}
        {...props.sharedProps}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={props.onMomentumScrollBegin}
        renderItem={props.renderItem}/>;
})

export default memo(GetFlatList)