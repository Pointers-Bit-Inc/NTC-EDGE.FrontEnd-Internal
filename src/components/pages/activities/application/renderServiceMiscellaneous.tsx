import {
    _bandwidthUnits,
    _classOfStation,
    _employementStatus,
    _employementType,
    isValidDate,
    transformText
} from "../../../../utils/ntc";
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



    if ( (!((
        title == transformText(props.nextValue)) || (
        title == transformText(props.index)))) && props.value) {

        title = transformText(props.nextValue || props.index);
        arr = []
        arr.push(props.value)
        //console.log(arr, "arr", title?.toUpperCase(), "uppercase", title?.toUpperCase() && !!arr?.join("")?.toString())
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

const RenderServiceMiscellaneous = (props) => {
    title = ""
    no = null
    arr = []
    let service = JSON.parse(JSON.stringify(props.service || {}));
    let serviceId = service._id
    let formCode = service?.applicationType?.formCode
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
                                if (i != "userId") {
                                    await f(e[i], p + i);
                                }
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

    const bandwidthUnits = useMemo(() => _bandwidthUnits, []);
    const employementStatus = useMemo(() => _employementStatus, []);
    const employementType = useMemo(() => _employementType, []);
    const classOfStation = useMemo(() => _classOfStation, []);


    let _renderParent = (item: any) => {
        const [keys, value] = item.item;
        var index, prevValue, nextValue, findIndex, firstLabel;
        findIndex = keys?.split?.(".")?.reverse()?.map((key, index) => {
            return key
        })?.findIndex((name) => {
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

            {isValidDate(props?.userProfileForm?.["service." + keys]) ? <DateField
                updateApplication={props?.updateApplication}
                updateForm={props.updateForm}
                stateName={"service." + keys}
                edit={props.edit}
                label={prevValue ? `${transformText(prevValue)}:` : ""}
                display={value}
                applicant={props?.userProfileForm?.["service." + keys]}/> : (transformText(keys?.split?.(".")?.[keys?.split?.(".")?.length - 1]) == "Unit" && transformText(keys?.split?.(".")?.[keys?.split?.(".")?.length - 2]) == "Bandwidth" && props.edit) ?
                <View style={{paddingBottom: 10}}>
                    <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                    label="Select Item"
                                    data={bandwidthUnits}
                                    onSelect={({value}) => {
                                        if (value) props.updateForm("service." + keys, value)
                                    }}/>
                </View> : (keys?.split?.(".")?.[0] == "employment" && keys?.split?.(".")?.[1] == "status" && props.edit) ?
                    <View style={{paddingBottom: 10}}>
                        <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                        label="Select Status"
                                        data={employementStatus}
                                        onSelect={({value}) => {
                                            if (value) props.updateForm("service." + keys, value)
                                        }}/>
                    </View>
                    : (keys?.split?.(".")?.[0] == "employment" && keys?.split?.(".")?.[1] == "type" && props.edit) ?
                        <View style={{paddingBottom: 10}}>
                            <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                            label="Select Type"
                                            data={employementType}
                                            onSelect={({value}) => {
                                                if (value) props.updateForm("service." + keys, value)
                                            }}/>
                        </View>
                        : (keys?.split?.(".").length >= 3 && formCode === 'ntc1-18-RCE' && keys?.split?.(".")?.[0] == "business" && keys?.split?.(".")?.[2] == "typeOfEntity" && props.edit) ?
                            <View style={{paddingBottom: 10}}>
                                <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                                label="Type of Entity"
                                                data={[
                                                    {label: 'Corporation', value: 'Corporation'},
                                                    {label: 'Single Proprietorship', value: 'Single Proprietorship'},
                                                    {label: 'Partnership', value: 'Partnership'},
                                                    {label: 'Others', value: 'Others', hasSpecification: true}
                                                ]}
                                                onSelect={({value}) => {
                                                    if (value) props.updateForm("service." + keys, value)
                                                }}/>
                            </View> : (keys?.split?.(".").length >= 3 && formCode === 'ntc1-11' && keys?.split?.(".")?.[0] == "particulars" && keys?.split?.(".")?.[2] == "stationClass" && props.edit) ?
                                <View style={{paddingBottom: 10}}>
                                    <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                                    label="Select Class of Station"
                                                    data={[
                                                        {label: 'RT', value: 'RT'},
                                                        {label: 'FX', value: 'FX'},
                                                        {label: 'FB', value: 'FB'},
                                                        {label: 'ML', value: 'ML'},
                                                        {label: 'BC', value: 'BC'},
                                                        {label: 'FC', value: 'FC'},
                                                        {label: 'FA', value: 'FA'},
                                                        {label: 'MA', value: 'MA'},
                                                        {label: 'TC', value: 'TC'},
                                                        {label: 'Others', value: 'Others'},
                                                    ]}
                                                    onSelect={({value}) => {
                                                        if (value) props.updateForm("service." + keys, value)
                                                    }}/>
                                </View> : (keys?.split?.(".").length >= 3 && formCode === 'ntc1-11-RSL' && keys?.split?.(".")?.[0] == "particulars" && keys?.split?.(".")?.[2] == "stationClass" && props.edit) ?
                                    <View style={{paddingBottom: 10}}>
                                        <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                                        label="Select Class of Station"
                                                        data={[
                                                            {label: 'RT', value: 'RT'},
                                                            {label: 'FX', value: 'FX'},
                                                            {label: 'FB', value: 'FB'},
                                                            {label: 'ML', value: 'ML'},
                                                            {label: 'P', value: 'P'},
                                                            {label: 'Others', value: 'Others'},
                                                        ]}
                                                        onSelect={({value}) => {
                                                            if (value) props.updateForm("service." + keys, value)
                                                        }}/>
                                    </View> : (keys?.split?.(".").length >= 3 && formCode === 'ntc1-11-public-trunked' && keys?.split?.(".")?.[0] == "particulars" && keys?.split?.(".")?.[2] == "stationClass" && props.edit) ?
                                        <View style={{paddingBottom: 10}}>
                                            <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                                            label="Select Class of Station"
                                                            data={[
                                                                {label: 'FX', value: 'FX'},
                                                                {label: 'FB', value: 'FB'},
                                                                {label: 'RT', value: 'RT'},
                                                                {label: 'P', value: 'P'},
                                                                {label: 'ML', value: 'ML'},
                                                            ]}
                                                            onSelect={({value}) => {
                                                                if (value) props.updateForm("service." + keys, value)
                                                            }}/>
                                        </View>
                                        : (keys?.split?.(".").length >= 3 && formCode === 'ntc1-09-ASL' && keys?.split?.(".")?.[0] == "particulars" && keys?.split?.(".")?.[2] == "stationClass" && props.edit) ?
                                            <View style={{paddingBottom: 10}}>
                                                <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                                                label="Select Class of Station"
                                                                data={[
                                                                    {label: 'FA', value: 'FA'},
                                                                    {label: 'MA', value: 'MA'},
                                                                ]}
                                                                onSelect={({value}) => {
                                                                    if (value) props.updateForm("service." + keys, value)
                                                                }}/>
                                            </View>
                                            : (keys?.split?.(".").length >= 3 && formCode === 'ntc1-09-MS-pur' && keys?.split?.(".")?.[0] == "particulars" && keys?.split?.(".")?.[2] == "stationClass" && props.edit) ?
                                                <View style={{paddingBottom: 10}}>
                                                    <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                                                    label="Select Class of Station"
                                                                    data={[
                                                                        {label: 'Other', value: 'Other'},
                                                                    ]}
                                                                    onSelect={({value}) => {
                                                                        if (value) props.updateForm("service." + keys, value)
                                                                    }}/>
                                                </View>
                                                : (keys?.split?.(".").length >= 3 && formCode === 'ntc1-11-vsat' && keys?.split?.(".")?.[0] == "particulars" && keys?.split?.(".")?.[2] == "stationClass" && props.edit) ?
                                                    <View style={{paddingBottom: 10}}>
                                                        <CustomDropdown value={props?.userProfileForm?.["service." + keys]}
                                                                        label="Select Class of Station"
                                                                        data={[
                                                                            {label: 'TC', value: 'TC'},
                                                                        ]}
                                                                        onSelect={({value}) => {
                                                                            if (value) props.updateForm("service." + keys, value)
                                                                        }}/>
                                                    </View>
                                                    : (keys?.split?.(".").length >= 3 && formCode === 'ntc1-11-bwa' && keys?.split?.(".")?.[0] == "particulars" && keys?.split?.(".")?.[2] == "stationClass" && props.edit) ?
                                                        <View style={{paddingBottom: 10}}>
                                                            <CustomDropdown
                                                                value={props?.userProfileForm?.["service." + keys]}
                                                                label="Select Class of Station"
                                                                data={[
                                                                    {label: 'FB', value: 'FB'},
                                                                ]}
                                                                onSelect={({value}) => {
                                                                    if (value) props.updateForm("service." + keys, value)
                                                                }}/>
                                                        </View>
                                                        : (keys?.split?.(".").length >= 3 && formCode === 'ntc1-09-PTEs' && keys?.split?.(".")?.[0] == "particulars" && keys?.split?.(".")?.[2] == "stationClass" && props.edit) ?
                                                            <View style={{paddingBottom: 10}}>
                                                                <CustomDropdown
                                                                    value={props?.userProfileForm?.["service." + keys]}
                                                                    label="Select Class of Station"
                                                                    data={[
                                                                        {label: 'FB', value: 'FB'},
                                                                        {label: 'FX', value: 'FX'},
                                                                        {label: 'P', value: 'P'},
                                                                        {label: 'ML', value: 'ML'},
                                                                        {label: 'RT', value: 'RT'},
                                                                        {label: 'VSAT', value: 'VSAT'},
                                                                        {label: 'P', value: 'P'},
                                                                    ]}
                                                                    onSelect={({value}) => {
                                                                        if (value) props.updateForm("service." + keys, value)
                                                                    }}/>
                                                            </View>
                                                            : (keys?.split?.(".").length >= 3 && formCode == "ntc1-03-and-09" && keys?.split?.(".")?.[0] == "particulars" && keys?.split?.(".")?.[2] == "stationClass" && props.edit) ?
                                                                <View style={{paddingBottom: 10}}>
                                                                    <CustomDropdown
                                                                        value={props?.userProfileForm?.["service." + keys]}
                                                                        label="Select Class of Station"
                                                                        data={classOfStation}
                                                                        onSelect={({value}) => {
                                                                            if (value) props.updateForm("service." + keys, value)
                                                                        }}/>
                                                                </View>
                                                                : (["ntc1-09-MS-pos", "ntc1-09-MS-pur"] .indexOf(formCode) != -1 && keys?.split?.(".")?.[0] == "natureOfService" && keys?.split?.(".")?.[1] == "type" && props.edit) ?
                                                                    <View style={{paddingBottom: 10}}>
                                                                        <CustomDropdown
                                                                            value={props?.userProfileForm?.["service." + keys]}
                                                                            label="Select type"
                                                                            data={[
                                                                                {
                                                                                    value: 'Maritime Service',
                                                                                    label: 'Maritime Service',
                                                                                },
                                                                            ]}
                                                                            onSelect={({value}) => {
                                                                                if (value) props.updateForm("service." + keys, value)
                                                                            }}/>
                                                                    </View>
                                                                    : (["ntc1-09-PTEs", "ntc1-11-bts"] .indexOf(formCode) != -1 && keys?.split?.(".")?.[0] == "natureOfService" && keys?.split?.(".")?.[1] == "type" && props.edit) ?
                                                                        <View style={{paddingBottom: 10}}>
                                                                            <CustomDropdown
                                                                                value={props?.userProfileForm?.["service." + keys]}
                                                                                label="Select type"
                                                                                data={[
                                                                                    {
                                                                                        value: 'CP (Public Correspondence)',
                                                                                        label: 'CP (Public Correspondence)',
                                                                                    },
                                                                                ]}
                                                                                onSelect={({value}) => {
                                                                                    if (value) props.updateForm("service." + keys, value)
                                                                                }}/>
                                                                        </View>

                                                                        : (["ntc1-11",
                                                                            'ntc1-11-ASL',
                                                                            'ntc1-11-and-09',
                                                                            'ntc1-11-RSL',
                                                                            'ntc1-11-microwave',
                                                                            'ntc1-11-vsat',
                                                                            "ntc1-11-public-trunked",
                                                                            "ntc1-11-bwa",
                                                                            "ntc1-11-wdn",
                                                                            "ntc1-11-coastal",
                                                                            "ntc1-14"
                                                                        ] .indexOf(formCode) != -1 && keys?.split?.(".")?.[0] == "natureOfService" && keys?.split?.(".")?.[1] == "type" && props.edit) ?
                                                                            <View style={{paddingBottom: 10}}>
                                                                                <CustomDropdown
                                                                                    value={props?.userProfileForm?.["service." + keys]}
                                                                                    label="Select type"
                                                                                    data={[
                                                                                        {
                                                                                            value: 'CV (Private)',
                                                                                            label: 'CV (Private)',
                                                                                        },
                                                                                        {
                                                                                            value: 'CO (Government)',
                                                                                            label: 'CO (Government)',
                                                                                        },
                                                                                        {
                                                                                            value: 'CP (Public Correspondence)',
                                                                                            label: 'CP (Public Correspondence)',
                                                                                        },
                                                                                    ]}
                                                                                    onSelect={({value}) => {
                                                                                        if (value) props.updateForm("service." + keys, value)
                                                                                    }}/>
                                                                            </View>
                                                                            : (["ntc1-11",
                                                                                'ntc1-11-ASL',
                                                                                'ntc1-11-and-09',
                                                                                'ntc1-11-RSL',
                                                                                'ntc1-11-microwave',
                                                                                'ntc1-11-vsat',
                                                                                "ntc1-11-public-trunked",
                                                                                "ntc1-11-bwa",
                                                                                "ntc1-11-wdn",
                                                                                "ntc1-11-coastal",
                                                                                "ntc1-14"
                                                                            ] .indexOf(formCode) != -1 && keys?.split?.(".")?.[0] == "transmissionType" && keys?.split?.(".")?.[1] == "transmissionType" && props.edit) ?
                                                                                <View style={{paddingBottom: 10}}>
                                                                                    <CustomDropdown
                                                                                        value={props?.userProfileForm?.["service." + keys]}
                                                                                        label="Select type"
                                                                                        data={[
                                                                                            {
                                                                                                value: 'Simplex',
                                                                                                label: 'Simplex',
                                                                                            },
                                                                                            {
                                                                                                value: 'Duplex',
                                                                                                label: 'Duplex',
                                                                                            },
                                                                                        ]}
                                                                                        onSelect={({value}) => {
                                                                                            if (value) props.updateForm("service." + keys, value)
                                                                                        }}/>
                                                                                </View>
                                                                                : (["ntc1-09-ASL", "ntc1-09-ASL-pur"
                                                                                ] .indexOf(formCode) != -1 && keys?.split?.(".")?.[0] == "natureOfService" && keys?.split?.(".")?.[1] == "type" && props.edit) ?
                                                                                    <View style={{paddingBottom: 10}}>
                                                                                        <CustomDropdown
                                                                                            value={props?.userProfileForm?.["service." + keys]}
                                                                                            label="Select type"
                                                                                            data={[
                                                                                                {
                                                                                                    value: 'CV (Private)',
                                                                                                    label: 'CV (Private)',
                                                                                                },
                                                                                                {
                                                                                                    value: 'CO (Government)',
                                                                                                    label: 'CO (Government)',
                                                                                                },
                                                                                            ]}
                                                                                            onSelect={({value}) => {
                                                                                                if (value) props.updateForm("service." + keys, value)
                                                                                            }}/>
                                                                                    </View>
                                                                                    :  (["ntc1-25-sms"
                                                                                    ] .indexOf(formCode) != -1 && keys?.split?.(".")?.[0] == "natureOfComplaint" && keys?.split?.(".")?.[1] == "complaint" && props.edit) ?
                                                                                        <View style={{paddingBottom: 10}}>
                                                                                            <CustomDropdown
                                                                                                value={props?.userProfileForm?.["service." + keys]}
                                                                                                label="Select Complaint"
                                                                                                data={[
                                                                                                    {label: 'Spam', value: 'Spam'},
                                                                                                    {label: 'Scam', value: 'Scam'},
                                                                                                    {label: 'Threat', value: 'Threat'},
                                                                                                    {label: 'Others', value: 'Others', hasSpecification: true}
                                                                                                ]}
                                                                                                onSelect={({value}) => {
                                                                                                    if (value) props.updateForm("service." + keys, value)
                                                                                                }}/>
                                                                                        </View>
                                                                                        :(["ntc1-25-telco"
                                                                                        ] .indexOf(formCode) != -1 && keys?.split?.(".")?.[0] == "natureOfComplaint" && keys?.split?.(".")?.[1] == "complaint" && props.edit) ?
                                                                                            <View style={{paddingBottom: 10}}>
                                                                                                <CustomDropdown
                                                                                                    value={props?.userProfileForm?.["service." + keys]}
                                                                                                    label="Select Complaint"
                                                                                                    data={[
                                                                                                        {label: 'Billing Complaint', value: 'Billing Complaint'},
                                                                                                        {label: 'Fair Use', value: 'Fair Use'},
                                                                                                        {label: 'Poor Service (Technical Service/Customer Service)', value: 'Poor Service (Technical Service/Customer Service)'},
                                                                                                        {label: 'Denial of Subscription Plan', value: 'Denial of Subscription Plan'},
                                                                                                        {label: 'Others', value: 'Others', hasSpecification: true}
                                                                                                    ]}
                                                                                                    onSelect={({value}) => {
                                                                                                        if (value) props.updateForm("service." + keys, value)
                                                                                                    }}/>
                                                                                            </View>
                                                                                            :  <Row
                                                                                                id={props?.userProfileForm?.["_id"] || serviceId}
                                                                                                updateApplication={props?.updateApplication}
                                                                                                updateForm={props.updateForm}
                                                                                                stateName={"service." + keys}
                                                                                                edit={props.edit}
                                                                                                label={prevValue ? `${transformText(keys?.split?.(".")?.[keys?.split?.(".")?.length - 1])}:` : ""}
                                                                                                display={value}
                                                                                                applicant={props?.userProfileForm?.["service." + keys]}/>
            }
        </View>)


    };


    return (
        <FlatList
            showsVerticalScrollIndicator={true}
            initialNumToRender={100}
            style={styles.group3}
            data={Object.entries(flatten(_.omit(service, props.exclude)))}
            renderItem={_renderParent}
            keyExtractor={(item, index) => `${index}`}
            scrollEnabled={false}
        />
    )
};
RenderServiceMiscellaneous.defaultProps = {
    isTitleVisible: true
}
export default memo(RenderServiceMiscellaneous)
