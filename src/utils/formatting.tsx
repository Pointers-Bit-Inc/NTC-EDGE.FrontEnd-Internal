import lodash from 'lodash';
import dayjs from 'dayjs';
import moment from 'moment';
import {validateText} from "./form-validations";
import {Platform} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
const getInitial = (value:any) => {
    return value.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
}
export const isMobile = Platform?.OS === 'ios' || Platform?.OS === 'android';
export const isPad = Platform?.isPad;

const getChannelName = (channel:any) => {
    if (!channel.isGroup && !channel.hasChannelName) {
        const result = channel.otherParticipants;
        if (result && result[0]) {
            const data = result[0];
            return `${data.firstName} ${data.lastName}`;
        }
    }
    return channel.channelName;
}

const getChannelImage = (channel:any) => {
    if (!channel.isGroup) {
        const result = channel.otherParticipants;
        if (result && result[0]) {
            const data = result[0];
            return data?.profilePicture?.thumb || '';
        }
    }
    return channel.image;
}

const getTimeString = (time:any) => {
    if (time) {
        const dateNow = dayjs();
        const dateUpdate = dayjs(new Date(time * 1000));
        const diff = dateNow.diff(dateUpdate, 'days');

        if (diff === 0) {
            return dateUpdate.format('h:mm A');
        } else if (diff === 1) {
            return 'Yesterday';
        } else if (diff <= 7) {
            return dateUpdate.format('dddd');
        }
        return dateUpdate.format('DD/MM/YY');
    }
    return '';
}

const getChatTimeString = (time:any) => {
    if (time) {
        const dateNow = dayjs();
        const dateUpdate = dayjs(new Date(time * 1000));
        const diff = dateNow.diff(dateUpdate, 'days');
        const yearNow = dateNow.format('YYYY');
        const yearUpdate = dateUpdate.format('YYYY');

        if (diff === 0) {
            return dateUpdate.format('h:mm A');
        } else if (diff === 1) {
            return 'Yesterday';
        } else if (diff <= 7) {
            return dateUpdate.format('dddd');
        } else if (yearNow === yearUpdate) {
            return dateUpdate.format('MMM DD, h:mm A');
        }
        return dateUpdate.format('DD/MM/YY');
    }
    return '';
}

const getDateTimeString = (time:any) => {
    if (time) {
        const dateTime = dayjs(new Date(time * 1000));
        return dateTime.format('MMM. DD, hh:mm A');
    }
    return '';
}

const chatSameDate = (time1:number, time2:number) => {
    const time1format = dayjs(time1 && new Date(time1 * 1000)).format('DD/MM/YY');
    const time2format = dayjs(time2 && new Date(time2 * 1000)).format('DD/MM/YY');
    return time1format === time2format;
}

const checkSeen = (seen = [], user:any) => {
    return !!lodash.size(
        lodash.find(
            seen,
            (s:any) => s._id === user._id
        )
    )
}

const getOtherParticipants = (participants = [], user:any) => {
    return lodash.reject(
        participants,
        (p:any) => p._id === user._id
    );
}

const getTimerString = (time:number) => {
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    var format = "";
    format += (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "");
    format += "" + secs;
    return format;
}

const getDayMonthString = (time:number) => {
    if (time) {
        const dateTime = dayjs(new Date(time * 1000));
        return dateTime.format('MM/DD');
    }
    return '';
}

