import React, { useState, useEffect, useMemo } from 'react';
import {NTCServices as NTCServicesList } from '../../../utils/ntc';
import {validateNumber, validateText} from "../../../utils/form-validations";
import {extractDate, generateForm, JSONfn} from "../../../utils/formatting";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {
    fetchCities,
    fetchProvinces,
    fetchRegions,
    fetchSchedules, fetchSOA, saveApplication, setApplicationItem, setReviewed, setSceneIndex,
    uploadRequirement
} from "../../../reducers/application/actions";
import ServicesForm from "@pages/form/ServicesForm";
import NTCServicesConfig from 'src/ntc-services-config';
import moment from "moment";
import {
    ActivityIndicator,
    BackHandler,
    Platform,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import NTCAlert from '@atoms/alert';
import {isMobile} from "@pages/activities/isMobile";
import Requirements from "@templates/application-steps/requirements";
import {TabBar, TabView} from "react-native-tab-view";
import Region from "@templates/application-steps/region";
import {regionList, transformToFeePayload} from "../../../utils/ntc";
import ApplicationSteps from "@templates/application-steps";
import {Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {infoColor} from "@styles/color";
import Types from "@templates/application-steps/types";
import Preview from "@templates/application-steps/preview";
import CustomAlert from "@pages/activities/alert/alert";
import {APPROVED} from "../../../reducers/activity/initialstate";
import _ from "lodash";

const ServiceFormPage = (props) =>{




    const onUpload = (file: any) => {
        let index = file?.index;
        if (index > -1) {
            let _requirements = [...requirements];
            let _files = _requirements?.[index]?.files || [];
            _files.push(file);
            _requirements[index].files = _files;
            onUploadFile(_requirements[index]);
        }
    };
    const [origAdd, setOrigAdd] = useState({});
    const currentYear = moment()?.get('year')?.toString();
    const applicationItem = useSelector((state: RootStateOrAny) => {
        let _applicationItem = state.application?.applicationItem
        /*if( _applicationItem.applicant.address.region){
            _applicationItem.applicant.address.region = _applicationItem.region
        }*/
        return _applicationItem
    });
    const cities = useSelector((state: RootStateOrAny) => state.application?.cities);
    const schedules = useSelector((state: RootStateOrAny) => state.application?.schedules);
    const provinces = useSelector((state: RootStateOrAny) => state.application?.provinces);
    const fetchingRegions = useSelector((state: RootStateOrAny) => state.application?.fetchingRegions);
    const savingApplication = useSelector((state: RootStateOrAny) => state.application?.savingApplication);
    const uploadingRequirement = useSelector((state: RootStateOrAny) => state.application?.uploadingRequirement);
    const fetchingSchedules = useSelector((state: RootStateOrAny) => state.application?.fetchingSchedules);
    const fetchingProvinces = useSelector((state: RootStateOrAny) => state.application?.fetchingProvinces);
    const fetchSOASuccess = useSelector((state: RootStateOrAny) => state.application?.fetchSOASuccess);
    const fetchingCities = useSelector((state: RootStateOrAny) => state.application?.fetchingCities);
    const fetchSOAError = useSelector((state: RootStateOrAny) => state.application?.fetchSOAError);
    const fetchingSOA = useSelector((state: RootStateOrAny) => state.application?.fetchingSOA);
    const reviewed = useSelector((state: RootStateOrAny) => state.application?.reviewed);
    const regions = useSelector((state: RootStateOrAny) => state.application?.regions);
    const soa = useSelector((state: RootStateOrAny) => state.application?.soa);

    const [service, setService] = useState( applicationItem?.service);
    const [applicationType, setApplicationType] = useState(applicationItem?.service?.applicationType || {});
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
        if(!_a) return
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
        if (
            FOR_EDITING &&
            schedules?.length > 0 &&
            Object.keys(!!applicationItem?.schedule ? applicationItem?.schedule : {}).length > 0
        ) {
            setSchedule({
                ...applicationItem?.schedule,
                region,
            });
        }
    }, [schedules]);

    useEffect(() => {
        if (!!applicationItem?.region) {

            let r = {regionCode:  applicationItem?.region?.code ? applicationItem?.region?.code :  applicationItem?.region};
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
    const requirements = alternateRequirements?.length > 0 ? alternateRequirements : (applicationType?.requirements || []);



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
    const onUploadFile = async(requirement:any)=>{
        let createFormData=async(payload:any)=>{
            const {key,files}=payload;
            const file=files?.[files?.length-1];
            const data=new FormData();

            let f:any={
                name:file?.name,
                type:file?.mimeType,
                uri:file?.uri,
            }
            if(isMobile){

                data.append('file',f);
                data.append('key',key);
                return data;
            }
            Platform.select({
                web:await fetch(f?.uri).then(res=>{
                    return res?.blob()
                }).then(blob=>{
                    var mime=f?.uri.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
                    var attachmentMime=mime[1]?.split('/')?.[1]
                    if(mime&&mime.length){
                        f=new File([blob],f?.name+(
                            attachmentMime.length<5 ? '.'+attachmentMime : ''));
                    }
                })
            })
            data.append('file',f);
            data.append('key',key);
            return data;
        };
        let formData=await createFormData(requirement);
        dispatch(uploadRequirement({
            formData,
            requirements,
        }));
    };
    const isUploading = () => {
        if (uploadingRequirement) return uploadingRequirement;
        let uploading = false;
        requirements.map((r: any) => {
            r?.files?.forEach((f: any) => {
                if (f?.uploading) {
                    uploading = true;
                    return;
                }
            });
        });
        return uploading;
    };
    const onRemove = (index: number, _index: number) => {
        if (index >= 0 && _index >= 0) {
            let _requirements = [...requirements];
            let _files = _requirements?.[index]?.files || [];
            _files.splice(_index, 1);
            _requirements[index].files = _files;
            setApplicationType({
                ...applicationType,
                requirements: _requirements,
            });
        }
    };
    const onBack = () => {
        setBackPressed(true);
        setBackPressed(false);
        return true;
    };

    useEffect(() => {
        dispatch(fetchRegions());
        let r = applicationItem?.region?.code ? applicationItem?.region?.code :  applicationItem?.region
         setRegion({code: r, ...(regionList?.filter(i => i?.value === r)?.[0] || {})});
        BackHandler.addEventListener('hardwareBackPress', onBack);
        return () => { BackHandler.removeEventListener('hardwareBackPress', onBack); };
    }, []);
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const routes = React.useMemo(() => [
        { key: 'region', title: 'Region' },
        { key: 'applicationType', title: 'Application Type' },
        { key: 'service', title: 'Service' },
        { key: 'requirement', title: 'Requirement' },
        { key: 'complete', title: 'Complete' },
    ], []);

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'region':
                return <Region
                    serviceCode={service?.serviceCode}
                    regions={regions}
                    region={region}
                    onPreSelect={() => dispatch(fetchRegions())}
                    onChangeRegion={(region: any) => {
                        setRegion(region);
                        if (service?.serviceCode === 'service-1') setSchedule({});
                    }}
                    schedule={schedule}
                    schedules={schedules}
                    fetchingSchedules={fetchingSchedules}
                    fetchingRegions={fetchingRegions}
                    onChangeSchedule={setSchedule}
                />
            case 'applicationType':
                return  <Types
                    types={service?.applicationTypes}
                    applicationType={applicationType}
                    onChangeValue={handleChangeApplicationType}
                    onSelect={handleChangeElement}
                />
            case 'service':
                return <ServicesForm form={form} onChangeValue={onFormUpdate} onAdd={_onAdd} onRemove={_onRemove} onUseDifferentAddress={onUseDifferentAddress} useDifferentAddress={useDifferentAddress} />
            case 'requirement':
                return <Requirements requirements={requirements} onUpload={onUpload} onRemove={onRemove} disabled={isUploading()}/>
            case 'complete':
                return    <Preview pageOnly forApplication application={applicationItem} form={JSONfn.parse(JSONfn.stringify(form))} />
        }
    };
    const onNext = () => {
        setCurrentStep(currentStep + 1);
    };
    const [generatingApplication, setGeneratingApplication] = useState(false);
    const onPrevious = () => setCurrentStep(currentStep - 1);
    const onExitApplication = () => {
        props.jumpTo()
    };
    const incompleteRequirements = () => {
        let incomplete = false;
        requirements.map((r: any) => {

            if (r?.required) {

                if (!(r?.files?.length > 0)) {
                    incomplete = true;
                    return;
                }
                r?.files?.forEach((f: any) => {
                    if (!(Object.keys(f?.links || {})?.length > 0)) {
                        incomplete = true;
                        return;
                    }
                });
            }
        });
        return incomplete;
    };
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState(false);
    const formValid = () => {
        var valid = true;
        form.forEach((parent: any) => {
            let isParentList = parent?.type === 'list';
            if (parent?.data?.length > 0) {
                parent?.data?.forEach((child: any) => {
                    if (isParentList) { // whatever changes here should also be reflected on the ELSE below
                        child?.forEach((subChild: any) => {
                            if (subChild?.required) {
                                if (child.type === 'time') {}
                                else if (child?.type === 'option') {
                                    let selectedItems = child?.items?.filter((i: any) => i?.selected);
                                    selectedItems?.forEach((item: any) => {
                                        if (item?.hasSpecification) {
                                            if (
                                                item?.specification?.required &&
                                                !(
                                                    !item?.specification?.error &&
                                                    item?.specification?.value
                                                )
                                            ) {
                                                valid = false;
                                                return;
                                            }
                                        }
                                    });
                                    if (valid && selectedItems?.length < child?.minimum) {
                                        valid = false;
                                        return;
                                    }
                                }
                                else if (typeof(subChild?.value) === 'object' && !!subChild?.value) { // should be array but ts returns 'object' idky
                                    subChild?.value?.forEach((grandchild: any) => {
                                        if (!(!grandchild?.error && grandchild?.value)) {
                                            valid = false;
                                            return;
                                        }
                                    });
                                }
                                else if (!(!subChild?.error && subChild?.value)) {
                                    valid = false;
                                    return;
                                }
                            }
                            else if (subChild?.data?.length > 0) {
                                subChild?.data?.forEach((ssubChild: any) => {
                                    if (ssubChild?.length > 0) {
                                        ssubChild?.forEach((sssubChild: any) => {
                                            if (!(!sssubChild?.error && sssubChild?.value) && sssubChild?.required) {
                                                valid = false;
                                                return;
                                            }
                                        });
                                    }
                                    else {
                                        if (!(!ssubChild?.error && ssubChild?.value) && ssubChild?.required) {
                                            valid = false;
                                            return;
                                        }
                                    }
                                });
                            }
                        });
                    }
                    else { // whatever changes here should also be reflected on the IF above
                        if (child?.required) {
                            if (child.type === 'time') {}
                            else if (child?.type === 'option') {
                                let selectedItems = child?.items?.filter((i: any) => i?.selected);
                                selectedItems?.forEach((item: any) => {
                                    if (item?.hasSpecification) {
                                        if (
                                            item?.specification?.required &&
                                            !(
                                                !item?.specification?.error &&
                                                item?.specification?.value
                                            )
                                        ) {
                                            valid = false;
                                            return;
                                        }
                                    }
                                });
                                if (valid && selectedItems?.length < child?.minimum) {
                                    valid = false;
                                    return;
                                }
                            }
                            else if (typeof(child?.value) === 'object' && !!child?.value) { // should be array but ts returns 'object' idky
                                child?.value?.forEach((grandchild: any) => {
                                    if (!(!grandchild?.error && grandchild?.value)) {
                                        valid = false;
                                        return;
                                    }
                                });
                            }
                            else if (!(!child?.error && child?.value)) {
                                valid = false;
                                return;
                            }
                        }
                    }
                });
            }
        });
        return valid;
    };
        const [agree, setAgree] = useState(false);
    const [applicationPayload, setApplicationPayload] = useState({});


    const steps = [

        {
            title: service?.serviceCode === 'service-1' ? 'Exam Schedule' : 'Region',

            onPrevious: () => FOR_EDITING ? onExitApplication() : onPrevious(),
            onNext,
            buttonLabel: 'Next',
            buttonDisabled: service?.serviceCode === 'service-1' ? !(region?.value && schedule?.id) : !region?.value,
        },
        {
            title: 'Application Type',

            onPrevious,
            onNext,
            buttonLabel: 'Next',
            buttonDisabled: applicationType?.elements?.length > 0 ? !(applicationType?.elements?.length > 0 && applicationType?.element) : !applicationType?.label,
        },
        {
            title: 'Application Form',
            onPrevious,
            onNext,
            buttonLabel: 'Next',
            buttonDisabled: !formValid(),
        },
        {
            title: 'Requirements',
            onPrevious,
            onNext: () => {

                onNext();

            },
            buttonLabel: 'Review',
            buttonDisabled: incompleteRequirements(),
        },
        {
            title: completed ? 'Complete' : 'Review',
            onPrevious: () => {
                if (agree) setAgree(false);
                if (reviewed) dispatch(setReviewed(false));
                onPrevious();
            },
            onNext: () => {

                if (!reviewed) {
                    dispatch(setReviewed(true));
                }
                else if (completed) {
                    if(Platform.OS == 'web') dispatch(setApplicationItem({}));
                    onExitApplication();
                }
                else if (agree) onSaveApplication();
            },
            buttonLabel: !reviewed ? 'Submit' : completed ? 'Close' : 'Confirm',
           // buttonDisabled: (applicationItem || (!reviewed ? false : completed ? false : !agree)),
        },
    ];
    const getStructuredData = (form: any) => {
        var structuredParent = {};
        form?.forEach((parent: any) => {
            var isParentList = parent?.type === 'list';
            var structuredChild = isParentList ? [] : {};
            if (parent?.type !== 'info') {
                parent?.data?.forEach((child: any, index: number) => {
                    if (isParentList) { // any changes here should also reflect on ELSE below
                        var structuredSubChild = {};
                        child.forEach((subChild: any) => {
                            if (subChild?.isSet) {
                                var structuredSetChild = subChild?.type === 'list' ? [] : {};
                                subChild?.data?.forEach((setChild: any) => {
                                    if (subChild?.type === 'list') { // multiple set
                                        var structuredSubSetChild = {};
                                        setChild?.forEach((subSetChild: any) => {
                                            var value = subSetChild?.value;
                                            var isDateIncomplete = () => { return value?.some((v: any) => !v?.isValid) };
                                            if (subSetChild?.type === 'option') {
                                                let _selected = subSetChild?.items?.filter((i: any) => i?.selected);
                                                let _items = [];
                                                _selected?.forEach((item: any) => {
                                                    let __obj = { value: item?.value };
                                                    if (item?.hasSpecification) {
                                                        __obj = {
                                                            ...__obj,
                                                            [`${item?.specification?.id}`]: item?.specification?.value,
                                                        };
                                                    }
                                                    _items?.push(__obj);
                                                });
                                                structuredSubSetChild = {
                                                    ...structuredSubSetChild,
                                                    [subSetChild?.id]: _items,
                                                };
                                            }
                                            else {
                                                if (typeof(value) === 'object' && !!value) {
                                                    var structuredGrandchild = {};
                                                    value.forEach((grandchild: any) => {
                                                        structuredGrandchild = {
                                                            ...structuredGrandchild,
                                                            [grandchild?.id]: grandchild?.value,
                                                        };
                                                    });
                                                    value = subSetChild?.type === 'date'
                                                        ? isDateIncomplete()
                                                            ? null
                                                            : structuredGrandchild
                                                        : structuredGrandchild;
                                                }
                                                if (subSetChild?.hasSpecification) value = `${value} • ${form?.find((f: any) => f?.id === parent?.id)?.data?.[index]?.find((f: any) => f?.id === `for-${subChild?.id}`)?.value}`;
                                                if (!subSetChild?.specification) {
                                                    structuredSubSetChild = {
                                                        ...structuredSubSetChild,
                                                        [subSetChild?.id]: value,
                                                    };
                                                }
                                            }
                                        });
                                        structuredSetChild?.push(structuredSubSetChild);
                                    }
                                    else {
                                        var value = setChild?.value;
                                        var isDateIncomplete = () => { return value?.some((v: any) => !v?.isValid) };
                                        if (setChild?.type === 'option') {
                                            let _selected = setChild?.items?.filter((i: any) => i?.selected);
                                            let _items = [];
                                            _selected?.forEach((item: any) => {
                                                let __obj = { value: item?.value };
                                                if (item?.hasSpecification) {
                                                    __obj = {
                                                        ...__obj,
                                                        [`${item?.specification?.id}`]: item?.specification?.value,
                                                    };
                                                }
                                                _items?.push(__obj);
                                            });
                                            structuredSetChild = {
                                                ...structuredSetChild,
                                                [setChild?.id]: _items,
                                            };
                                        }
                                        else {
                                            if (typeof(value) === 'object' && !!value) {
                                                var structuredGrandchild = {};
                                                value.forEach((grandchild: any) => {
                                                    structuredGrandchild = {
                                                        ...structuredGrandchild,
                                                        [grandchild?.id]: grandchild?.value,
                                                    };
                                                });
                                                value = setChild?.type === 'date'
                                                    ? isDateIncomplete()
                                                        ? null
                                                        : structuredGrandchild
                                                    : structuredGrandchild;
                                            }
                                            if (setChild?.hasSpecification) value = `${value} • ${form?.find((f: any) => f?.id === parent?.id)?.data?.[index]?.find((f: any) => f?.id === `for-${subChild?.id}`)?.value}`;
                                            if (!setChild?.specification) {
                                                structuredSetChild = {
                                                    ...structuredSetChild,
                                                    [setChild?.id]: value,
                                                };
                                            }
                                        }
                                    }
                                });
                                structuredSubChild = {
                                    ...structuredSubChild,
                                    [subChild?.id]: structuredSetChild,
                                };
                            }
                            else {
                                var value = subChild?.value;
                                var isDateIncomplete = () => { return value?.some((v: any) => !v?.isValid) };
                                if (subChild?.type === 'option') {
                                    let _selected = subChild?.items?.filter((i: any) => i?.selected);
                                    let _items = [];
                                    _selected?.forEach((item: any) => {
                                        let __obj = { value: item?.value };
                                        if (item?.hasSpecification) {
                                            __obj = {
                                                ...__obj,
                                                [`${item?.specification?.id}`]: item?.specification?.value,
                                            };
                                        }
                                        _items?.push(__obj);
                                    });
                                    structuredChild = {
                                        ...structuredChild,
                                        [subChild?.id]: _items,
                                    };
                                }
                                else {
                                    if (typeof(value) === 'object' && !!value) {
                                        var structuredGrandchild = {};
                                        value.forEach((grandchild: any) => {
                                            structuredGrandchild = {
                                                ...structuredGrandchild,
                                                [grandchild?.id]: grandchild?.value,
                                            };
                                        });
                                        value = subChild?.type === 'date'
                                            ? isDateIncomplete()
                                                ? null
                                                : structuredGrandchild
                                            : structuredGrandchild;
                                    }
                                    if (subChild?.hasSpecification) value = `${value} • ${form?.find((f: any) => f?.id === parent?.id)?.data?.[index]?.find((f: any) => f?.id === `for-${subChild?.id}`)?.value}`;
                                    if (!subChild?.specification) {
                                        structuredSubChild = {
                                            ...structuredSubChild,
                                            [subChild?.id]: value,
                                        };
                                    }
                                }
                            }
                        });
                        structuredChild?.push(structuredSubChild);
                    }
                    else { // any changes here should also reflect on IF above
                        var value = child?.value;
                        var isDateIncomplete = () => { return value?.some((v: any) => !v?.isValid) };
                        if (child?.type === 'option') {
                            let _selected = child?.items?.filter((i: any) => i?.selected);
                            let _items = [];
                            _selected?.forEach((item: any) => {
                                let __obj = { value: item?.value };
                                if (item?.hasSpecification) {
                                    __obj = {
                                        ...__obj,
                                        [`${item?.specification?.id}`]: item?.specification?.value,
                                    };
                                }
                                _items?.push(__obj);
                            });
                            structuredChild = {
                                ...structuredChild,
                                [child?.id]: _items,
                            };
                        }
                        else {
                            if (typeof(value) === 'object' && !!value) {
                                var structuredGrandchild = {};
                                value.forEach((grandchild: any) => {
                                    structuredGrandchild = {
                                        ...structuredGrandchild,
                                        [grandchild?.id]: grandchild?.value,
                                    };
                                });
                                value = child?.type === 'date'
                                    ? isDateIncomplete()
                                        ? null
                                        : structuredGrandchild
                                    : structuredGrandchild;
                            }
                            if (child?.hasSpecification) value = `${value} • ${form?.find((f: any) => f?.id === parent?.id)?.data?.find((f: any) => f?.id === `for-${child?.id}`)?.value}`;
                            if (!child?.specification) {
                                structuredChild = {
                                    ...structuredChild,
                                    [child?.id]: value,
                                };
                            }
                        }
                    }
                });
                structuredParent = {
                    ...structuredParent,
                    [parent?.id]: structuredChild,
                };
            }
        });
        return structuredParent;
    };
    const onSaveApplication = () => {
        /**cleaning of payload */
        const _application = JSONfn.parse(JSONfn.stringify(applicationItem));
        delete _application?.service?.about;
        delete _application?.service?.createdAt;
        // delete _application?.service?.requirements;
        delete _application?.service?.applicationTypes;
        // delete _application?.service?.applicationType?.elements;
        // delete _application?.service?.applicationType?.modificationDueTos;
        var _requirements = [];
        if (_application?.service?.applicationType?.requirements?.length > 0) {
            _requirements = _application?.service?.applicationType?.requirements?.map((r: any) => {
                let links = r?.files?.map((f: any) => f?.links);
                return {...r, links};
            });
            _application.service.applicationType.requirements = _requirements;
        }

        let structuredData = form?.length > 0 ? getStructuredData(JSONfn.parse(JSONfn.stringify(form))) : {};

        /**excess */
        _application.applicant = form?.length > 0 ? {userId: user?.applicant?.userId} : {};
        _application.applicant = {
            ...user?.applicant,
            ..._application?.applicant,
            userType: user?.userType,
        };
        if (typeof(_application?.applicant?.dateOfBirth) === 'string') {
            const day = extractDate(_application.applicant.dateOfBirth, 'date');
            const month = extractDate(_application.applicant.dateOfBirth, 'month');
            const year = extractDate(_application.applicant.dateOfBirth, 'year');
            _application.applicant.dateOfBirth = {day, month, year};
        }
        if (FOR_EDITING && _application?.schedule?.region?.value) _application.schedule.region = _application?.schedule?.region?.value;
        Object.keys(structuredData).forEach((id: string) => {
            if (id === 'basic') {
                _application.applicant = {
                    ..._application.applicant,
                    ...structuredData.basic,
                };
                _application.service = {
                    ..._application.service,
                    [id]: structuredData[id],
                };
            }
            else if (
                id === 'address' ||
                id === 'contact' ||
                id === 'education'
            ) {
                _application.applicant = {
                    ..._application.applicant,
                    [id]: structuredData[id],
                };
            }
            else {
                _application.service = {
                    ..._application.service,
                    [id]: structuredData[id],
                };
            }
        });
        if (applicationItem?._id) _application._id = applicationItem?._id;
        setApplicationPayload(_application);
        setTimeout(() => onFetchFees(transformToFeePayload(_application)), 500);
    };
    const onFetchFees = (__app: any) => {
        dispatch(fetchSOA(__app));
    };
    useEffect(() => {
        if (fetchSOASuccess || fetchSOAError) {
            /**payload */

            dispatch(saveApplication({
                ...applicationPayload,
                soa: soa?.statement_Of_Account || [],
                totalFee: soa?.totalFee || 0,
                useDifferentAddress,
                renew,
                renewApplication,
                editApplication,
            }));
        }
    }, [fetchSOASuccess, fetchSOAError]);


    useEffect(()=>{
        setCurrentStep(0)
        onExitApplication()
    }, [applicationItem._id, savingApplication ])

    const renderTabBar = (tabProp) =>{
        return isMobile ?  <TabBar
            renderLabel={({route, focused}) => {
                return (
                    <View style={{flexDirection: "row", alignItems: "center"}}>

                        <Text numberOfLines={Platform.OS == "windows" ? 1 : undefined} style={{
                            color: focused ? infoColor : "#606A80",
                            fontFamily: Regular, // focused ? Bold : Regular
                            fontSize: fontValue(14)
                        }}>{route.title}</Text>
                    </View>
                );
            }}
            indicatorStyle={{
                backgroundColor: infoColor,
                borderRadius: 0,
                padding: 0,
                left: 24 / 2,
                ...Platform.select({
                    web: {marginBottom:  -15 }
                }),}}
            {...tabProp}
            scrollEnabled={true}
            style={[{backgroundColor: 'white'}, isMobile ? {} :{shadowOpacity: 0.0, }]}
        />  :  <View style={{
            borderBottomWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomColor: "#d2d2d2", width: "100%",
            backgroundColor: "#fff"
        }}>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <TabBar
                    indicatorStyle={{
                        backgroundColor: infoColor,
                        borderRadius: 0,
                        padding: 0,
                        left: 24 / 2,
                        ...Platform.select({
                            web: {marginBottom:  -15 }
                        }),}}
                    renderLabel={({route, focused}) => {
                        return (
                            <View style={{flexDirection: "row", alignItems: "center", }}>

                                <Text style={{
                                    color: focused ? infoColor : "#606A80",
                                    fontFamily: Regular, // focused ? Bold : Regular
                                    fontSize: fontValue(12)
                                }}>{route.title}</Text>
                            </View>
                        );
                    }}
                    scrollEnabled={true}
                    {...tabProp}
                    style={{shadowOpacity: 0.0, backgroundColor: 'white'}}
                />

            </View>

        </View>
    }

    return <View style={{flex: 1}}>

        <ApplicationSteps
            tabview={<TabView
                swipeEnabled={false}
                renderTabBar={()=> null}
                navigationState={{ index: currentStep, routes }}
                renderScene={renderScene}
                onIndexChange={(index)=> setCurrentStep(index) }
                initialLayout={{ width: layout.width }}
            />}
            steps={steps}
            currentStep={currentStep}
            completed={completed}
            onExit={onExitApplication}
            //loading={fetchingSOA || savingApplication}
            UDAAlert={udaAlert}
            generatingApplication={generatingApplication}
        />

        <CustomAlert
            showClose={false}
            type={""}
            onDismissed={()=>{
                dispatch(setReviewed(false))
            }}
            onLoading={(fetchingSOA)}
            onCancelPressed={()=>{
                dispatch(setReviewed(false))
            }}
            confirmButton={"Confirm"}
            onConfirmPressed={async () => {
                onSaveApplication();


            }}
            show={reviewed /*&& !saveApplicationError && !fetchSOAError*/} title={"Update Application"}
            message={"Are you sure you want to update this application?"}/>



    {/*


*/}
    </View>

}


export default ServiceFormPage
