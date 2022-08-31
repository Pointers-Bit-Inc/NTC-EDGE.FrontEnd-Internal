import {transformText} from "../../../../utils/ntc";
import moment from "moment";
import Row from "@pages/activities/application/Row";
import {FlatList,StyleSheet,Text,View} from "react-native";
import React from "react";
import {input} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import {Regular500} from "@styles/font";
import {CASHIER} from "../../../../reducers/activity/initialstate";
const styles = StyleSheet.create({
    subChildSeparator: {
        height: 1,
        backgroundColor: input.background.default,
        marginVertical: 10,
    },
    group2 : {
        paddingBottom : 20 ,
        width: "100%",
        borderRadius : 5 ,
        alignSelf : "center" ,

        backgroundColor : "#fff" ,
        shadowColor : "rgba(0,0,0,1)" ,
        shadowOffset : {
            height : 0 ,
            width : 0
        } ,
        elevation : 2 ,
        shadowOpacity : 0.1 ,
        shadowRadius : 2 ,
        padding : 10
    } ,
    rect : {
        padding : 10 ,
        paddingVertical : 5 ,
        backgroundColor : "#EFF0F6"
    } ,
    file : {
        fontSize : fontValue(12) ,
        fontFamily: Regular500   ,
        color : "#565961" ,
    } ,
    group3 : {
        paddingRight : fontValue(10) ,
        paddingLeft : fontValue(10),
        paddingBottom: fontValue(20)
    } ,
})
const RenderServiceMiscellaneous = (props) => {
    let service = {...props?.service} || {};
    let _renderParent = ({item}: any) => {
        if (
            item !== '_id' &&
            item !== 'name' &&
            item !== 'applicationType' &&
            item !== 'serviceCode'
        ) {
            let parentItem = item;
            let parentLabel = transformText(item);
            let _renderGrandChild = (values: any) => {
                let _renderGGChild = ({item}: any) => {
                    let childItem = item;
                    let childLabel = transformText(item);
                    let childValue = values?.[childItem];
                    childValue = Date.parse(childValue) > 0 ? moment(childValue)?.format('LL') : childValue;

                    if (typeof(childValue) === 'object') {
                        let _renderGGGChild = ({item}: any) => {
                            let gchildItem = item;
                            let gchildLabel = transformText(item);
                            let gchildValue = childValue?.[gchildItem];
                            gchildValue = Date.parse(gchildValue) > 0 ? moment(gchildValue)?.format('LL') : gchildValue;
                            return renderRow(`${gchildLabel}:`, gchildValue);
                        };
                        return (
                            <View style={styles.tableContainer}>
                                {renderHeader(childLabel, true)}
                                <FlatList
                                    data={Object.keys(childValue)}
                                    renderItem={_renderGGGChild}
                                    keyExtractor={(item, index) => `${index}`}
                                    scrollEnabled={false}
                                    style={styles?.gggChildContainer}
                                />
                            </View>
                        )
                    }

                    return renderRow(`${childLabel}:`, childValue);
                };
                return (
                    <FlatList
                        data={Object.keys(values)}
                        renderItem={_renderGGChild}
                        keyExtractor={(item, index) => `${index}`}
                        scrollEnabled={false}
                    />
                )
            }
            let _renderChild = ({item}: any) => {
                let childItem = item;
                let childLabel = transformText(item);
                let childValue = service?.[parentItem]?.[childItem];
                childValue = Date.parse(childValue) > 0 ? moment(childValue)?.format('LL') : childValue;
                if (typeof(childValue) === 'object' && !!childValue) return _renderGrandChild(childValue);
                else return renderRow(`${childLabel}:`, childValue);
            };
            return (
                <View style={styles.tableContainer}>
                    {renderHeader(parentLabel?.toUpperCase())}
                    <FlatList
                        data={Object.keys(service[item])}
                        renderItem={_renderChild}
                        keyExtractor={(item, index) => `${index}`}
                        scrollEnabled={false}
                        ItemSeparatorComponent={(item) => {
                            return (
                                <View style={service?.[parentItem]?.length > 0 && styles?.subChildSeparator} />
                            )
                        }}
                    />
                </View>
            )
        }
    };
    return (
        <FlatList
            data={Object.keys(service)}
            renderItem={_renderParent}
            keyExtractor={(item, index) => `${index}`}
            scrollEnabled={false}
        />
    )
};

export default RenderServiceMiscellaneous