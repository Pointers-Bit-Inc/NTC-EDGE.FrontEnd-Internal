import React, {memo, useMemo} from "react";
import {FlatList, Platform, ScrollView, Text, View} from "react-native";
import {styles as styles1} from "@pages/activities/styles";
import {Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
function ListHeaderComponent(props: { searchVisible: boolean, pnApplications: { date: string; activity: any; readableHuman: string }[], containerHeight: number, onScroll: (event) => void, ref: React.MutableRefObject<undefined>, callbackfn: (item: any, index: number) => any }) {
    const ActivityMemo = useMemo(()=> {
        return props.pnApplications
    }, [  props.callbackfn])
    return <>
        {!!props.pnApplications?.length && props.containerHeight &&
            <View style={[styles1.pinnedActivityContainer, {
                marginBottom: 5,
                paddingBottom: 20,
                backgroundColor: "#fff"
            }]}>

                {
                    <View style={{maxHeight: 300}}>

                        <View style={{maxHeight: 300}}>
                            <ScrollView nestedScrollEnabled={true}>

                            </ScrollView>


                        </View>
                        <ScrollView showsVerticalScrollIndicator={true}
                                    nestedScrollEnabled={true}
                                    scrollEventThrottle={16}
                                    ref={props.ref}
                        >
                            <FlatList
                                showsVerticalScrollIndicator={true}

                                data={ ActivityMemo }
                                renderItem={ ({item, index})=> props.callbackfn(item, index)}
                            />

                        </ScrollView>
                    </View>

 }




             {/*   <ScrollView showsVerticalScrollIndicator={true}
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
