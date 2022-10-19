import React, { useState, useEffect, useMemo } from 'react';
import {NTCServices as NTCServicesList } from '@utils/ntc';
import {validateNumber, validateText} from "../../../utils/form-validations";
import {generateForm, JSONfn} from "../../../utils/formatting";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {fetchCities, fetchProvinces, fetchRegions, fetchSchedules} from "../../../reducers/application/actions";
import ServicesForm from "@pages/form/ServicesForm";
import NTCServicesConfig from 'src/ntc-services-config';
import moment from "moment";
import {BackHandler, View} from "react-native";
import NTCAlert from '@atoms/alert';
const ServiceFormPage = () =>{
    const [origAdd, setOrigAdd] = useState({});
    const currentYear = moment()?.get('year')?.toString();
    const applicationItem = useSelector((state: RootStateOrAny) => {
        let _applicationItem = state.application?.applicationItem
        /*if( _applicationItem.applicant.address.region){
            _applicationItem.applicant.address.region = _applicationItem.region
        }*/
        return _applicationItem
    });
    const provinces = useSelector((state: RootStateOrAny) => state.application?.provinces);
    const fetchingProvinces = useSelector((state: RootStateOrAny) => state.application?.fetchingProvinces);
    const cities = useSelector((state: RootStateOrAny) => state.application?.cities);
    const fetchingCities = useSelector((state: RootStateOrAny) => state.application?.fetchingCities);

    const [service, setService] = useState( applicationItem?.service);
    const [applicationItemType, setApplicationType] = useState(applicationItem?.service?.applicationType || {});
    const [renew, setRenew] = useState({});
    const formCode = applicationItem?.service?.applicationType?.formCode
    let applicant = {
        "address": {
            "barangay": "",
            "city": "",
            "province": "",
            "region": "",
            "street": "",
            "unit": "",
            "zipCode": "",
        },
        "applicantName": "",
        "companyName": "",
        "contact": {
            "contactNumber": "",
            "email": "",
        },
        "contactNumber": "",
        "dateOfBirth": "",
        "education": {
            "courseTaken": "",
            "schoolAttended": "",
            "yearGraduated": "",
        },
        "email": "",
        "firstName": "",
        "height": 0,
        "lastName": "",
        "middleName": "",
        "nationality": "",
        "sex": "",
        "suffix": "",
        "weight": 0,
    };
    let applicantFn = (_a: any) => {
        Object.keys(_a).forEach((k) =>
            (!_a[k] || k === '_id' || k === 'userId' || k === 'contactNumber' || k === 'email') && delete _a[k]);
        return _a;
    };
    const _applicantItem = applicantFn(applicationItem.applicant)
    const user = {
        ..._applicantItem,
        applicant: {
            ...applicant,
            ..._applicantItem,
        }
    };

    const newForm = JSONfn.parse(JSONfn.stringify(NTCServicesConfig({formCode, user})));
    const dispatch = useDispatch();
    let generatedForm = JSONfn.parse(JSONfn.stringify(generateForm(applicationItem, newForm)));
    const AT = !!applicationItem?.renew?.applicationType ? applicationItem?.renew?.applicationType : (applicationItem?.service?.applicationType || {});

    const [region, setRegion] = useState({});
    const [schedule, setSchedule] = useState({});
    const editApplication = true;
    const renewApplication =true;
    const FOR_EDITING = editApplication || renewApplication;
    const [backPressed, setBackPressed] = useState(false);



    useEffect(() => {
        console.log(applicationItem?.region)
        if (!!applicationItem?.region) {
            let r = {regionCode: applicationItem.region};
            console.log(r)
            if (service?.serviceCode === 'service-1') dispatch(fetchSchedules(r));

            dispatch(fetchProvinces(r));

            if (!AT.element) AT.element = applicationItem?.service?.applicationType?.element;
            handleChangeApplicationType(AT);
        }
    }, [region]);
    const handleChangeApplicationType = (value: any) => {
        let { serviceCode, formCode, label, modificationDueTos } = value;
        let newForm = JSONfn.parse(JSONfn.stringify(NTCServicesConfig({formCode, user})));
        let isModify = label?.toLowerCase()?.match('modification') || label?.toLowerCase()?.match('modify');
        let isRenewal = label?.toLowerCase()?.match('renewal') || label?.toLowerCase()?.match('renew');
        let isNew = label?.toLowerCase()?.match('new') && !isRenewal;

        let insert = (
            id: string = '',
            title: string = '',
            alternativeTitle: string = '',
            data: any = [],
            type = '',
        ) => {
            let applicationTypeIndex = newForm?.findIndex((f: any) => f?.id === id);
            if (applicationTypeIndex > -1) newForm[applicationTypeIndex].data?.splice(0, 0, data[0]);
            else {
                let toInsert = {
                    id,
                    title,
                    alternativeTitle,
                    data,
                };
                if (type === 'list') {
                    toInsert = {
                        ...toInsert,
                        type,
                        template: data?.[0] || {},
                    };
                }
                newForm.splice(0, 0, toInsert);
            }
        };

        let cert = formCode === 'ntc1-ctc-certificate' || formCode === 'ntc1-21-certificate';
        let lice = formCode === 'ntc1-ctc-license' || formCode === 'ntc1-21-license';
        let perm = formCode === 'ntc1-ctc-permit' || formCode === 'ntc1-21-permit';
        if (cert || lice || perm) {
            let items = getNTCServices({
                kind: 'service',
                key: cert ? 'certificates' : lice ? 'licenses' : perm ? 'permits' : '',
            });
            insert(
                'details',
                'Details',
                'Details',
                [{
                    type: 'dropdown',
                    items: [],
                    id: 'type',
                    label: 'Type',
                    placeholder: 'Type',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please select a type',
                }]
            );
            insert(
                'details',
                'Details',
                'Details',
                [{
                    type: 'dropdown',
                    items,
                    id: 'service',
                    label: 'Service',
                    placeholder: 'Service',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please select a servicer',
                    hasDependent: true,
                }]
            );
        }

        if (isRenewal || isModify) {
            let _sname = service?.name?.toLowerCase();
            let _kind = _sname?.match('certificate')
                ? 'Certificate'
                : _sname?.match('license')
                    ? 'License'
                    : _sname?.match('permit')
                        ? 'Permit'
                        : _sname?.match('accreditation')
                            ? 'Accreditation'
                            : 'Document';
            let _key = _kind?.toLowerCase();
            insert(
                _key,
                _kind,
                _kind,
                [{
                    type: 'date',
                    id: 'dateOfExpiry',
                    label: 'Date of Expiry',
                    value: [
                        {
                            id: 'year',
                            value: currentYear,
                            isValid: true,
                        },
                        {
                            id: 'month',
                            value: '',
                            isValid: false,
                        },
                        {
                            id: 'day',
                            value: '',
                            isValid: false,
                        },
                    ],
                    required: true,
                }]
            );
            insert(
                _key,
                _kind,
                _kind,
                [{
                    id: `${_key}Number`,
                    label: `${_kind} No.`,
                    placeholder: `${_kind} No.`,
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: `Please enter ${_key} no.`,
                }]
            );
        }

        if (formCode === 'ntc1-19') {
            // insert(
            //   'applicationDetails',
            //   value?.label,
            //   'Details',
            //   [
            //     [
            //       {
            //         type: 'dropdown',
            //         items: [
            //           {label: 'Wireless Data Network (WDN) Devices - Indoor', value: 'Wireless Data Network (WDN) Devices - Indoor'},
            //           {label: 'Short Range Devices (SRD)', value: 'Short Range Devices (SRD)'},
            //           {
            //             label: 'Radio Frequency Identification (RFID) Devices',
            //             value: 'Radio Frequency Identification (RFID) Devices',
            //             hasSpecification: true,
            //             specification: {
            //               type: 'dropdown',
            //               items: [
            //                 {label: 'Low Power', value: 'Low Power'},
            //                 {label: 'High Power', value: 'High Power'}
            //               ],
            //               id: 'for-typeOfEquipmentDevice',
            //               label: 'Power',
            //               placeholder: 'Power',
            //               value: '',
            //               hasValidation: true,
            //               required: true,
            //               isValid: false,
            //               error: '',
            //               errorResponse: 'Please select power',
            //               specification: true,
            //             }
            //           },
            //           {label: 'Short Range Radio Service (SRRS) Devices', value: 'Short Range Radio Service (SRRS) Devices'},
            //           {label: 'Public Trunked Radio Equipment (Mobile/Portable)', value: 'Public Trunked Radio Equipment (Mobile/Portable)'},
            //         ],
            //         id: 'typeOfEquipmentDevice',
            //         label: 'Type of Equipment/Device',
            //         placeholder: 'Type of Equipment/Device',
            //         value: '',
            //         hasValidation: true,
            //         required: false,
            //         isValid: true,
            //         error: '',
            //         errorResponse: 'Please select type of equipment/device',
            //       },
            //     ]
            //   ],
            //   'list',
            // );
            // if (
            //   label?.toLowerCase()?.match('dealer') &&
            //   !label?.toLowerCase()?.match('non-dealer')
            // ) {
            //   insert(
            //     'credentials',
            //     'Credentials',
            //     'Credentials',
            //     [{
            //       id: 'cpcnPaRslNumber',
            //       label: 'CPCN/PA/RSL No.',
            //       placeholder: 'CPCN/PA/RSL No.',
            //       value: '',
            //       hasValidation: true,
            //       required: true,
            //       isValid: false,
            //       error: '',
            //       errorResponse: 'Please enter CPCN/PA/RSL no.',
            //     }]
            //   );
            // }
            /*else*/ if (label?.toLowerCase()?.match('non-dealer')) {
                insert(
                    'credentials',
                    'Credentials',
                    'Credentials',
                    [{
                        id: 'invoiceNumber',
                        label: 'Invoice No.',
                        placeholder: 'Invoice No.',
                        value: '',
                        hasValidation: true,
                        required: true,
                        isValid: false,
                        error: '',
                        errorResponse: 'Please enter invoice no.',
                    }]
                );
            }
        }

        if (
            formCode === 'ntc1-18' &&
            serviceCode === 'CPE'
        ) {
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    type: 'dropdown',
                    items: [
                        {
                            value: 'Mobile',
                            label: 'Mobile',
                        },
                        {
                            value: 'Non-Mobile',
                            label: 'Non-Mobile',
                        },
                    ],
                    id: 'variation',
                    label: 'Variation',
                    placeholder: 'Variation',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please select variation',
                }]
            );
        }

        if (
            formCode === 'ntc1-18' &&
            applicationItem?.serviceCode === 'service-14' &&
            label?.toLowerCase()?.match('dealer')
        ) {
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    type: 'dropdown',
                    items: [
                        {
                            value: 'Radio Transmitter/Transceiver',
                            label: 'Radio Transmitter/Transceiver',
                        },
                        {
                            value: 'WDN Indoor/SRD/RFID',
                            label: 'WDN Indoor/SRD/RFID',
                        },
                    ],
                    id: 'type',
                    label: 'Type',
                    placeholder: 'Type',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please select type',
                }]
            );
        }

        if (
            formCode === 'ntc1-18' &&
            service?.serviceCode === 'service-15' &&
            label?.toLowerCase()?.match('dealer')
        ) {
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    type: 'dropdown',
                    items: [
                        {
                            value: 'Main',
                            label: 'Main',
                        },
                        {
                            value: 'Branch',
                            label: 'Branch',
                        },
                    ],
                    id: 'variation',
                    label: 'Variation',
                    placeholder: 'Variation',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please select variation',
                }]
            );
        }

        if (formCode === 'ntc1-16') {
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    id: 'placeOfOrigin',
                    label: 'Place of Origin',
                    placeholder: 'Place of Origin',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please select place of origin',
                }]
            );
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    id: 'destination',
                    label: 'Destination',
                    placeholder: 'Destination',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please enter destination',
                }]
            );
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    id: 'purpose',
                    label: 'Purpose',
                    placeholder: 'Purpose',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please enter purpose',
                }]
            );
        }

        if (
            label?.toLowerCase()?.match('call sign') &&
            formCode?.match('ntc1-03')
        ) {
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    id: 'preferredCallSign',
                    label: 'Preferred Call Sign/s',
                    placeholder: 'Preferred Call Sign/s',
                    value: '',
                    hasValidation: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please enter preferred call sign',
                }]
            );
        }

        if (
            label?.toLowerCase()?.match('club')
        ) {
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    id: 'clubTrusteeName',
                    label: 'Name of Club Trustee',
                    placeholder: 'Name of Club Trustee',
                    value: user?.applicantName || '',
                    hasValidation: true,
                    required: true,
                    isValid: !!user?.applicantName,
                    error: '',
                    errorResponse: 'Please enter name of club',
                }]
            );
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    id: 'clubName',
                    label: 'Name of Club',
                    placeholder: 'Name of Club',
                    value: user?.applicant?.companyName || '',
                    hasValidation: true,
                    required: true,
                    isValid: !!user?.applicant?.companyName,
                    error: '',
                    errorResponse: 'Please enter name of club',
                }]
            );
        }

        if (isModify) {
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [{
                    type: 'dropdown',
                    items: modificationDueTos || [],
                    id: 'modificationDueTo',
                    label: 'Modification due to',
                    placeholder: 'Modification due to',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please select modification reason',
                }]
            );
        }

        if (
            (
                formCode?.match('ntc1-02') ||
                formCode?.match('ntc1-03') ||
                formCode?.match('ntc1-04') ||
                formCode?.match('ntc1-11') ||
                formCode?.match('ntc1-18') ||
                formCode?.match('ntc1-20') ||
                formCode?.match('ntc1-22')
            ) &&
            !isModify
        ) {
            let _items = [{label: '1', value: '1'}];
            if (serviceCode?.toLowerCase()?.match('rlm')) {
                _items = [
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'}
                ];
            }
            else if (serviceCode?.toLowerCase()?.match('purchase')) {
                _items = [{label: '60 days', value: '60 days'}];
            }
            else if (isRenewal) {
                _items?.push({label: '2', value: '2'});
                _items?.push({label: '3', value: '3'});
            }
            insert(
                'applicationDetails',
                value?.label,
                'Details',
                [
                    {
                        type: 'dropdown',
                        items: _items,
                        id: 'noOfYears',
                        label: 'No. of years',
                        placeholder: 'No. of years',
                        value: '',
                        hasValidation: true,
                        required: true,
                        isValid: false,
                        error: '',
                        errorResponse: 'Please select no. of years',
                        validate: validateNumber,
                    },
                ]
            );
        }

        if (isNew) {
            /**not dynamic, for callSign only */

            let newCallSign = {
                value: 'To be assigned by NTC',
                editable: false,
                required: false,
            };

            let callSignIndex = newForm?.findIndex(s => s?.id === 'callSign');
            if (callSignIndex > -1) {
                let _callSignIndex = newForm[callSignIndex]?.data?.findIndex(s => s?.id === 'callSign');
                if (_callSignIndex > -1) {
                    newForm[callSignIndex].data[_callSignIndex] = {
                        ...newForm?.[callSignIndex]?.data?.[_callSignIndex],
                        ...newCallSign,
                    };
                }
            };

            let particularsIndex = newForm?.findIndex(s => s?.id === 'particulars');
            if (particularsIndex > -1) {
                let equipmentsIndex = newForm?.[particularsIndex]?.template?.findIndex(s => s?.id === 'equipments' || s?.id === 'proposedEquipments');
                if (equipmentsIndex > -1) {
                    let _callSignIndex = newForm?.[particularsIndex]?.template?.[equipmentsIndex]?.template?.findIndex(s => s?.id === 'callSign');
                    if (_callSignIndex > -1) {
                        let oldCallSign = JSONfn.parse(JSONfn.stringify(newForm?.[particularsIndex]?.template?.[equipmentsIndex]?.template?.[_callSignIndex]));
                        let newCSObj = {...oldCallSign, ...newCallSign};
                        if (newForm?.[particularsIndex]?.template?.[equipmentsIndex]?.template?.[_callSignIndex]) newForm[particularsIndex].template[equipmentsIndex].template[_callSignIndex] = newCSObj;
                        if (newForm?.[particularsIndex]?.template?.[equipmentsIndex]?.data?.[0]?.[_callSignIndex]) newForm[particularsIndex].template[equipmentsIndex].data[0][_callSignIndex] = newCSObj;
                        if (newForm?.[particularsIndex]?.data?.[0]?.[equipmentsIndex]?.template?.[_callSignIndex]) newForm[particularsIndex].data[0][equipmentsIndex].template[_callSignIndex] = newCSObj;
                        if (newForm?.[particularsIndex]?.data?.[0]?.[equipmentsIndex]?.data?.[0]?.[_callSignIndex]) newForm[particularsIndex].data[0][equipmentsIndex].data[0][_callSignIndex] = newCSObj;
                    }
                }
            }
        }

        setApplicationType(value);
        setForm(newForm);

        let __add = newForm?.findIndex(f => f?.id === 'address');
        if (__add > -1) setOrigAdd(newForm[__add]);

        /**for service renewal */
        if (isNew || isModify) {
            let renewLabel = label?.replace(`(${isNew ? 'NEW' : 'MODIFICATION'})`, '(RENEWAL)');
            let renewAT = service?.applicationTypes?.find((i: any) => i.label === renewLabel);
            if (renewAT) setRenew({...renew, applicationType: renewAT});
        }
        if (renewApplication) setRenew({...renew, renewedFrom: applicationItem?._id});

    };
    const [form, setForm] = useState(generatedForm);
    const [formFilledIn, setFormFilledIn] = useState(false);
    const [useDifferentAddress, setUseDifferentAddress] = useState(false);
    const [alternateRequirements, setAlternateRequirements] = useState([]);
    const onUseDifferentAddress = () => setUseDifferentAddress(!useDifferentAddress);




    const getNTCServices = ({
                                kind = '', // 'service' or 'type'
                                key = '', // module
                                name = '', // service
                            }) => {
        let _module = NTCServicesList?.find(mod => { return mod?.key === key; });
        if (kind === 'service') {
            let _serviceItems = [];
            _module?.data?.forEach((service: any) => {
                if (service?.serviceCode !== 'service-21') { // ctc
                    _serviceItems?.push({
                        label: service?.name,
                        value: service?.name,
                    });
                }
            });
            return _serviceItems;
        }
        else if (kind === 'type') {
            let _service = _module?.data?.find(ser => ser?.name === name);
            let _typeItems = [];
            _service?.applicationTypes?.forEach(type => {
                _typeItems?.push({
                    label: type?.label,
                    value: type?.label,
                });
            });
            return _typeItems;
        }
    };

    const onFormUpdate = ({
                              parentId, // main parent ex.basic-info
                              id, // child id ex.firstName, lastName
                              subId, // grandchild id ex.year,month,date (for fields like date with sub-data)
                              value, // could be string (textinput), object (type:dropdown, value.value), array (type:date, value.$.id:year,month,date)
                              type, // field type ex.dropdown,date
                              validate,
                              errorResponse,
                              index, // for type list only
                              hasDependent,
                              option, // if field is a specification of an item in options
                              subParentId, // for options field; parent
                              subIndex, // for options field; parent
                              setParentId, // set that has a set
                              setIndex, // index of the set (inside the set)
                              required,
                              keyboardType,
                          }: any) => {
        if (value?.requirements) setAlternateRequirements(value?.requirements);

        if (keyboardType === 'decimal-pad') {
            if (value.match(/\./g)) {
                let [, decimal] = value.split('.');
                if (decimal?.length > 2) return; // restrict value to only 2 decimal places
            }
        }

        let hasSpecification = value?.hasSpecification && type !== 'option';
        let specificationValidate = value?.validate;
        let specificationKT = value?.keyboardType;
        let { specification, specificationLabel, addSection, section } = value || {};

        let parentIndex = form?.findIndex((p: any) => p?.id === parentId);

        if (parentIndex > -1) {
            let isParentList = form?.[parentIndex]?.type === 'list'; // for sections with multiple (array) values

            let childIndex = isParentList
                ? form?.[parentIndex]?.data?.[index]?.findIndex((c: any) => c?.id === (subParentId || (setParentId || id)))
                : form?.[parentIndex]?.data?.findIndex((c: any) => c?.id === (subParentId || id));

            if (childIndex > -1) {
                let newForm = JSONfn.parse(JSONfn.stringify(form));
                let preservedValue = value?.value

                if (
                    typeof(value) === 'object' &&
                    type !== 'time' &&
                    !!value
                ) {
                    value =
                        id === 'region' ||
                        id === 'province' ||
                        id === 'city' ||
                        id === 'barangay'
                            ? value?.label
                            : value?.value;
                    if (typeof(value) === 'object') value = value?.value;
                }

                let isValid = type === 'time' ? true : (!required && !value) ? true : !!validate ? validate(value) : validateText(value);

                let _typeItems = [];
                let isFieldService = id === 'service' && hasDependent;
                if (isFieldService) {
                    let _lVal = value?.toLowerCase();
                    let _key = _lVal?.match('certificate')
                        ? 'certificates'
                        : _lVal?.match('license')
                            ? 'licenses'
                            : _lVal?.match('permit')
                                ? 'permits'
                                : '';
                    _typeItems = getNTCServices({
                        kind: 'type',
                        key: _key,
                        name: value,
                    });
                }

                if (!!subId) { // add set conditions here

                    let grandchildIndex = isParentList
                        ? newForm?.[parentIndex]?.data?.[index]?.[childIndex]?.value?.findIndex((gc: any) => gc?.id === subId)
                        : newForm?.[parentIndex]?.data?.[childIndex]?.value?.findIndex((gc: any) => gc?.id === subId);

                    if (grandchildIndex > -1) {

                        if (type === 'date') {
                            let getFigure = (d: any) => (`0${d}`).slice(subId === 'year' ? -4 : -2);
                            value = getFigure(value);
                        }

                        // any updates here should also reflect below (else)
                        if (isParentList) {
                            let __obj = newForm[parentIndex].data[index][childIndex].value[grandchildIndex];
                            if (type === 'option') {
                                let _ndx = __obj?.items?.findIndex((i: any) => i?.value === value);
                                if (_ndx > -1) __obj.items[_ndx].selected = !__obj?.items[_ndx].selected;
                            }
                            if (option && subIndex) {
                                __obj.items[subIndex][`${id}`] = {
                                    ...__obj.items[subIndex][`${id}`],
                                    value,
                                    isValid,
                                    error: isValid ? '' : errorResponse,
                                };
                            }
                            newForm[parentIndex].data[index][childIndex].value[grandchildIndex] = {
                                ...__obj,
                                value,
                                isValid,
                                error: isValid ? '' : errorResponse,
                            };
                            if (isFieldService) {
                                newForm[parentIndex].data[index][childIndex].value[grandchildIndex + 1] = {
                                    ...newForm[parentIndex].data[index][childIndex].value[grandchildIndex + 1],
                                    items: _typeItems,
                                    value: '',
                                };
                            }
                        }
                        else {
                            let __obj = newForm[parentIndex].data[childIndex].value[grandchildIndex];
                            if (type === 'option') {
                                let _ndx = __obj?.items?.findIndex((i: any) => i?.value === value);
                                if (_ndx > -1) __obj.items[_ndx].selected = !__obj?.items[_ndx].selected;
                            }
                            if (option && subIndex) {
                                __obj.items[subIndex][`${id}`] = {
                                    ...__obj.items[subIndex][`${id}`],
                                    value,
                                    isValid,
                                    error: isValid ? '' : errorResponse,
                                };
                            }
                            newForm[parentIndex].data[childIndex].value[grandchildIndex] = {
                                ...__obj,
                                value,
                                isValid,
                                error: isValid ? '' : errorResponse,
                            }
                            if (isFieldService) {
                                newForm[parentIndex].data[childIndex].value[grandchildIndex + 1] = {
                                    ...newForm[parentIndex].data[childIndex].value[grandchildIndex + 1],
                                    items: _typeItems,
                                    value: '',
                                };
                            }
                        }

                    }

                }
                else {

                    // else here; any updates here should also reflect above
                    if (isParentList) {
                        let _mother = [...newForm[parentIndex].data[index]];
                        let _child = {..._mother[childIndex]};
                        if (!!setParentId) { // if set has a set
                            let _setParentIndex = _mother?.findIndex(d => d?.id === setParentId);
                            if (_setParentIndex > -1) {
                                let _set = setIndex > -1 // if set is multiple
                                    ? _mother?.[_setParentIndex]?.data?.[setIndex]
                                    : _mother?.[_setParentIndex]?.data;
                                let _childSetIndex = _set?.findIndex(c => c?.id === id);
                                if (_childSetIndex > -1) { // whatever changes here, should also reflect below (on else (if not !!setParentId))
                                    let _child = _set[_childSetIndex];
                                    if (type === 'option') {
                                        let _ndx = _child?.items?.findIndex((i: any) => i?.value === value);
                                        if (_ndx > -1) _child.items[_ndx].selected = !_child?.items[_ndx].selected;
                                    }
                                    if (option && subIndex) {
                                        _child.items[subIndex][`${id}`] = {
                                            ..._child.items[subIndex][`${id}`],
                                            value,
                                            isValid,
                                            error: isValid ? '' : errorResponse,
                                        };
                                    }
                                    _child = {
                                        ..._child,
                                        value,
                                        isValid,
                                        error: isValid ? '' : errorResponse,
                                        hasSpecification,
                                    };
                                    _set[_childSetIndex] = _child;
                                    if (isFieldService) {
                                        _set[_childSetIndex + 1] = {
                                            ..._set[_childSetIndex + 1],
                                            items: _typeItems,
                                            value: '',
                                        };
                                    }
                                    if (setIndex > -1) _mother[_setParentIndex].data[setIndex] = _set;
                                    else _mother[_setParentIndex].data = _set;
                                }
                            }
                        }
                        else { // reflect changes here (if not !!setParentId)
                            if (type === 'option') {
                                let _ndx = _child?.items?.findIndex((i: any) => i?.value === value);
                                if (_ndx > -1) _child.items[_ndx].selected = !_child?.items[_ndx].selected;
                            }
                            if (option && subIndex) {
                                _child.items[subIndex][`${id}`] = {
                                    ..._child.items[subIndex][`${id}`],
                                    value,
                                    isValid,
                                    error: isValid ? '' : errorResponse,
                                };
                            }
                            _child = {
                                ..._child,
                                value,
                                isValid,
                                error: isValid ? '' : errorResponse,
                                hasSpecification,
                            };
                            _mother[childIndex] = _child;
                            if (isFieldService) {
                                _mother[childIndex + 1] = {
                                    ..._mother[childIndex + 1],
                                    items: _typeItems,
                                    value: '',
                                };
                            }
                        }
                        newForm[parentIndex].data[index] = _mother;
                    }
                    else {
                        let __obj = newForm[parentIndex].data[childIndex];
                        if (type === 'option') {
                            let _ndx = __obj?.items?.findIndex((i: any) => i?.value === value);
                            if (_ndx > -1) __obj.items[_ndx].selected = !__obj?.items[_ndx].selected;
                        }
                        if (option && subIndex) {
                            __obj.items[subIndex][`${id}`] = {
                                ...__obj.items[subIndex][`${id}`],
                                value,
                                isValid,
                                error: isValid ? '' : errorResponse,
                            };
                        }
                        newForm[parentIndex].data[childIndex] = {
                            ...__obj,
                            value,
                            isValid,
                            error: isValid ? '' : errorResponse,
                            hasSpecification,
                        };
                        if (isFieldService) {
                            newForm[parentIndex].data[childIndex + 1] = {
                                ...newForm[parentIndex].data[childIndex + 1],
                                items: _typeItems,
                                value: '',
                            };
                        }
                    }

                }

                /** if has specification */
                /** example is selecting 'Others' from dropdown and you need to specify something thru a textinput */
                let forID = `for-${id}`;
                let forTextInput = (isParentList ? newForm[parentIndex].data[index] : newForm[parentIndex].data).findIndex((f: any) => f?.id === forID) > -1;
                let forVPN = (isParentList ? newForm[parentIndex].data[index] : newForm[parentIndex].data).findIndex((f: any) => f?.id === 'vehiclePlateNo') > -1;
                if (hasSpecification) { /** ANY CHANGES HERE SHOULD ALSO REFLECT TO src/utils/formatting; hasSpecification block */
                let _specify = specification || {
                        id: forID,
                        label: specificationLabel || 'Please specify',
                        placeholder: specificationLabel || 'Please specify',
                        value: '',
                        hasValidation: true,
                        required: true,
                        isValid: false,
                        error: '',
                        errorResponse: `Please enter a valid ${(specificationLabel || 'specification')?.toLowerCase()}`,
                        validate: specificationValidate || validateText,
                        keyboardType: specificationKT || 'default',
                        specification: true,
                    };
                    if (isParentList) {
                        if (!forTextInput) { /**no specification field yet */
                        newForm[parentIndex].data[index].splice(childIndex + 1, 0, _specify); /**regular adding of specification field */
                        }
                        else if (forTextInput) {
                            let __newForm = JSONfn.parse(JSONfn.stringify(newForm));
                            __newForm[parentIndex].data[index].splice(childIndex + 1, 1, _specify); /**regular replacing of specification field */
                            newForm = JSONfn.parse(JSONfn.stringify(__newForm));
                        }
                    }
                    else {
                        if (!forTextInput) { /**no specification field yet */
                        newForm[parentIndex].data.splice(childIndex + 1, 0, _specify); /**regular adding of VPN field */
                        }
                        else if (forTextInput) {
                            let __newForm = JSONfn.parse(JSONfn.stringify(newForm));
                            __newForm[parentIndex].data.splice(childIndex + 1, 1, _specify); /**regular replacing of VPN field */
                            newForm = JSONfn.parse(JSONfn.stringify(__newForm));
                        }
                    }
                }
                else if (
                    !hasSpecification &&
                    forTextInput
                ) {
                    if (isParentList) newForm[parentIndex].data[index].splice(childIndex + 1, 1);
                    else newForm[parentIndex].data.splice(childIndex + 1, 1);
                }

                /** specifically for ML stationclass only */
                let _specifyML = {
                    id: 'vehiclePlateNo',
                    label: 'Plate No.',
                    placeholder: 'Plate No.',
                    value: '',
                    hasValidation: true,
                    required: true,
                    isValid: false,
                    error: '',
                    errorResponse: 'Please enter plate no.',
                };
                let __i = hasSpecification ? 2 : 1;
                if (id === 'stationClass') {
                    if (isParentList) {
                        if (value === 'ML' && !forVPN) { /**ML is selected and there is no Vehicle Plate No. (VPN) field yet */
                        newForm[parentIndex].data[index].splice(childIndex + __i, 0, _specifyML); /**adding of VPN field  */
                        }
                        else if (value !== 'ML' && forVPN) { /**ML is not selected and there is a VPN field */
                        newForm[parentIndex].data[index].splice(childIndex + __i, 1); /**removing of VPN field */
                        }
                    }
                    else {
                        if (value === 'ML' && !forVPN) { /**ML is selected and there is no Vehicle Plate No. (VPN) field yet */
                        newForm[parentIndex].data.splice(childIndex + __i, 0, _specifyML); /**adding of VPN field  */
                        }
                        else if (value !== 'ML' && forVPN) { /**ML is not selected and there is a VPN field */
                        newForm[parentIndex].data.splice(childIndex + __i, 1); /**removing of VPN field */
                        }
                    }
                }

                let sectionId = `section-${id}`;
                let sectionTextInput = (isParentList ? newForm[parentIndex].data[index] : newForm[parentIndex].data).findIndex((f: any) => f?.id === sectionId) > -1;
                if (addSection && section) {
                    let _ndx = newForm?.findIndex(f => f?.id === section?.id);
                    let _del = _ndx > -1 ? 1 : 0;
                    section.sectionId = sectionId;
                    newForm?.splice(parentIndex + 1, _del, section);
                }
                else if (!addSection && sectionTextInput) {
                    if (isParentList) newForm[parentIndex].data[index].splice(childIndex + 1, 1);
                    else newForm[parentIndex].data.splice(childIndex + 1, 1);
                }
                if (id === 'region') {
                    dispatch(fetchProvinces({regionCode: preservedValue}));
                    onFormUpdate({
                        parentId, // main parent ex.basic-info
                        id: 'province', // child id ex.firstName, lastName
                        subId: '', // grandchild id ex.year,month,date (for fields like date with sub-data)
                        value: '', // could be string (textinput), object (type:dropdown, value.value), array (type:date, value.$.id:year,month,date)
                        type: 'dropdown', // field type ex.dropdown,date
                        validate,
                        errorResponse: 'Please select a province',
                        index: -1,
                    });
                    onFormUpdate({
                        parentId, // main parent ex.basic-info
                        id: 'city', // child id ex.firstName, lastName
                        subId: '', // grandchild id ex.year,month,date (for fields like date with sub-data)
                        value: '', // could be string (textinput), object (type:dropdown, value.value), array (type:date, value.$.id:year,month,date)
                        type: 'dropdown', // field type ex.dropdown,date
                        validate,
                        errorResponse: 'Please select a city',
                        index: -1,
                    });
                }
                else if (id === 'province') {
                    dispatch(fetchCities({provinceCode: preservedValue}));
                    onFormUpdate({
                        parentId, // main parent ex.basic-info
                        id: 'city', // child id ex.firstName, lastName
                        subId: '', // grandchild id ex.year,month,date (for fields like date with sub-data)
                        value: '', // could be string (textinput), object (type:dropdown, value.value), array (type:date, value.$.id:year,month,date)
                        type: 'dropdown', // field type ex.dropdown,date
                        validate,
                        errorResponse: 'Please select a city',
                        index: -1,
                    });
                }
                // else if (id === 'city') {
                //   dispatch(fetchBarangays({cityCode: preservedValue}));
                //   onFormUpdate({
                //     parentId, // main parent ex.basic-info
                //     id: 'barangay', // child id ex.firstName, lastName
                //     subId: '', // grandchild id ex.year,month,date (for fields like date with sub-data)
                //     value: '', // could be string (textinput), object (type:dropdown, value.value), array (type:date, value.$.id:year,month,date)
                //     type: 'dropdown', // field type ex.dropdown,date
                //     validate,
                //     errorResponse: 'Please select a barangay',
                //     index: -1,
                //   });
                // }

                setForm(newForm);
            }

        }

    };
    const _onAdd = ({
                        parentId, // main parent id from the form
                        template,
                        setParentId,
                        setParentIndex,
                    }: any) => {
        let _form = JSONfn.parse(JSONfn.stringify(form));
        let parentIndex = _form?.findIndex((f: any) => f?.id === parentId);
        if (parentIndex > -1) {
            if (setParentId) { // has a set
                let setIndex = _form[parentIndex]?.data?.[setParentIndex]?.findIndex((f: any) => f?.id === setParentId);
                if (setIndex > -1) _form[parentIndex]?.data?.[setParentIndex]?.[setIndex]?.data?.push(template);
            }
            else _form[parentIndex]?.data?.push(template);
            setForm(_form);
        }
    };
    const _onRemove = ({
                           parentId,
                           index,
                           setParentId,
                           setParentIndex,
                       }: any) => {
        let _form = [...form];
        let parentIndex = _form?.findIndex((f: any) => f?.id === parentId);
        if (parentIndex > -1) {
            if (setParentId) { // has a set
                let setIndex = _form[parentIndex]?.data?.[setParentIndex]?.findIndex((f: any) => f?.id === setParentId);
                if (setIndex > -1) _form[parentIndex]?.data?.[setParentIndex]?.[setIndex]?.data?.splice(index, 1);
            }
            else _form[parentIndex]?.data?.splice(index, 1);
            setForm(_form);
        }
    };
    const handleChangeElement = (value: any) => {
        setApplicationType({
            ...applicationType,
            element: value,
        });
    };

    const [udaAlert, setUDAAlert] = useState({
        title: 'Use Different Address',
        message: 'Using a different address will not affect the original.',
        active: false,
        alerted: false,
        onConfirm: () => {
            setUDAAlert({
                ...udaAlert,
                active: false,
                alerted: true,
            });
        }
    });

    const setItemsOnForm = (
        parentId: string,
        id: string,
        loading: boolean,
        items: any,
    ) => {
        let _form = JSONfn.parse(JSONfn.stringify(form));
        let parentIndex = _form?.findIndex((f: any) => f?.id === parentId);
        if (parentIndex > -1) {
            let childIndex = _form?.[parentIndex]?.data?.findIndex((f: any) => f?.id === id);
            if (childIndex > -1) {
                _form[parentIndex].data[childIndex].loading = loading;
                _form[parentIndex].data[childIndex].items = items;
                setForm(_form);
            }
        }
    };
    useEffect(() => {
       setItemsOnForm('address', 'province', fetchingProvinces, provinces);
    }, [provinces, /*applicationType,*/ fetchingProvinces]);
    useEffect(() => {
       setItemsOnForm('address', 'city', fetchingCities, cities);
    }, [cities, fetchingCities]);
    return <View style={{flex: 1}}>
        <NTCAlert
            alertContainerStyle={{zIndex: 999}}
            visible={udaAlert?.active}
            title={udaAlert?.title || 'Alert'}
            message={udaAlert?.message}
            confirmText='OK'
            onConfirm={udaAlert?.onConfirm}
        />

        <ServicesForm form={form} onChangeValue={onFormUpdate} onAdd={_onAdd} onRemove={_onRemove} onUseDifferentAddress={onUseDifferentAddress} useDifferentAddress={useDifferentAddress} />

    </View>

}


export default ServiceFormPage