const getColorFromName = (value:string) => {
    const firstChar = String(value).charAt(0);
    const lowerCaseValue = String(firstChar).toLowerCase();
    const colors = ['#D74D43', '#D4883A', '#91B798', '#42495B', '#ADB6D7']
    const colorFromLetters:any = {
        a: colors[0],
        b: colors[1],
        c: colors[2],
        d: colors[3],
        e: colors[4],
        f: colors[0],
        g: colors[1],
        h: colors[2],
        i: colors[3],
        j: colors[4],
        k: colors[0],
        l: colors[1],
        m: colors[2],
        n: colors[3],
        o: colors[4],
        p: colors[0],
        q: colors[1],
        r: colors[2],
        s: colors[3],
        t: colors[4],
        u: colors[0],
        v: colors[1],
        w: colors[2],
        x: colors[3],
        y: colors[4],
        z: colors[0],
    }
    return colorFromLetters[lowerCaseValue] || colors[0];
}
export const JSONfn = {
    stringify: (obj: any) => {
        return JSON.stringify(obj,function(key, value){
            return (typeof value === 'function' ) ? value.toString() : value;
        });
    },
    parse: (str: string) => {
        return JSON.parse(str,function(key, value){
            if(typeof value != 'string') return value;
            return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
        });
    }
};
export const RNValue = (number: number) => { return  Platform.OS === 'ios' || Platform.OS === 'android' ? RFValue(number) : number;}
export const extractDate = (date: any, d: any) => {
    if (!date) return '';
    let _d = (`0${(moment(date)?.subtract(d === 'month' ? 1 : 0, 'months')?.get(d) + (d === 'month' ? 1 : 0))}`)?.slice(d === 'year' ? -4 : -2);
    if (d === 'month' && _d === '12') _d = '00';
    return isNaN(Number(_d)) ? '' : _d;
};
export const generateForm = (savedApplication: any, form: any) => {
    const service = savedApplication?.service;
    const Form = JSONfn.parse(JSONfn.stringify(form));
    const gIndex = (d: string, v: any) => v?.findIndex((i: any) => i.id === d);
    Object.keys(service).forEach((parent, index) => {
        if (
            parent !== '_id' &&
            parent !== 'applicationType' &&
            parent !== 'name' &&
            parent !== 'serviceCode'
        ) {
            const parentItem = service[parent];
            const form_parentIndex = Form.findIndex((i: any) => i.id === parent);
            const _specifyML = { /**will be temporarily not prefilled-in */
                id: 'vehiclePlateNo',
                label: 'Plate No.',
                placeholder: 'Plate No.',
                value: '',
                hasValidation: true,
                required: true,
                isValid: false,
                error: '',
                errorResponse: 'Please enter plate no.',
                title: 'Particulars of Vehicle',
            };
            if (parentItem.length > 0 && form_parentIndex > -1) { // parentList, particulars ex. && field exists on form
                parentItem.forEach((child: any, index: number) => {
                    const childIndex = index;
                    if (Form?.[form_parentIndex]?.data?.length < childIndex + 1) { // add another obj inside the array, ex. multiple equipments
                        Form?.[form_parentIndex]?.data?.push(Form[form_parentIndex].template)
                    }
                    Object.keys(child)?.forEach((grandchild, index) => {
                        var grandchildItem = child[grandchild];
                        const grandchildIndex = index;
                        const form_grandchildIndex = Form?.[form_parentIndex]?.data?.[childIndex]?.findIndex((i: any) => i.id === grandchild);

                        if (typeof(grandchildItem) === 'string') { // stationClass ex.
                            let formPath = Form?.[form_parentIndex]?.data?.[childIndex]?.[grandchildIndex];
                            if (!!formPath) {
                                let { type, value, validate, required, error } = formPath || {}, specValue = '';
                                if (typeof(grandchildItem) === 'string') {
                                    specValue = grandchildItem?.split(' • ')?.[1];
                                    grandchildItem = grandchildItem?.split(' • ')?.[0];
                                }
                                if (type === 'date') {
                                    let y = extractDate(grandchildItem, 'year'), m = extractDate(grandchildItem, 'month'), d = extractDate(grandchildItem, 'date');
                                    Form[form_parentIndex].data[childIndex][grandchildIndex].value[gIndex('year', value)] = {
                                        id: 'year',
                                        value: y,
                                        isValid: !!y,
                                    };
                                    Form[form_parentIndex].data[childIndex][grandchildIndex].value[gIndex('month', value)] = {
                                        id: 'month',
                                        value: m,
                                        isValid: !!m,
                                    };
                                    Form[form_parentIndex].data[childIndex][grandchildIndex].value[gIndex('day', value)] = {
                                        id: 'day',
                                        value: d,
                                        isValid: !!d,
                                    };
                                }
                                else if (type === 'option') {
                                    /** no need to update since parent condition says "typeof(grandchildItem) === 'string'" and string can't be for-Eached */
                                }
                                else if (typeof(grandchildItem) === 'object') {
                                    /** no need to update since parent condition says "typeof(grandchildItem) === 'string'" and this condition says "typeof(grandchildItem) === 'object'" */
                                }
                                else {
                                    let isValid = validate ? validate(grandchildItem) : validateText(grandchildItem);
                                    Form[form_parentIndex].data[childIndex][grandchildIndex] = {
                                        ...formPath,
                                        value: grandchildItem,
                                        isValid,
                                        error: required
                                            ? isValid
                                                ? ''
                                                : (error || 'Please enter a valid value')
                                            : ''
                                    };
                                }

                                var item = {};
                                const itemIndex = formPath?.items?.findIndex((i: any) => i.value === grandchildItem);
                                if (itemIndex > -1) {
                                    item = formPath?.items[itemIndex];
                                    if (item?.addSection) Form.splice(form_parentIndex + 1, 0, item?.section);
                                }

                                const hasSpecification = (formPath?.hasSpecification || item?.hasSpecification) && type !== 'option';
                                const baseSpecification = item?.specification ? item : formPath;
                                if (hasSpecification) {
                                    let _specify = baseSpecification?.specification || {
                                        id: `for-${formPath?.id}`,
                                        label: baseSpecification?.specificationLabel || 'Please specify',
                                        placeholder: baseSpecification?.specificationLabel || 'Please specify',
                                        value: '',
                                        hasValidation: true,
                                        required: true,
                                        isValid: false,
                                        error: '',
                                        errorResponse: `Please enter a valid ${(baseSpecification?.specificationLabel || 'specification')?.toLowerCase()}`,
                                        validate: baseSpecification?.validate || validateText,
                                        keyboardType: baseSpecification?.keyboardType || 'default',
                                        specification: true,
                                    };
                                    Form[form_parentIndex].data[childIndex][grandchildIndex] = {...Form[form_parentIndex].data[childIndex][grandchildIndex], hasSpecification: true};
                                    Form[form_parentIndex].data[childIndex]?.splice(grandchildIndex + 1, 0, _specify);
                                }
                                // if (grandchildItem === 'ML') Form[form_parentIndex].data[childIndex]?.splice(grandchildIndex + (hasSpecification ? 2 : 1), 0, _specifyML);

                            }

                        }

                        else if (grandchildItem?.length > 0) { // equipments ex.
                            grandchildItem?.forEach((ggrandchild: any, index: number) => {
                                const ggrandchildIndex = index;
                                if (Form?.[form_parentIndex]?.data?.[childIndex]?.[form_grandchildIndex]?.data?.length < ggrandchildIndex + 1) { // add another obj inside the array, ex. multiple equipments
                                    Form?.[form_parentIndex]?.data?.[childIndex]?.[form_grandchildIndex]?.data?.push(Form?.[form_parentIndex]?.data?.[childIndex]?.[form_grandchildIndex]?.template);
                                }
                                Object.keys(ggrandchild)?.forEach((gggrandchild: any, index: number) => {
                                    var gggrandchildItem = ggrandchild[gggrandchild];
                                    const form_gggrandchildIndex = Form?.[form_parentIndex]?.data?.[childIndex]?.[form_grandchildIndex]?.data?.[ggrandchildIndex]?.findIndex((i: any) => i.id === gggrandchild);

                                    let formPath = Form?.[form_parentIndex]?.data?.[childIndex]?.[form_grandchildIndex]?.data?.[ggrandchildIndex]?.[form_gggrandchildIndex];
                                    if (!!formPath) {
                                        let { type, value, validate, required, error } = formPath || {}, specValue = '';
                                        if (typeof(gggrandchildItem) === 'string') {
                                            specValue = gggrandchildItem?.split(' • ')?.[1];
                                            gggrandchildItem = gggrandchildItem?.split(' • ')?.[0];
                                        }
                                        if (type === 'date') {
                                            let y = extractDate(gggrandchildItem, 'year'), m = extractDate(gggrandchildItem, 'month'), d = extractDate(gggrandchildItem, 'date');
                                            Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].value[gIndex('year', value)] = {
                                                id: 'year',
                                                value: y,
                                                isValid: !!y,
                                            };
                                            Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].value[gIndex('month', value)] = {
                                                id: 'month',
                                                value: m,
                                                isValid: !!m,
                                            };
                                            Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].value[gIndex('day', value)] = {
                                                id: 'day',
                                                value: d,
                                                isValid: !!d,
                                            };
                                        }
                                        else if (type === 'option') {
                                            gggrandchildItem?.forEach((ggggrandchildItem: any, index: number) => {
                                                const form_ggggrandchildIndex = Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex]?.items?.findIndex((i: any) => i.value === ggggrandchildItem?.value);
                                                Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].items[form_ggggrandchildIndex].selected = true;
                                                const specification = ggggrandchildItem.specification;
                                                if (specification) {
                                                    let formPath = Form?.[form_parentIndex]?.data?.[childIndex]?.[form_grandchildIndex]?.data?.[ggrandchildIndex]?.[form_gggrandchildIndex]?.items?.[form_ggggrandchildIndex]?.specification;
                                                    if (!!formPath) {
                                                        let { type, value, validate, required, error } = formPath || {};
                                                        if (type === 'date') {
                                                            let y = extractDate(specification, 'year'), m = extractDate(specification, 'month'), d = extractDate(specification, 'date');
                                                            Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].items[form_ggggrandchildIndex].specification.value[gIndex('year', value)] = {
                                                                id: 'year',
                                                                value: y,
                                                                isValid: !!y,
                                                            };
                                                            Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].items[form_ggggrandchildIndex].specification.value[gIndex('month', value)] = {
                                                                id: 'month',
                                                                value: m,
                                                                isValid: !!m,
                                                            };
                                                            Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].items[form_ggggrandchildIndex].specification.value[gIndex('day', value)] = {
                                                                id: 'day',
                                                                value: d,
                                                                isValid: !!d,
                                                            };
                                                        }
                                                        else if (typeof(specification) === 'object') {
                                                            Object.keys(specification)?.forEach((gggggrandchild, index) => {
                                                                const gggggrandchildItem = specification[gggggrandchild];
                                                                const form_gggggrandchildIndex = Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].items[form_ggggrandchildIndex].specification.value?.findIndex((i: any) => i.id === gggggrandchild);
                                                                Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].items[form_ggggrandchildIndex].specification.value[form_gggggrandchildIndex].value = gggggrandchildItem;
                                                            });
                                                        }
                                                        else {
                                                            let isValid = validate ? validate(specification) : validateText(specification);
                                                            Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].items[form_ggggrandchildIndex].specification = {
                                                                ...formPath,
                                                                value: specification,
                                                                isValid,
                                                                error: required
                                                                    ? isValid
                                                                        ? ''
                                                                        : (error || 'Please enter a valid value')
                                                                    : ''
                                                            };
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        else if (typeof(gggrandchildItem) === 'object') {
                                            Object.keys(gggrandchildItem)?.forEach((ggggrandchild, index) => {
                                                const ggggrandchildItem = gggrandchildItem[ggggrandchild];
                                                const form_ggggrandchildIndex = Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex]?.value?.findIndex((i: any) => i.id === gggrandchild);
                                                Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex].value[form_ggggrandchildIndex].value = ggggrandchildItem;
                                            });
                                        }
                                        else {
                                            let isValid = validate ? validate(gggrandchildItem) : validateText(gggrandchildItem);
                                            Form[form_parentIndex].data[childIndex][form_grandchildIndex].data[ggrandchildIndex][form_gggrandchildIndex] = {
                                                ...formPath,
                                                value: gggrandchildItem,
                                                isValid,
                                                error: required
                                                    ? isValid
                                                        ? ''
                                                        : (error || 'Please enter a valid value')
                                                    : ''
                                            };
                                        }

                                        var item = {};
                                        const itemIndex = formPath?.items?.findIndex((i: any) => i.value === gggrandchildItem);
                                        if (itemIndex > -1) {
                                            item = formPath?.items[itemIndex];
                                            if (item?.addSection) Form.splice(form_parentIndex + 1, 0, item?.section);
                                        }

                                        const hasSpecification = (formPath?.hasSpecification || item?.hasSpecification) && type !== 'option';
                                        const baseSpecification = item?.specification ? item : formPath;
                                        if (hasSpecification) {
                                            let _specify = baseSpecification?.specification || {
                                                id: `for-${formPath?.id}`,
                                                label: baseSpecification?.specificationLabel || 'Please specify',
                                                placeholder: baseSpecification?.specificationLabel || 'Please specify',
                                                value: '',
                                                hasValidation: true,
                                                required: true,
                                                isValid: false,
                                                error: '',
                                                errorResponse: `Please enter a valid ${(baseSpecification?.specificationLabel || 'specification')?.toLowerCase()}`,
                                                validate: baseSpecification?.validate || validateText,
                                                keyboardType: baseSpecification?.keyboardType || 'default',
                                                specification: true,
                                            };
                                            Form[form_parentIndex].data[childIndex][grandchildIndex] = {...Form[form_parentIndex].data[childIndex][grandchildIndex], hasSpecification: true};
                                            Form[form_parentIndex].data[childIndex]?.splice(grandchildIndex + 1, 0, _specify);
                                        }
                                        // if (grandchildItem === 'ML') Form[form_parentIndex].data[childIndex]?.splice(grandchildIndex + (hasSpecification ? 2 : 1), 0, _specifyML);
                                    }

                                });
                            });
                        }

                        else if (Object.keys(grandchildItem)?.length > 0) { // equipment ex.
                            Object.keys(grandchildItem)?.forEach((ggrandchild, index) => {
                                var ggrandchildItem = grandchildItem[ggrandchild];
                                const form_ggrandchildIndex = Form?.[form_parentIndex]?.data?.[childIndex]?.[grandchildIndex]?.data?.findIndex((i: any) => i.id === ggrandchild);

                                let formPath = Form?.[form_parentIndex]?.data?.[childIndex]?.[grandchildIndex]?.data?.[form_ggrandchildIndex];
                                if (!!formPath) {
                                    let { type, value, validate, required, error } = formPath || {}, specValue = '';
                                    if (typeof(ggrandchildItem) === 'string') {
                                        specValue = ggrandchildItem?.split(' • ')?.[1];
                                        ggrandchildItem = ggrandchildItem?.split(' • ')?.[0];
                                    }
                                    if (type === 'date') {
                                        let y = extractDate(ggrandchildItem, 'year'), m = extractDate(ggrandchildItem, 'month'), d = extractDate(ggrandchildItem, 'date');
                                        Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].value[gIndex('year', value)] = {
                                            id: 'year',
                                            value: y,
                                            isValid: !!y,
                                        };
                                        Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].value[gIndex('month', value)] = {
                                            id: 'month',
                                            value: m,
                                            isValid: !!m,
                                        };
                                        Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].value[gIndex('day', value)] = {
                                            id: 'day',
                                            value: d,
                                            isValid: !!d,
                                        };
                                    }
                                    else if (type === 'option') {
                                        ggrandchildItem?.forEach((gggrandchildItem: any, index: number) => {
                                            const form_gggrandchildIndex = Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex]?.items?.findIndex((i: any) => i.value === gggrandchildItem?.value);
                                            Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].items[form_gggrandchildIndex].selected = true;
                                            const specification = gggrandchildItem.specification;
                                            if (specification) {
                                                let formPath = Form?.[form_parentIndex]?.data?.[childIndex]?.[grandchildIndex]?.data?.[form_ggrandchildIndex]?.items?.[form_gggrandchildIndex]?.specification;
                                                if (!!formPath) {
                                                    let { type, value, validate, required, error } = formPath || {};
                                                    if (type === 'date') {
                                                        let y = extractDate(specification, 'year'), m = extractDate(specification, 'month'), d = extractDate(specification, 'date');
                                                        Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].items[form_gggrandchildIndex].specification.value[gIndex('year', value)] = {
                                                            id: 'year',
                                                            value: y,
                                                            isValid: !!y,
                                                        };
                                                        Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].items[form_gggrandchildIndex].specification.value[gIndex('month', value)] = {
                                                            id: 'month',
                                                            value: m,
                                                            isValid: !!m,
                                                        };
                                                        Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].items[form_gggrandchildIndex].specification.value[gIndex('day', value)] = {
                                                            id: 'day',
                                                            value: d,
                                                            isValid: !!d,
                                                        };
                                                    }
                                                    else if (typeof(specification) === 'object') {
                                                        Object.keys(specification)?.forEach((ggggrandchild, index) => {
                                                            const ggggrandchildItem = specification[ggggrandchild];
                                                            const form_ggggrandchildIndex = Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].items[form_gggrandchildIndex].specification.value?.findIndex((i: any) => i.id === ggggrandchild);
                                                            Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].items[form_gggrandchildIndex].specification.value[form_ggggrandchildIndex].value = ggggrandchildItem;
                                                        });
                                                    }
                                                    else {
                                                        let isValid = validate ? validate(specification) : validateText(specification);
                                                        Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].items[form_gggrandchildIndex].specification = {
                                                            ...formPath,
                                                            value: specification,
                                                            isValid,
                                                            error: required
                                                                ? isValid
                                                                    ? ''
                                                                    : (error || 'Please enter a valid value')
                                                                : ''
                                                        };
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    else if (typeof(ggrandchildItem) === 'object') {
                                        Object.keys(ggrandchildItem)?.forEach((gggrandchild, index) => {
                                            const gggrandchildItem = ggrandchildItem[gggrandchild];
                                            const form_gggrandchildIndex = Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex]?.value?.findIndex((i: any) => i.id === gggrandchild);
                                            Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex].value[form_gggrandchildIndex].value = gggrandchildItem;
                                        });
                                    }
                                    else {
                                        let isValid = validate ? validate(ggrandchildItem) : validateText(ggrandchildItem);
                                        Form[form_parentIndex].data[childIndex][grandchildIndex].data[form_ggrandchildIndex] = {
                                            ...formPath,
                                            value: ggrandchildItem,
                                            isValid,
                                            error: required
                                                ? isValid
                                                    ? ''
                                                    : (error || 'Please enter a valid value')
                                                : ''
                                        };
                                    }

                                    var item = {};
                                    const itemIndex = formPath?.items?.findIndex((i: any) => i.value === ggrandchildItem);
                                    if (itemIndex > -1) {
                                        item = formPath?.items[itemIndex];
                                        if (item?.addSection) Form.splice(form_parentIndex + 1, 0, item?.section);
                                    }

                                    const hasSpecification = (formPath?.hasSpecification || item?.hasSpecification) && type !== 'option';
                                    const baseSpecification = item?.specification ? item : formPath;
                                    if (hasSpecification) {
                                        let _specify = baseSpecification?.specification || {
                                            id: `for-${formPath?.id}`,
                                            label: baseSpecification?.specificationLabel || 'Please specify',
                                            placeholder: baseSpecification?.specificationLabel || 'Please specify',
                                            value: '',
                                            hasValidation: true,
                                            required: true,
                                            isValid: false,
                                            error: '',
                                            errorResponse: `Please enter a valid ${(baseSpecification?.specificationLabel || 'specification')?.toLowerCase()}`,
                                            validate: baseSpecification?.validate || validateText,
                                            keyboardType: baseSpecification?.keyboardType || 'default',
                                            specification: true,
                                        };
                                        Form[form_parentIndex].data[childIndex][grandchildIndex] = {...Form[form_parentIndex].data[childIndex][grandchildIndex], hasSpecification: true};
                                        Form[form_parentIndex].data[childIndex]?.splice(grandchildIndex + 1, 0, _specify);
                                    }
                                    // if (grandchildItem === 'ML') Form[form_parentIndex].data[childIndex]?.splice(grandchildIndex + (hasSpecification ? 2 : 1), 0, _specifyML);

                                }

                            });
                        }

                    });
                });
            }

            else if (Object.keys(parentItem)?.length > 0 && form_parentIndex > -1) { // not parentList, stationEquipment ex. && field exists on form
                Object.keys(parentItem)?.forEach((child, index) => {
                    var childItem = parentItem[child];
                    const form_childIndex = Form?.[form_parentIndex]?.data?.findIndex((i: any) => i.id === child);

                    let formPath = Form?.[form_parentIndex]?.data?.[form_childIndex];
                    if (!!formPath) {
                        let { type, value, validate, required, error } = formPath || {}, specValue = '';
                        if (typeof(childItem) === 'string') {
                            specValue = childItem?.split(' • ')?.[1];
                            childItem = childItem?.split(' • ')?.[0];
                        }
                        if (type === 'date') {
                            let y = extractDate(childItem, 'year'), m = extractDate(childItem, 'month'), d = extractDate(childItem, 'date');
                            Form[form_parentIndex].data[form_childIndex].value[gIndex('year', value)] = {
                                id: 'year',
                                value: y,
                                isValid: !!y,
                            };
                            Form[form_parentIndex].data[form_childIndex].value[gIndex('month', value)] = {
                                id: 'month',
                                value: m,
                                isValid: !!m,
                            };
                            Form[form_parentIndex].data[form_childIndex].value[gIndex('day', value)] = {
                                id: 'day',
                                value: d,
                                isValid: !!d,
                            };
                        }
                        else if (type === 'option') {
                            childItem?.forEach((grandchildItem: any, index: number) => {
                                const form_grandchildIndex = Form?.[form_parentIndex]?.data?.[form_childIndex]?.items?.findIndex((i: any) => i.value === grandchildItem?.value);
                                Form[form_parentIndex].data[form_childIndex].items[form_grandchildIndex].selected = true;
                                const specification = grandchildItem.specification;
                                if (specification) {
                                    let formPath = Form?.[form_parentIndex]?.data?.[form_childIndex]?.items?.[form_grandchildIndex]?.specification;
                                    if (!!formPath) {
                                        let { type, value, validate, required, error } = formPath || {};
                                        if (type === 'date') {
                                            let y = extractDate(specification, 'year'), m = extractDate(specification, 'month'), d = extractDate(specification, 'date');
                                            Form[form_parentIndex].data[form_childIndex].items[form_grandchildIndex].specification.value[gIndex('year', value)] = {
                                                id: 'year',
                                                value: y,
                                                isValid: !!y,
                                            };
                                            Form[form_parentIndex].data[form_childIndex].items[form_grandchildIndex].specification.value[gIndex('month', value)] = {
                                                id: 'month',
                                                value: m,
                                                isValid: !!m,
                                            };
                                            Form[form_parentIndex].data[form_childIndex].items[form_grandchildIndex].specification.value[gIndex('day', value)] = {
                                                id: 'day',
                                                value: d,
                                                isValid: !!d,
                                            };
                                        }
                                        else if (typeof(specification) === 'object') {
                                            Object.keys(specification)?.forEach((ggrandchild, index) => {
                                                const ggrandchildItem = specification[ggrandchild];
                                                const form_ggrandchildIndex = Form?.[form_parentIndex]?.data?.[form_childIndex]?.items?.[form_grandchildIndex]?.specification?.value?.findIndex((i: any) => i.id === ggrandchild);
                                                Form[form_parentIndex].data[form_childIndex].items[form_grandchildIndex].specification.value[form_ggrandchildIndex].value = ggrandchildItem;
                                            });
                                        }
                                        else {
                                            let isValid = validate ? validate(specification) : validateText(specification);
                                            Form[form_parentIndex].data[form_childIndex].items[form_grandchildIndex].specification = {
                                                ...formPath,
                                                value: specification,
                                                isValid,
                                                error: required
                                                    ? isValid
                                                        ? ''
                                                        : (error || 'Please enter a valid value')
                                                    : ''
                                            };
                                        }
                                    }
                                }
                            });
                        }
                        else if (typeof(childItem) === 'object') {
                            Object.keys(childItem)?.forEach((grandchild, index) => {
                                const grandchildItem = childItem[grandchild];
                                const form_grandchildIndex = Form?.[form_parentIndex]?.data?.[form_childIndex]?.value?.findIndex((i: any) => i.id === grandchild);
                                Form[form_parentIndex].data[form_childIndex].value[form_grandchildIndex].value = grandchildItem;
                            });
                        }
                        else {
                            let isValid = validate ? validate(childItem) : validateText(childItem);
                            Form[form_parentIndex].data[form_childIndex] = {
                                ...formPath,
                                value: childItem,
                                isValid,
                                error: required
                                    ? isValid
                                        ? ''
                                        : (error || 'Please enter a valid value')
                                    : ''
                            };
                        }

                        var item = {};
                        const itemIndex = formPath?.items?.findIndex((i: any) => i.value === childItem);
                        if (itemIndex > -1) {
                            item = formPath?.items[itemIndex];
                            if (item?.addSection) Form.splice(form_parentIndex + 1, 0, item?.section);
                        }

                        const hasSpecification = (formPath?.hasSpecification || item?.hasSpecification) && type !== 'option';
                        const baseSpecification = item?.specification ? item : formPath;
                        if (hasSpecification) {
                            let _specify = baseSpecification?.specification || {
                                id: `for-${formPath?.id}`,
                                label: baseSpecification?.specificationLabel || 'Please specify',
                                placeholder: baseSpecification?.specificationLabel || 'Please specify',
                                value: specValue,
                                hasValidation: true,
                                required: true,
                                isValid: false,
                                error: '',
                                errorResponse: `Please enter a valid ${(baseSpecification?.specificationLabel || 'specification')?.toLowerCase()}`,
                                validate: baseSpecification?.validate || validateText,
                                keyboardType: baseSpecification?.keyboardType || 'default',
                                specification: true,
                            };
                            Form[form_parentIndex].data[form_childIndex] = {...Form[form_parentIndex].data[form_childIndex], hasSpecification: true};
                            Form[form_parentIndex].data?.splice(form_childIndex + 1, 0, _specify);
                        }
                        // if (childItem === 'ML') Form[form_parentIndex].data?.splice(form_childIndex + (hasSpecification ? 2 : 1), 0, _specifyML);

                    }
                });
            }

        }
    });
    const fillDocu = (type: string) => {
        const docuId = Form?.findIndex((i: any) => i.id === type);
        if (docuId > -1) {
            const noId = Form?.[docuId]?.data?.findIndex((i: any) => i.id === `${type}Number`);
            const expiryId = Form?.[docuId]?.data?.findIndex((i: any) => i.id === 'dateOfExpiry');
            const { documentNumber, validUntil } = savedApplication;
            if (noId > -1 && !!documentNumber) {
                Form[docuId].data[noId] = {
                    ...Form[docuId].data[noId],
                    value: documentNumber,
                    isValid: true,
                };
            }
            if (expiryId > -1 && !!validUntil) {
                let y = extractDate(validUntil, 'year'), m = extractDate(validUntil, 'month'), d = extractDate(validUntil, 'date');
                let val = Form[docuId].data[expiryId].value;
                Form[docuId].data[expiryId].value[gIndex('year', val)] = {
                    id: 'year',
                    value: y,
                    isValid: !!y,
                };
                Form[docuId].data[expiryId].value[gIndex('month', val)] = {
                    id: 'month',
                    value: m,
                    isValid: !!m,
                };
                Form[docuId].data[expiryId].value[gIndex('day', val)] = {
                    id: 'day',
                    value: d,
                    isValid: !!d,
                };
            }
        }
    };
    if (savedApplication?.renew?.applicationType?.label?.toLowerCase()?.match('renew')) {
        fillDocu('certificate');
        fillDocu('license');
        fillDocu('permit');
        fillDocu('accreditation');
        fillDocu('document');
    }
    return Form;
};
export {
    getInitial,
    getChannelName,
    getChannelImage,
    getTimeString,
    getChatTimeString,
    chatSameDate,
    checkSeen,
    getOtherParticipants,
    getDateTimeString,
    getTimerString,
    getDayMonthString,
    getColorFromName,
}
