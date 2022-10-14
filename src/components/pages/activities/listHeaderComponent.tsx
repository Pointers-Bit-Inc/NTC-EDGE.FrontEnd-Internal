import React, {memo, useMemo} from "react";
import {FlatList, Platform, ScrollView, Text, View} from "react-native";
import {styles as styles1} from "@pages/activities/styles";
import {Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {FlashList} from "@shopify/flash-list";
function ListHeaderComponent(props: { searchVisible: boolean, pnApplications: { date: string; activity: any; readableHuman: string }[], containerHeight: number, onScroll: (event) => void, ref: React.MutableRefObject<undefined>, callbackfn: (item: any, index: number) => any }) {
    const ActivityMemo = useMemo(()=> {
        return props.pnApplications
    }, [  props.pnApplications, props.callbackfn])
    return <>
        {!!props.pnApplications?.length && props.containerHeight &&
            <View style={[styles1.pinnedActivityContainer, {
                marginBottom: 5,
                paddingBottom: 20,
                backgroundColor: "#fff"
            }]}>
                {!!props.pnApplications?.length &&
                    <View style={[styles1.pinnedgroup, {height: undefined}]}>
                        <View style={[styles1.pinnedcontainer, {paddingVertical: fontValue(12)}]}>
                            <Text style={[styles1.pinnedActivity, {fontFamily: Regular500,}]}>Pinned
                                Activity</Text>
                        </View>
                    </View>}
                {/* <TouchableOpacity onPress={()=>{
            scrollViewRef?.current?.scrollTo({ y: yPos, animated: true });
            }}>
                <Text>test</Text>
            </TouchableOpacity>*/}
                {<View  style={{maxHeight: fontValue(300)}}>
                    <ScrollView showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                onScroll={props.onScroll}
                                scrollEventThrottle={16}
                                ref={props.ref}
                                style={{maxHeight: fontValue(300)}}>
                        {ActivityMemo.map((item, index) =>  props.callbackfn(item, index))}

                    </ScrollView>

                </View> }




             {/*   <ScrollView showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            onScroll={props.onScroll}
                            scrollEventThrottle={16}
                            ref={props.ref}
                            style={{maxHeight: fontValue(300)}}>
                    {
                        ActivityMemo
                    }
                </ScrollView>*/}

            </View>}
    </>;
}

export default memo(ListHeaderComponent)
