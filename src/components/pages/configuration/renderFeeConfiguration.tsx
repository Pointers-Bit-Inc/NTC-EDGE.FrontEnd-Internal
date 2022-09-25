import Row from "@pages/activities/application/Row";
import {FlatList, StyleSheet, Text, View} from "react-native";
import React, {memo, useMemo} from "react";
import {input} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import {Regular500} from "@styles/font";
import moment from "moment";
import _ from "lodash";
import DateField from "@pages/activities/application/datefield";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import {fuzzysearch, isValidDate, transformText} from "../../../utils/ntc";

const styles = StyleSheet.create({
    subChildSeparator: {
        height: 1,
        backgroundColor: input.background.default,
        marginVertical: 10,
    },
    group2: {
        paddingBottom: 20,
        width: "100%",
        borderRadius: 5,
        alignSelf: "center",

        backgroundColor: "#fff",
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 2,
        shadowOpacity: 0.1,
        shadowRadius: 2,
        padding: 10
    },
    rect: {
        marginTop: 10,
        padding: 10,
        paddingVertical: 5,
        backgroundColor: "#EFF0F6",

    },
    file: {
        fontSize: fontValue(12),
        fontFamily: Regular500,
        color: "#565961",
    },
    group3: {
        paddingRight: fontValue(10),
        paddingLeft: fontValue(10),
        paddingBottom: fontValue(20)
    },
});
let title = '';
let no = null;
let arr = []

function Title(props: { nextValue, index, value }) {

    if (!(
        (
            title === transformText(props.nextValue)) || (
            title === transformText(props.index)))) {

        title = transformText(
            props.nextValue || props.index);

        arr = []
        arr.push(props.value)
        return <>{title?.toUpperCase() && !!arr?.join("")?.toString() ? <View style={{paddingVertical: 5}}>
            <View style={styles.rect}>
                <Text style={styles.file}>{title?.toUpperCase()}</Text>
            </View>
        </View> : <></>}</>

    }
    arr.push(props?.value)
    return <></>
}

function Separator({index}) {
    if (no != index && index != undefined) {
        no = index;
        return no != 0 ? <View style={{marginTop: 10, borderTopWidth: 1, borderColor: "#EFF0F6"}}/> : <></>;
    }
    return <></>

}

const RenderFeeConfiguration = (props) => {
    let service = JSON.parse(JSON.stringify(props.service || {}));


    const flatten = (obj) => {
        var result = {};
        (
            async function f(e, p = undefined) {
                switch (typeof e) {
                    case "object":

                        if (true) {

                            p = p ? p + "." : "";
                            _.forIn(e, async function (value, i) {

                                if (e[i]?.hasOwnProperty('year')) {
                                    e[i] = moment(e[i])?.format('LL')
                                }
                                await f(e[i], p + i);
                            });
                        }
                        break;
                    default:
                        let date = new RegExp(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)
                        result[p] = date?.test(e) && Date.parse(e) > 0 ? moment(e)?.format('LL') : (typeof e == 'string' ? e?.replace(/undefined/g, '') || e : e);
                        break;
                }
            })(obj);

        return result;
    };

    const bandwidthUnits = useMemo(() => [
        {label: 'KHz', value: 'KHz'},
        {label: 'MHz', value: 'MHz'},
        {label: 'GHz', value: 'GHz'}
    ], []);
    const _renderParent = (item: any) => {
        const [keys, value] = item.item;

        var index, prevValue, nextValue, findIndex;
        findIndex = keys?.split?.(".")?.reverse()?.map((key, index) => {
            return key
        }).findIndex((name) => {
            return !isNaN(parseInt(name))
        });
        if (findIndex != -1) {
            index = keys?.split?.(".")?.reverse()?.[findIndex];
            prevValue = keys?.split?.(".")?.reverse()?.[findIndex - 1];
            nextValue = keys?.split?.(".")?.reverse()?.[findIndex + 1];
        } else {

            prevValue = keys?.split?.(".")?.[keys?.split?.(".")?.length - 1];
            index = keys?.split?.(".")?.[keys?.split?.(".")?.length];
            nextValue = keys?.split?.(".")?.[keys?.split?.(".")?.length - 2] || keys?.split?.(".")?.[0];
        }
        return (<View>

            {props?.isTitleVisible ? <Title nextValue={nextValue} index={index} value={value}/> : <></>}
            <Separator index={index}/>

            {isValidDate(props?.userProfileForm?.["fees." + keys]) ? <DateField
                updateApplication={props?.updateApplication}
                updateForm={props.updateForm}
                stateName={"fees." + keys}
                edit={props.edit}
                label={prevValue ? `${transformText(prevValue)}:` : ""}
                display={value}
                applicant={props?.userProfileForm?.["fees." + keys]}/> : (transformText(keys?.split?.(".")?.[keys?.split?.(".")?.length - 1]) == "Unit" && transformText(keys?.split?.(".")?.[keys?.split?.(".")?.length - 2]) == "Bandwidth" && props.edit) ?
                <View style={{paddingBottom: 20}}>
                    <CustomDropdown value={props?.userProfileForm?.["fees." + keys]}
                                    label="Select Item"
                                    data={bandwidthUnits}
                                    onSelect={({value}) => {
                                        if (value) props.updateForm("fees." + keys, value)
                                    }}/>
                </View> : <Row
                    updateApplication={props?.updateApplication}
                    updateForm={props.updateForm}
                    edit={props.edit}
                    stateName={"fees." + keys}

                    label={prevValue ? `${transformText(keys?.split?.(".")?.[keys?.split?.(".")?.length - 1])}:` : ""}
                    display={value.toString()}
                    applicant={props?.userProfileForm?.["fees." + keys]}/>
            }
        </View>)


    };


    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.group3}
            data={Object.entries(flatten(_.omit(service, props.exclude))).filter(e => {
                return fuzzysearch(props.search, transformText(e?.[0]))
            })}
            renderItem={_renderParent}
            keyExtractor={(item, index) => `${index}`}
            scrollEnabled={false}
        />
    )
};
RenderFeeConfiguration.defaultProps = {
    isTitleVisible: true
}
export default memo(RenderFeeConfiguration)
