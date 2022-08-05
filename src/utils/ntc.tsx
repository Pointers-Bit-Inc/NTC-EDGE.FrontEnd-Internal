import Moment from "moment";

const transformText = (text: string) => {
    if (text === 'examSeminar') return 'Exam/Seminar';
    else if (text === 'typeModel') return 'Type/Model';
    else if (text === 'makeTypeModel') return 'Make/Type/Model';
    else if (text === 'orInvoiceNumber') return 'OR/Invoice No.';
    else if (text === 'permitRSLNumber') return 'Permit/RSL No.';
    else if (text === 'pointsOfCommServiceArea') return 'Points of Comm/Service Area';
    else if (text === 'authorizedSellerBuyer') return 'Authorized Seller/Buyer';
    else if (text === 'cpcCpcnPaRslNumber') return 'CPC/CPNCN/PA/RSL No.';
    else if (text === 'shipVesselName') return 'Ship/Vessel Name';
    else if (text === 'radioOfficerOperator') return 'Radio Officer/Operator';
    else if (text === 'peceEceNumber') return 'PECE/ECE No.';
    else if (text === 'certificateEctNumber') return 'Certificate/ECT No.';
    else if (text === 'paCaNumber') return 'PA/CA No.';
    else if (text === 'exactLocationOfTvroSystem') return 'Exact Location of TVRO System';
    else if (text === 'cpcnPaCaNumber') return 'CPCN/PA/CA No.';
    else if (text === 'corNumber') return 'COR No.';
    else if (text === 'certificateNumber') return 'Certificate No.';
    else if (text === 'licenseNumber') return 'License No.';
    else if (text === 'permitNumber') return 'Permit No.';
    else if (text === 'lossMutilationDueTo') return 'Loss/Mutilation due to';
    else if (text === 'cellphoneNumber') return 'Cellphone No.';
    else if (text === 'typeOfEquipmentDevice') return 'Type of Equipment/Device';
    else if (text === 'cpcnPaCaDateOfExpiry') return 'CPCN/PA/CA Date of Expiry';
    else if (text === 'corDateOfExpiry') return 'COR Date of Expiry';
    else if (text === 'cellphoneNumberToBeBlocked') return 'Cellphone No. to be Blocked';
    else if (text === 'streetZone') return 'Street/Zone';
    else if (text === 'corVasNumber') return 'COR/VAS No.';
    else if (text === 'corVasDateOfExpiry') return 'COR/VAS Date of Expiry';
    else if (text === 'noOfCopies') return 'No. of Copies';
    else if (text === 'atrocArslNumber') return 'ATROC/ARSL No.';
    else if (text === 'rslNumber') return 'RSL No.';
    else if (text === 'stationLicenseNumber') return 'Station License No.';
    else if (text === 'dealerSellerName') return 'Dealer/Seller Name';
    else if (text === 'amateurLicenseNumberPermitToPossessNumber') return 'Amateur License No./Permit to Possess No.';
    else if (text === 'rocEctNumber') return 'ROC/ECT No.';
    return text?.replace(/([a-z])([A-Z])/g, '$1 $2')?.split(' ')?.map((word: string) => word?.charAt(0)?.toUpperCase() + word?.substring?.(1))?.join(' ');
};
//1234, 12, 13, 14, 15, 16, 17, 18, 19, 21
const transformToFeePayload = (application: any) => {
    let { service = {}, region = '' } = application;
    let {
        applicationDetails = {},
        applicationType = {},
        station = [],
        proposedStation = [],
        equipment = [],
        proposedEquipment = [],
        particulars = [],
        stationClass = [],
        valueAddedServices = [],
        transmissionType = {},
    } = service;
    station = (station || (proposedStation || (particulars || [])))?.[0];
    equipment = (equipment || (proposedEquipment || (particulars || [])))?.[0];

    let { validity = {} } = station || {};
    let { year, month, day } = validity;
    let expired = year && month && day ? Moment(new Date()).set({year, month, date: day}) : new Date()?.toISOString();

    let label = applicationType?.label?.toLowerCase();

    let typeFn = () => {
        let _label = applicationType?.type || '';
        if (label?.match('new')) _label = 'new';
        if (label?.match('renewal')) _label = 'renew';
        else if (label?.match('modification') || label?.match('modify')) _label = 'modification';
        else if (label?.match('permit')) {
            if (label?.match('possess') || label?.match('purchase')) _label = 'purchase/possess';
            else if (label?.match('sell') || label?.match('transfer')) _label = 'sell/transfer';
        }
        return _label;
    };
    let boundaryFn = () => {
        if (label?.match('domestic')) return 'domestic';
        else if (label?.match('international')) return 'international';
        else return '';
    };
    let installedEquipmentFn = () => {
        let _label = '';
        if (label?.match('installed equipment')) {
            if (label?.match('with')) _label = 'with';
            if (label?.match('without')) _label = 'without';
        }
        return _label;
    };
    let categoryFn = () => {
        let _category = '';
        if (applicationType?.serviceCode === 'ROC') _category = applicationType?.element || '';
        else _category = applicationType?.category || '';
        if (applicationDetails?.variation) _category += `${_category ? '' : '-'}${applicationDetails?.variation}`;
        return _category;
    };
    let bandwidthFn = () => {
        return {
            bandwidth: Number(station?.bandwidth?.bandwidth || 0),
            unit: station?.bandwidth?.unit || '',
        }
    };
    let frequencyFn = () => {
        /**
         * frequency that is a section
         * array
         * [{tx: 1, rx: 1}]
         *
         * frequency that is a section
         * [{frequency: 1}]
         *
         * frequency that is inside station
         * could be string (pre-filled) or number
         */
        return service?.frequency || service?.station?.map((s: any) => s?.frequency) || service?.station?.map((s: any) => s?.proposedFrequency);;
    };
    let tranmissionFn = () => {
        let _t = equipment?.transmission?.split(' • ');
        return {
            transmission: _t?.[0] || '',
            frequency: _t?.[1] || '',
        };
    };
    let channelFn = () => {
        let _frequency = frequencyFn();
        let _frequencies = [];
        if (_frequency?.length > 0) {
            _frequency?.forEach((f: any) => {
                if (f?.tx > -1) _frequencies?.push(f?.tx);
                if (f?.rx > -1) _frequencies?.push(f?.rx);
                if (f?.frequency > -1) _frequencies?.push(f?.frequency);
                if (f?.proposedFrequency > -1) _frequencies?.push(f?.proposedFrequency);
            });
        }
        _frequencies = [...new Set(_frequencies)];
    };
    let classOfStation = (forChannel = false) => {
        let _csObj = {};
        let _scArr = (particulars || stationClass) || [];
        if (_scArr?.length > 0) {
            _scArr?.forEach((c: any) => {
                let _split = c?.class?.split(' • ');
                _csObj = {
                    ..._csObj,
                    [_split?.[0]]: Number((forChannel ? (channelFn()?.length) : _split?.[1] || 0)),
                }
            });
        }
        return _csObj;
    };

    /*
    let classFn = () => {
      let _e = applicationType?.element || '';
      let _split = _e?.split(' ');
      let _ndx = _split?.findIndex((s: string) => s === 'Class');
      if (_ndx > -1) return _split[_ndx + 1];
      else return '';
    };
    let unitsFn = () => {
      let _unit = 0;
      Object.keys(stationClass)?.forEach((stn: string) => {
        let _value = stationClass[stn]?.value;
        _unit += _value;
      });
      return _unit;
    };
    let stationDetailsFn = () => {
      let radioStationLicense = '';
      let spectrum = '';
      let _station = '';
      if (
        label?.match('bwa') ||
        label?.match('wdn') ||
        label?.match('microwave')
      ) {
        _station = 'fixed';
        radioStationLicense = 'FX';
      }
      else if (
        label?.match('wdn') ||
        label?.match('wll') ||
        label?.match('bts')
      ) {
        _station = 'landbase';
        radioStationLicense = 'FB';
      }
      else if (label?.match('public trunked')) {
        _station = 'publictrunked'
        radioStationLicense = 'Public Trunked';
      }
      else if (label?.match('vsat')) {
        _station = 'TC-VSAT';
        radioStationLicense = 'VSAT';
      }
      else radioStationLicense = '';
      if (radioStationLicense === 'FB') {
        if (bandwidth < 1) {}
        else if (bandwidth > 0 && bandwidth < 10) spectrum = '1-10';
        else if (bandwidth > 9 && bandwidth < 20) spectrum = '10-20';
        else if (bandwidth > 19) spectrum = '20above';
      }
      else if (radioStationLicense === 'VSAT') spectrum = 'satelliteservice';
      // publicradio
      else if (radioStationLicense === 'Public Trunked') spectrum = 'publictrunked';
      // wll
      // pointtomultipoint
      else if (radioStationLicense === 'FX') spectrum = 'pointtopoint';
      if (stationClass?.RT > 0) _station = 'repeater';
      else if (stationClass?.FX > 0) _station = 'fixed';
      else if (stationClass?.FB > 0) _station = 'landbase';
      else if (stationClass?.ML > 0) _station = 'landmobile';
      else if (stationClass?.P > 0) _station = 'portable';
      // BC
      // FC
      // FA
      // MA
      else if (stationClass?.TC > 0) _station = 'TC-VSAT';
      return {
        spectrum,
        station: _station,
      };
    };
    */

    let feePayload = {
        service: service?.serviceCode?.split('-')?.[1] || '', //
        subService: applicationType?.serviceCode || '', //
        types: typeFn(), //
        category: categoryFn(), //
        validity: Number(applicationDetails?.noOfYears || 0), //
        units: equipment?.length || 0, //
        nos: valueAddedServices?.service?.length || 0, //
        boundary: boundaryFn(), //
        location: region, //
        installedEquipment: installedEquipmentFn(), //
        power: Number(equipment?.powerOutput || 0), //
        transmission: tranmissionFn()?.transmission, //
        frequency: tranmissionFn()?.frequency, //
        bandwidth: bandwidthFn(), //
        mode: transmissionType?.transmissionType || '', //
        stationClassUnits: classOfStation(), //
        stationClassChannels: classOfStation(true), //
        expired, //
    };

    return feePayload;
};
const yearList = () => {
    var presentYear = Moment().add(50, 'years').get('year');
    var startYear = Moment().subtract(50, 'years');
    var years = [];

    while (startYear.get('year') <= presentYear) {
        years.push({
            label: startYear.get('year').toString(),
            value: startYear.get('year').toString(),
        });
        startYear.add(1, 'years');
    }

    years = years.reverse();

    return years;
};


const toIsoFormat = (date) => {
    var d = new Date(date)
    // Padding functions
    function pad(n) {return (n<10? '0' :  '') + n}
    function padd(n){return (n<100? '0' : '') + pad(n)}

    return (d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) +
        'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' +
        pad(d.getUTCSeconds()) +  'Z');
}
function formatAMPM(date) {
var hours = date.getHours();
var minutes = date.getMinutes();
var ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12;
minutes = minutes < 10 ? '0'+minutes : minutes;
return [hours, minutes, ampm];
}
const isNumber = (v: unknown) => typeof v === 'number' && !Number.isNaN(v);
function isValidDate(dateString) {
    //format yyyy-mm-dd
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString?.match(regEx)) return false;
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false;
    return d.toISOString().slice(0,10) === dateString;
}
export {
    transformToFeePayload,
    isNumber,
    transformText,
    yearList,
    toIsoFormat,
    formatAMPM,
    isValidDate
}
