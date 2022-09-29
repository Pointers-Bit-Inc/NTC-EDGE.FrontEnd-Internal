import Moment from "moment";
const regionList = [
    {
        "label": "Region I - Ilocos Region",
        "value": "I"
    },
    {
        "label": "Region II - Cagayan Valley",
        "value": "II"
    },
    {
        "label": "Region III - Central Luzon",
        "value": "III"
    },
    {
        "label": "Region IV-A - CALABARZON",
        "value": "IV-A"
    },
    {
        "label": "MIMAROPA Region",
        "value": "IV-B"
    },
    {
        "label": "Region V - Bicol Region",
        "value": "V"
    },
    {
        "label": "Region VI - Western Visayas",
        "value": "VI"
    },
    {
        "label": "Region VII - Central Visayas",
        "value": "VII"
    },
    {
        "label": "Region VIII - Eastern Visayas",
        "value": "VIII"
    },
    {
        "label": "Region IX - Zamboanga Peninsula",
        "value": "IX"
    },
    {
        "label": "Region X - Northern Mindanao",
        "value": "X"
    },
    {
        "label": "Region XI - Davao Region",
        "value": "XI"
    },
    {
        "label": "Region XII - SOCCSKSARGEN",
        "value": "XII"
    },
    {
        "label": "Region XIII - Caraga",
        "value": "XIII"
    },
    {
        "label": "NCR - National Capital Region",
        "value": "NCR"
    },
    {
        "label": "CAR - Cordillera Administrative Region",
        "value": "CAR"
    },
    {
        "label": "BARMM - Bangsamoro Autonomous Region in Muslim Mindanao",
        "value": "BARMM"
    }
];
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
        applicationDetails,
        applicationType,
        station,
        proposedStation,
        equipment,
        proposedEquipment,
        particulars,
        stationClass,
        valueAddedServices,
        transmissionType,
        certificate,
        license,
        permit,
        details
    } = service;
    let equipments = equipment || (proposedEquipment || (particulars || []));
    station = station?.length > 0
        ? station
        : !!station
            ? Object.keys(station)?.length > 0
                ? [station]
                : []
            : [];
    let stations = station || (proposedStation || (particulars || []));
    station = stations?.[0] || {};
    equipment = equipments?.[0] || {};

    let label = applicationType?.label?.toLowerCase();

    let typeFn = () => {
        let _label = applicationType?.type || '';
        let _isRenewal = label?.match('renewal');
        if (label?.match('new') && !_isRenewal) _label = 'new';
        else if (_isRenewal) _label = 'renew';
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
        if (applicationDetails?.variation) _category += `${_category ? '-' : ''}${applicationDetails?.variation?.toLowerCase()}`;
        _category = _category?.replace(' ', '');
        return _category;
    };
    let bandwidthFn = () => {
        let _basis =
            station?.bandwidth?.bandwidth ||
            station?.bandwidth?.unit
                ? station
                : equipment;
        return {
            bandwidth: Number(_basis?.bandwidth?.bandwidth || 0),
            unit: _basis?.bandwidth?.unit || '',
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
            transmission: _t?.[0]?.toLowerCase() || '',
            frequency: _t?.[1]?.toLowerCase()?.replace(' frequency', '')?.replace(' ', '') || '',
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
        return _frequencies;
    };
    let classOfStation = (forChannel = false) => {
        let _csObj = {};
        let _scArr = (stationClass || particulars) || [];
        if (_scArr?.length > 0) {
            _scArr?.forEach((c: any) => {
                let _split = c?.class?.split(' • ');
                _csObj = {
                    ..._csObj,
                    [_split?.[0]]: Number((forChannel ? (channelFn()?.length || 0) : _split?.[1] || 0)),
                }
            });
        }
        return _csObj;
    };
    let noOfYears = () => {
        let no = Number(applicationDetails?.noOfYears || 0);
        if (isNaN(no)) return 0;
        else return no;
    };
    let classFn = () => {
        let _e = applicationType?.element || '';
        let _split = _e?.split(' ');
        let _ndx = _split?.findIndex((s: string) => s === 'Class');
        if (_ndx > -1) return _split[_ndx + 1];
        else return '';
    };

    let expirationDateFn = () => {
        let { dateOfExpiry = {} } = certificate || (license || (permit || (details || {})));
        let { year, month, day } = dateOfExpiry;
        let expirationDate = year && month && day ? Moment(new Date()).set({year, month, date: day})?.toISOString() : new Date()?.toISOString();
        return expirationDate;
    };

    /*
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
        classes: classFn(), //
        noOfYears: noOfYears(), //
        units: equipments?.length || 0, //
        nos: valueAddedServices?.service?.length || 0, //
        noOfCopies: Number(details?.noOfCopies || 0), //
        boundary: boundaryFn(), //
        location: 'HighlyUrbanizedAreas', //region, //
        installedEquipment: installedEquipmentFn(), //
        power: Number(equipment?.powerOutput || 0), //
        transmission: tranmissionFn()?.transmission, //
        frequency: tranmissionFn()?.frequency, //
        bandwidth: bandwidthFn(), //
        mode: transmissionType?.transmissionType?.toLowerCase() || '', //
        stationClassUnits: classOfStation(), //
        stationClassChannels: classOfStation(true), //
        dateOfExpiry: expirationDateFn(), //
        stationCount: stations?.length || 0,
        updatedAt: new Date()?.toISOString(),
    };

    return feePayload;
};
const generatePassword = () =>{
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var charsarr = chars.split('');
    var pasoutarr = new Array();
    for(var x=0;x<16;x++){
        pasoutarr[x] = charsarr[Math.floor(Math.random()*73)];}
    return pasoutarr.join('');
}
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

    return (d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getDate()) +
        'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' +
        pad(d.getUTCSeconds()) +  'Z');
}


const formatAMPM = (date) => {

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    hours = hours.toString().padStart(2, '0');


    return  [hours, minutes, ampm];
}
const isNumber = (v: unknown) => typeof v === 'number' && !Number.isNaN(v);
function isValidDate(dateString) {
    //format yyyy-mm-dd
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString?.toString()?.match(regEx)) return false;
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false;
    return d.toISOString().slice(0,10) === dateString;
}

const cleanNonNumericChars = (text) =>  {
    if (!text || typeof text !== 'string') {
        text = String(text);
    }
    // Remove non numeric and non .- chars
    text = text.replace(/[^\d.,-]/g, '');

    // replace "," with "."
    text = text.replace(',', '.');

    // Remove extra periods ('.', only one, at most left allowed in the string)
    let splitText = text.split('.');
    text =
        splitText.shift() +
        (splitText.length
            ? '.' + splitText[0].slice(0,2)
            : '');

    // Remove '-' signs if there is more than one, or if it is not most left char
    for (var i = 1; i < text.length; i++) {
        var char = text.substr(i, 1);
        if (char == '-') {
            text = text.substr(0, i) + text.substr(i + 1);
            // decrement value to avoid skipping character
            i--;
        }
    }

    // Remove leading zeros
    text = text.replace(/^(-)?0+(?=\d)/, '$1'); //?=\d is a positive lookahead, which matches any digit 0-9

    return text;
}

function isDiff(access: any[], originalAccess: any[]) {

    var a = [], diff = [];

    for (var i = 0; i < access.length; i++) {
        a[access[i]] = true;
    }

    for (var i = 0; i < originalAccess.length; i++) {
        if (a[originalAccess[i]]) {
            delete a[originalAccess[i]];
        } else {
            a[originalAccess[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }
    return diff.length;
}
 const currency = (number: number) => {
    var formatter = new Intl.NumberFormat('fil-PH', {
        style: 'currency',
        currency: 'PHP',
    });
    return formatter.format(number);
};
function toFixed(x) {
    if (Math.abs(x) < 1.0) {
        let e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10,e-1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        let e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10,e);
            x += (new Array(e+1)).join('0');
        }
    }
    return x;
}

function toFixedTrunc(x, n) {
    x = toFixed(x)

    // From here on the code is the same than the original answer
    const v = (typeof x === 'string' ? x : x.toString()).split('.');
    if (n <= 0) return v[0];
    let f = v[1] || '';
    if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
    while (f.length < n) f += '0';
    return `${v[0]}.${f}`
}
const recursionObject = (obj, fn) => {
    for (const [key, value] of Object.entries(obj)) {
        if( value && typeof value === "object"){
            recursionObject(value, fn)
        }else{
            fn(value, key)
        }
    }

}
function fuzzysearch (needle, haystack) {
    var _needle = needle?.toLowerCase()
    var _haystack = haystack?.toLowerCase()
    var hlen = haystack?.length;
    var nlen = needle?.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return _needle === _haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = _needle.charCodeAt(i);
        while (j < hlen) {
            if (_haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}
const datesArray =Array.from(Array(60), (_, i) => {
    return {
        label: i.toString().length == 1 ? "0" +(i).toString() : (i).toString(),
        value: i.toString().length == 1 ? "0" +(i).toString() : (i).toString(),
    }
});

const hoursArray =Array.from(Array(12), (_, i) => {
    return {
        label: (i+1).toString().length == 1 ? "0" +(i+1).toString() : (i+1).toString(),
        value: (i+1).toString().length == 1 ? "0" +(i+1).toString() : (i+1).toString(),
    }
});
const monthsArray = [
    {label: 'January', value: '01'},
    {label: 'February', value: '02'},
    {label: 'March', value: '03'},
    {label: 'April', value: '04'},
    {label: 'May', value: '05'},
    {label: 'June', value: '06'},
    {label: 'July', value: '07'},
    {label: 'August', value: '08'},
    {label: 'September', value: '09'},
    {label: 'October', value: '10'},
    {label: 'November', value: '11'},
    {label: 'December', value: '12'},
];
const ampmArray = [
    {
        label: "pm",
        value: "pm"
    },
    {
        label: "am",
        value: "am"
    }
]
const permission = {
    "chatPermission": false,
    "activityPermission": false,
    "meetPermission": false,
    "resetPasswordPermission": false,
    "qrCodePermission": false,
    "configurationPermission": {
        "view": false,
        "edit": false,
        "delete": false,
        "create": false
    },
    "userPermission": {
        "view": false,
        "edit": false,
        "delete": false,
        "create": false
    },
    "schedulePermission": {
        "view": false,
        "edit": false,
        "delete": false,
        "create": false
    },
    "employeePermission": {
        "view": false,
        "edit": false,
        "delete": false,
        "create": false
    },
    "rolePermission": {
        "view": false,
        "edit": false,
        "delete": false,
        "create": false
    },
    "tabPermission": {
        "all": false,
        "pending": false,
        "history": false
    },
}
export {
    permission ,
    datesArray,hoursArray,ampmArray,monthsArray,
    fuzzysearch,
    recursionObject,
    regionList,
    toFixedTrunc,
    currency,
    isDiff,
    cleanNonNumericChars,
    generatePassword,
    transformToFeePayload,
    isNumber,
    transformText,
    yearList,
    toIsoFormat,
    formatAMPM,
    isValidDate
}
