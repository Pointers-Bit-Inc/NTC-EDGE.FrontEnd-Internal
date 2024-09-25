import {Animated, FlatListProps, RefreshControl, View} from "react-native";
import {Connection} from "@pages/activities/types/Connection";
import {infoColor, primaryColor} from "@styles/color";
import React, {forwardRef, memo} from "react";

const GetFlatList = forwardRef(
    (props: {
        headerHeight: number,
        refreshing: boolean,
        onRefresh: () => void,
        listEmptyComponent: () => JSX.Element,
        header: boolean,
        element: JSX.Element,
        data: any,
        keyExtractor: (item, index) => string,
        bottomLoader: () => JSX.Element,
        onEndReached: () => void,
        onScroll: any,
        sharedProps: Partial<FlatListProps<Connection>>,
        onMomentumScrollBegin: () => void, renderItem: ({
                                                            item,
                                                            index
                                                        }: { item: any; index: any }) => JSX.Element
    }, ref) => {
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
        showsVerticalScrollIndicator={true}
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