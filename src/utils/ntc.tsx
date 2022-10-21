import Moment from "moment";

const NTCPreview = (filename: string) => {
    const split = filename?.split('.');
    const ext = split?.[split?.length - 1];
    let pdf = require('@assets/preview/pdf.png');
    let docs = require('@assets/preview/docs.png');
    let excel = require('@assets/preview/excel.png');
    let slides = require('@assets/preview/slides.png');
    let file = require('@assets/preview/file.png');
    if (ext === 'pdf') return pdf;
    else if (
        ext === 'doc' ||
        ext === 'docx' ||
        ext === 'dotx'
    ) return docs;
    else if (
        ext === 'xls' ||
        ext === 'xlsx' ||
        ext === 'xltx'
    ) return excel;
    else if (
        ext === 'ppt' ||
        ext === 'pptx' ||
        ext === 'potx' ||
        ext === 'ppsx'
    ) return slides;
    else if (
        ext === 'jpg' ||
        ext === 'JPG' ||
        ext === 'jpeg' ||
        ext === 'JPEG' ||
        ext === 'png' ||
        ext === 'PNG' ||
        ext === 'webp' ||
        ext === 'WEBP'
    ) return 'image';
    else return file;
};

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
const transformToFeePayload = (application: any) => {
    let { service = {}, region = '' } = application;
    let {
        applicationDetails,
        applicationType,
        stationEquipment,
        particulars,
        valueAddedServices,
        transmissionType,
        certificate,
        license,
        permit,
        details,
        natureOfService,
    } = service;

    let label = applicationType?.label?.toLowerCase();

    let typeFn = () => {
        let _label = applicationType?.type || '';
        let _isRenewal = label?.match('renewal');
        if (label?.match('new') && !_isRenewal) _label = 'new';
        else if (_isRenewal) _label = 'renew';
        else if (label?.match('modification') || label?.match('modify')) _label = 'modification';
        else if (label?.match('permit')) {
            if (label?.match('possess') && label?.match('purchase')) _label = 'purchase/possess';
            else if (label?.match('possess')) {
                _label = 'possess';
                if (label?.match('storage')) _label += 'forstorage';
            }
            else if (label?.match('purchase')) _label = 'purchase';
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
    let frequencyFn = () => {
        /**
         * frequency that is a section
         * array
         * [{tx: 1, rx: 1}]
         *
         * frequency that is a section
         * [{frequency: 1}]
         *
         * frequency that is inside stationEquipment
         * could be string (pre-filled) or number
         */
        return service?.frequency || [{frequency: service?.stationEquipment?.stationKind?.split(' • ')?.[1]}];
    };
    let tranmissionFn = () => {
        let _t = stationEquipment?.transmission?.split(' • ');
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
            });
        }
        _frequencies = [...new Set(_frequencies)];
        return _frequencies;
    };
    let classOfStation = (forChannel = false) => {
        let _csObj = {};

        if (label?.match('public trunked') && forChannel) {
            _csObj = {
                publicTrunked: channelFn()?.length || 0,
            };
        }
        else if (particulars?.length > 0) {
            particulars?.forEach((c: any) => {
                let _split = c?.stationClass?.split(' • ');
                let _equipments = c?.equipments || c?.proposedEquipments;
                let _unit = Number(_split?.[1] || (_equipments?.length || 0));

                let _class = _split?.[0];
                _csObj = {
                    ..._csObj,
                    [_class]: forChannel ? (channelFn()?.length || 0) : _csObj.hasOwnProperty(_class) ? _csObj[_class] + _unit : _unit,
                };
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
        let expirationDate = year && month && day ? Moment(new Date()).set({year, month, date: day}) : new Date()?.toISOString();
        return expirationDate;
    };
    let typeOfEquipmentDeviceFn = () => {
        let tedObj = {};
        if (particulars?.length > 0) {
            particulars?.forEach((c: any) => {
                let _equipments = c?.equipments || c?.proposedEquipments;
                let _unit = _equipments?.length || 0;

                let _t = c?.typeOfEquipmentDevice?.toLowerCase();
                let _class = _t?.match('wdn')
                    ? 'wdn'
                    : _t?.match('srd')
                        ? 'srd'
                        : _t?.match('rfid') && _t?.match('low')
                            ? 'rfidlow'
                            : _t?.match('rfid') && _t?.match('high')
                                ? 'rfidhigh'
                                : _t?.match('srrs')
                                    ? 'srrs'
                                    : _t?.match('public trunk')
                                        ? 'publictrunk'
                                        : 'others';
                tedObj = {
                    ...tedObj,
                    [_class]: tedObj.hasOwnProperty(_class) ? tedObj[_class] + _unit : _unit,
                };
            });
        }
        return tedObj;
    };
    let unitsFn = () => {
        let _no = 0;
        let _classOfStation = classOfStation();
        if (Object.keys(_classOfStation)?.length > 0) Object.keys(_classOfStation)?.map(c => _no += _classOfStation[c]);
        return _no;
    };
    let bandwidthFn = () => {
        return {
            bandwidth: stationEquipment?.bandwidth?.bandwidth || 0,
            unit: stationEquipment?.bandwidth?.unit || '',
        };
    };

    /*
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
        units: unitsFn(), //
        nos: valueAddedServices?.service?.length || 0, //
        noOfCopies: Number(details?.noOfCopies || 0), //
        boundary: boundaryFn(), //
        location: 'HighlyUrbanizedAreas', //region, //
        installedEquipment: installedEquipmentFn(), //
        power: Number(stationEquipment?.powerOutput || 0), //
        transmission: tranmissionFn()?.transmission, //
        frequency: tranmissionFn()?.frequency, //
        bandwidth: bandwidthFn(), //
        mode: transmissionType?.transmissionType?.toLowerCase() || '', //
        stationClassUnits: classOfStation(), //
        stationClassChannels: classOfStation(true), //
        dateOfExpiry: expirationDateFn(), //
        stationCount: particulars?.length || 0,
        updatedAt: new Date()?.toISOString(),
        typeOfEquipmentDevice: typeOfEquipmentDeviceFn(),
        natureOfService: natureOfService?.type || '',
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
const birthyearList = () => {
    var presentYear = Moment().get('year');
    var startYear = Moment().subtract(120, 'years');
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
const _bandwidthUnits = [
    {label: 'KHz', value: 'KHz'},
    {label: 'MHz', value: 'MHz'},
    {label: 'GHz', value: 'GHz'}
]
const _employementStatus = [
    {label: 'Employed', value: 'Employed'},
    {label: 'Unemployed', value: 'Unemployed'}
]
const _employementType = [
    {label: 'Local', value: 'Local'},
    {label: 'Foreign', value: 'Foreign'}
]
const _classOfStation =[
    {label: 'RT', value: 'RT'},
    {label: 'FX', value: 'FX'},
    {label: 'FB', value: 'FB'},
    {label: 'ML', value: 'ML'},
    {label: 'P', value: 'P'},
    {label: 'Others', value: 'Others'},
]
const GUEST_USER = {
    email: 'guest.ntcedge@ustp.edu.ph',
    password: 'AZaz09!@',
};


const NTCServices = [
    {
        title: 'Accreditations',
        key: 'accreditations',
        logo: require('@assets/services/certificate.png'),
        data: [
            {
                "_id": "61c400e8ad8d7afe8ee5f627",
                "createdAt": "2021-12-09T08:41:51.626Z",
                "name": "Customer Premises Equipment Supplier Accreditation",
                "serviceCode": "service-15",
                "about": {
                    "heading": "Customer Premises Equipment Supplier Accreditation",
                    "description": "An Accreditation for Customer Premises Equipment Supplier is a written authority issued by the Commission to a person, firm, company, association or corporation authorizing the holder thereof to engage in the acquisition, servicing, maintenance, purchase or sale of equipment located in the premises of a customer which is not part of but connected to the system or network of a public telecommunications entity.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals and Private Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "NEW",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "registration-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit\n\nNote : The purpose of the company as indicated in its registration document must include information related to the accreditation applied for.",
                                "required": true
                            },
                            {
                                "key": "paid-up-capital",
                                "title": "Proof of Paid-Up Capital",
                                "description": "Minimum of PHP 250,000.00, duly certified by the Treasurer of the Corporation or by the partners in a partnership or by the owner in a sole proprietorship",
                                "required": true
                            },
                            {
                                "key": "distributorship-or-representation-agreement",
                                "title": "Distributorship OR Representation Agreement on products to be sold",
                                "required": true,
                            },
                            {
                                "key": "type-approval-certificate-or-grant-of-equipment-conformity",
                                "title": "Type Approval Certificate OR Copy of Grant of Equipment Conformity for CPE to be sold",
                                "required": true,
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment AND copy of valid ROC/license of two (2) qualified radio technicians (i.e. Radio Communications Technician OR Electronics Technician) employed on a full-time basis",
                                "required": true,
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license of supervising Electronics Engineer (ECE) OR Professional Electronics Engineer (PECE)",
                                "required": true,
                            }
                        ],
                        "serviceCode": "CPE",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "RENEWAL",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "CPE-supplier-accreditation",
                                "title": "CPE Supplier Accreditation",
                                "required": true
                            },
                            {
                                "key": "business-or-mayors-permit",
                                "title": "Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "distributorship-or-representation-agreement",
                                "title": "Distributorship OR Representation Agreement on products to be sold",
                                "required": true,
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment AND copy of valid ROC/license of two (2) qualified radio technicians (i.e. Radio Communications Technician OR Electronics Technician) employed on a full-time basis",
                                "required": true,
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license of supervising Electronics Engineer (ECE) OR Professional Electronics Engineer (PECE)",
                                "required": true,
                            }
                        ],
                        "serviceCode": "CPE",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "MODIFICATION",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "CPE-supplier-accreditation",
                                "title": "CPE Supplier Accreditation",
                                "required": true
                            },
                            {
                                "key": "type-approval-certificate-or-grant-of-equipment",
                                "title": "For equipment not previously indicated in the CPE Supplier Accreditation:",
                                "description": "Copy of Type Approval Certificate OR Copy of Grant of Equipment Conformity for CPE to be sold",
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of name",
                                "value": "Change of name",
                                "requirements": [
                                    {
                                        "key": "CPE-supplier-accreditation",
                                        "title": "CPE Supplier Accreditation",
                                        "required": true
                                    },
                                    {
                                        "key": "type-approval-certificate-or-grant-of-equipment",
                                        "title": "For equipment not previously indicated in the CPE Supplier Accreditation:",
                                        "description": "Copy of Type Approval Certificate OR Copy of Grant of Equipment Conformity for CPE to be sold",
                                    },
                                    {
                                        "key": "registration-document",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Valid Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of company address",
                                "value": "Change of company address",
                                "requirements": [
                                    {
                                        "key": "CPE-supplier-accreditation",
                                        "title": "CPE Supplier Accreditation",
                                        "required": true
                                    },
                                    {
                                        "key": "type-approval-certificate-or-grant-of-equipment",
                                        "title": "For equipment not previously indicated in the CPE Supplier Accreditation:",
                                        "description": "Copy of Type Approval Certificate OR Copy of Grant of Equipment Conformity for CPE to be sold",
                                    },
                                    {
                                        "key": "business-or-mayors-permit",
                                        "title": "Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "CPE",
                        "sequenceCode": "NTCX"
                    },
                ]
            },
        ],
    },
    {
        title: 'Certificates',
        key: 'certificates',
        logo: require('@assets/services/certificate.png'),
        data: [
            {
                "_id": "61c400d8ad8d7afe9ee5f617",
                "createdAt": "2021-12-09T08:40:51.621Z",
                "name": "Radio Operator Certificates (ROC) excluding Amateur ROC",
                "serviceCode": "service-2",
                "about": {
                    "heading": "Radio Operator Certificates (ROC) excluding Amateur ROC",
                    "description": "A Radio Operator Certificate is a written authority issued by the Commission authorizing the holder thereof to operate a particular class of radio station under a specific radio service.\n\nThe RENEWAL of a Radio Operator Certificate is required for the continuous operation of a particular class of radio station under a specific radio service.\n\nThe MODIFICATION of a Radio Operator Certificate is required for changes in the particulars indicated in the Certificate.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals who have passed the Commercial Radio Operator's Examination conducted by NTC"
                        },
                        {
                            "title": "Commercial pilots and student pilots"
                        },
                        {
                            "title": "Government radio operators who have completed the Government Radio Operator's Seminar conducted by NTC"
                        },
                        {
                            "title": "Individuals working in the maritime service who have completed the Special Radio Operator's Seminar conducted by NTC"
                        },
                        {
                            "title": "Individuals who have completed the Restricted Land Mobile Radiotelephone Operator's Seminar conducted by NTC"
                        },
                        {
                            "title": "Licensed pilots of foreign countries"
                        }
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Commercial Radio Operator Certificate (NEW)",
                        "elements": [
                            "1RTG",
                            "2RTG",
                            "3RTG",
                            "1PHN",
                            "2PHN",
                            "3PHN"
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "report-of-rating",
                                "title": "Original valid Report of Rating",
                                "description": "Note 1: Apply for Duplicate Copy if Original is lost/mutilated/destroyed or not available.",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "roc",
                                "title": "For upgrade to higher class, Radio Operator Certificate"
                            }
                        ],
                        "serviceCode": "ROC",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "Commercial Radio Operator Certificate (RENEWAL)",
                        "elements": [
                            "1RTG",
                            "2RTG",
                            "3RTG",
                            "1PHN",
                            "2PHN",
                            "3PHN"
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            }
                        ],
                        "serviceCode": "ROC",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "Commercial Radio Operator Certificate (MODIFICATION)",
                        "elements": [
                            "1RTG",
                            "2RTG",
                            "3RTG",
                            "1PHN",
                            "2PHN",
                            "3PHN"
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "id",
                                "title": "For correction of name, ANY of the following:",
                                "description": "• Valid government ID\n• Birth Certificate\n• Marriage Certificate"
                            }
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Others",
                                "value": "Others",
                                "hasSpecification": true,
                            },
                        ],
                        "serviceCode": "ROC",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "Restricted Radiotelephone Operator's Certificate - Aircraft (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "report-of-rating",
                                "title": "Original valid Report of Rating",
                                "description": "Note 1: Apply for Duplicate Copy if Original is lost/mutilated/destroyed or not available.",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "RROC-AIRCRAFT",
                        "sequenceCode": "RMAP"
                    },
                    {
                        "label": "Restricted Radiotelephone Operator's Certificate - Aircraft (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            }
                        ],
                        "serviceCode": "RROC-AIRCRAFT",
                        "sequenceCode": "RMAP"
                    },
                    {
                        "label": "Restricted Radiotelephone Operator's Certificate - Aircraft (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "id",
                                "title": "For correction of name, ANY of the following:",
                                "description": "• Valid government ID\n• Birth Certificate\n• Marriage Certificate"
                            }
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Others",
                                "value": "Others",
                                "hasSpecification": true,
                            },
                        ],
                        "serviceCode": "RROC-AIRCRAFT",
                        "sequenceCode": "RMAP"
                    },
                    {
                        "label": "Temporary Radio Operator Certificate for Foreign Pilot (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "pilot-license",
                                "title": "Pilot license issued from country of origin",
                                "description": "Note 1: The applicant has to show the original.",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "ROC",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "Temporary Radio Operator Certificate for Foreign Pilot (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "id",
                                "title": "For correction of name, ANY of the following:",
                                "description": "• Valid government ID\n• Birth Certificate\n• Marriage Certificate"
                            }
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Others",
                                "value": "Others",
                                "hasSpecification": true,
                            },
                        ],
                        "serviceCode": "ROC-TEMPORARY",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "Government Radio Operator Certificate (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "service-record",
                                "title": "Service Record",
                                "required": true
                            },
                            {
                                "key": "good-moral-certificate",
                                "title": "Certificate of Good Moral Character",
                                "required": true
                            },
                            {
                                "key": "roc",
                                "title": "Certification that the applicant is in the government service as a radio operator for at least six (6) months and duly certified by the Head of Office",
                                "required": true
                            },
                            {
                                "key": "seminar-completion-certificate",
                                "title": "Certificate of Completion of Seminar",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "GROC",
                        "sequenceCode": "GOV"
                    },
                    {
                        "label": "Government Radio Operator Certificate (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "GROC",
                        "sequenceCode": "GOV"
                    },
                    {
                        "label": "Government Radio Operator Certificate (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "id",
                                "title": "For correction of name, ANY of the following:",
                                "description": "• Valid government ID\n• Birth Certificate\n• Marriage Certificate"
                            }
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Others",
                                "value": "Others",
                                "hasSpecification": true,
                            },
                        ],
                        "serviceCode": "GROC",
                        "sequenceCode": "GOV"
                    },
                    {
                        "label": "Restricted Radiotelephone Operator's Certificate for Land Mobile Station (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "seminar-completion-certificate",
                                "title": "Certificate of Completion of Seminar",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "RROC-RLM",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "Restricted Radiotelephone Operator's Certificate for Land Mobile Station (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "RROC-RLM",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "Restricted Radiotelephone Operator's Certificate for Land Mobile Station (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "id",
                                "title": "For correction of name, ANY of the following:",
                                "description": "• Valid government ID\n• Birth Certificate\n• Marriage Certificate"
                            }
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Others",
                                "value": "Others",
                                "hasSpecification": true,
                            },
                        ],
                        "serviceCode": "RROC-RLM",
                        "sequenceCode": "NTCX"
                    },
                    {
                        "label": "Special Radio Operator Certificate (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "seminar-completion-certificate",
                                "title": "Certificate of Completion of Seminar",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "SROP",
                        "sequenceCode": "SROP"
                    },
                    {
                        "label": "Special Radio Operator Certificate (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "SROP",
                        "sequenceCode": "SROP"
                    },
                    {
                        "label": "Special Radio Operator Certificate (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-02",
                        "requirements": [
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "id",
                                "title": "For correction of name, ANY of the following:",
                                "description": "• Valid government ID\n• Birth Certificate\n• Marriage Certificate"
                            }
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Others",
                                "value": "Others",
                                "hasSpecification": true,
                            },
                        ],
                        "serviceCode": "SROP",
                        "sequenceCode": "SROP"
                    },
                ]
            },
            {
                "_id": "61c400d8ad8d7afe9ee6f617",
                "createdAt": "2021-12-09T09:40:51.621Z",
                "name": "Certificates in the Amateur Service",
                "serviceCode": "service-3",
                "about": {
                    "heading": "Certificates in the Amateur Service",
                    "description": "The Amateur Radio Operator Certificate is a written authority issued by the Commission to a person or a club authorizing the holder thereof to operate a class of radio station in the Amateur Service.\n\nThe RENEWAL of Amateur Radio Operator Certificate is required for the continuous operation of any class of radio stations in the Amateur Service.\n\nThe MODIFICATION of Amateur Radio Operator Certificate is required for changes in the particulars indicated in the Certificate.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals who have passed the Amateur Radio Operator Examination conducted by NTC"
                        },
                        {
                            "title": "Duly accredited amateur radio clubs"
                        },
                        {
                            "title": "Foreign amateurs qualified under the reciprocity agreement"
                        },
                        {
                            "title": "Licensed amateur radio operators"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Amateur Radio Operator Certificate (NEW)",
                        "elements": [],
                        "formCode": "ntc1-03-AT-ROC",
                        "requirements": [
                            {
                                "key": "report-of-rating",
                                "title": "Valid Report of Rating",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "AT-ROC"
                    },
                    {
                        "label": "Amateur Radio Operator Certificate (RENEWAL)",
                        "elements": [],
                        "formCode": "ntc1-03-AT-ROC",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Amateur Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "amateur-activities-proof",
                                "title": "Proof of Amateur Activities",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            }
                        ],
                        "serviceCode": "AT-ROC"
                    },
                    {
                        "label": "Amateur Radio Operator Certificate (MODIFICATION)",
                        "elements": [],
                        "formCode": "ntc1-03-AT-ROC",
                        "requirements": [
                            {
                                "key": "amateur-roc",
                                "title": "Amateur Radio Operator Certificate",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "report-of-rating",
                                "title": "For upgrade to higher class, valid Report of Rating"
                            }
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Others",
                                "value": "Others",
                                "hasSpecification": true,
                            },
                        ],
                        "serviceCode": "AT-ROC"
                    },
                    {
                        "label": "Lifetime Amateur Radio Station Supplementary Certificate (MODIFICATION)",
                        "elements": [],
                        "formCode": "ntc1-03-AT-ROC",
                        "requirements": [
                            {
                                "key": "supplementary-certificate",
                                "title": "Supplementary Certificate",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Additional Equipment",
                                "value": "Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "supplementary-certificate",
                                        "title": "Supplementary Certificate",
                                        "required": true
                                    },
                                    {
                                        "key": "purchase-possess-permit",
                                        "title": "Permit to Purchase/Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For equipment from licensed Amateur, Permit to Sell/Transfer",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Deletion of Equipment",
                                "value": "Deletion of Equipment",
                                "requirements": [
                                    {
                                        "key": "supplementary-certificate",
                                        "title": "Supplementary Certificate",
                                        "required": true
                                    },
                                    {
                                        "key": "equipment-deletion-proof",
                                        "title": "If deletion of equipment is due to:",
                                        "description": "(a) Lost, Original Affidavit of Loss of Equipment\n(b) Storage, Permit to Purchase/Possess\n(c) Sell/Transfer, Permit to Sell/Transfer",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "AT-LIFETIME",
                    },
                ],
            },
            {
                "_id": "61c400d8ad8e7afe9ee6f617",
                "createdAt": "2021-12-09T09:40:51.721Z",
                "name": "Certificate of Registration for RFID, SRD, WDN Devices - Indoor",
                "serviceCode": "service-16",
                "about": {
                    "heading": "Certificate of Registration for RFID, SRD, WDN Devices - Indoor",
                    "description": "A Certificate of Registration is a written authority issued by the Commission to an individual, accredited radio dealer/manufacturer, private and government entities for the registration of Radio Frequency Identification (RFID) Devices, Short Range Devices (SRD), or Wireless Data Network (WDN) Devices – Indoor.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals, Accredited Radio Dealers/Manufacturers, and Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "For Dealers",
                        "elements": [],
                        "formCode": "ntc1-19",
                        "requirements": [
                            {
                                "key": "dealer-manufacturer-permit",
                                "title": "Dealer Permit OR Manufacturer Permit",
                                "required": true,
                            },
                            {
                                "key": "imported-equipment-documents",
                                "title": "For imported equipment:",
                                "description": "(a) Permit to Import\n(b) Invoice\n(c) Bureau of Customs (BOC) Release Clearance and Import Entry Declaration",
                            },
                            {
                                "key": "sales-stocks-report",
                                "title": "For locally-manufactured equipment:",
                                "description": "Sales and Stocks Report",
                            },
                        ],
                        "serviceCode": "REG",
                    },
                    {
                        "label": "For Non-Dealers",
                        "elements": [],
                        "formCode": "ntc1-19",
                        "requirements": [
                            {
                                "key": "imported-equipment-documents",
                                "title": "For imported equipment:",
                                "description": "(a) Permit to Import\n(b) Invoice\n(c) Bureau of Customs (BOC) Release Clearance and Import Entry Declaration",
                            },
                            {
                                "key": "sales-stocks-report",
                                "title": "For locally-manufactured equipment:",
                                "description": "Sales and Stocks Report",
                            },
                        ],
                        "serviceCode": "REG"
                    },
                ],
            },
            {
                "_id": "61c400d8ad8e7afe9ee6f627",
                "createdAt": "2021-12-09T09:51:51.721Z",
                "name": "TVRO Registration Certificate",
                "serviceCode": "service-17",
                "about": {
                    "heading": "TVRO Registration Certificate",
                    "description": "A TVRO Registration Certificate is a certificate or a written authority issued by the Commission to a person, firm, company, association, or corporation authorizing the holder thereof to possess television receive-only equipment.",
                    "whoMayAvail": [
                        {
                            "title": "Cable TV Operators and Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "TVRO Registration Certificate (Commercial)",
                        "elements": [],
                        "formCode": "ntc1-22-certificate",
                        "requirements": [
                            {
                                "key": "provisional-authority",
                                "title": "Provisional Authority (PA) OR duly received Motion for Renewal of PA",
                                "required": true,
                            },
                            {
                                "key": "head-end-equipment-list",
                                "title": "List of Combiner, Satellite Receivers, Modulators, LNA/LNB and other Head-End Equipment",
                                "description": "Prepared and signed by a duly licensed Professional Electronics Engineer (PECE) / Electronics Engineer (ECE)",
                                "required": true,
                            },
                        ],
                        "serviceCode": "TVRO-REG",
                        "category": "commercial",
                        "sequenceCode": "TVROCERT",
                    },
                    {
                        "label": "TVRO Registration Certificate (Non-Commercial)",
                        "elements": [],
                        "formCode": "ntc1-22-certificate",
                        "requirements": [
                            {
                                "key": "head-end-equipment-list",
                                "title": "List of Combiner, Satellite Receivers, Modulators, LNA/LNB and other Head-End Equipment",
                                "description": "Prepared and signed by a duly licensed Professional Electronics Engineer (PECE) / Electronics Engineer (ECE)",
                                "required": true,
                            },
                        ],
                        "serviceCode": "TVRO-REG",
                        "category": "non-commercial",
                        "sequenceCode": "TVROCERT",
                    },
                ],
            },
            {
                "_id": "61c400d8ad8e7afe9ee6f628",
                "createdAt": "2021-12-09T09:51:51.821Z",
                "name": "Certificate of Registration as a Value-Added Service (VAS) Provider",
                "serviceCode": "service-19",
                "about": {
                    "heading": "Certificate of Registration as a Value-Added Service (VAS) Provider",
                    "description": "The Certificate of Registration as a VAS Provider is a written authority issued by the Commission to an individual, private and government entities authorizing the holder thereof to offer value added services.\n\nThe RENEWAL of a Certificate of Registration is required for the continuous operation as a VAS Provider.",
                    "whoMayAvail": [
                        {
                            "title": "Private Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "RENEWAL",
                        "elements": [],
                        "formCode": "ntc1-20",
                        "requirements": [
                            {
                                "key": "certificate-of-registration",
                                "title": "Certificate of Registration",
                                "required": true,
                            },
                            {
                                "key": "lease-agreement",
                                "title": "Facilities/network lease agreement with duly authorized facilities/network providers",
                                "required": true,
                            },
                            {
                                "key": "vas-provider-quaterly-report",
                                "title": "Quarterly Report(s) of VAS Provider",
                                "required": true,
                            }
                        ],
                        "serviceCode": "VAS"
                    },
                ],
            },

            /*
      {
        "_id": "61c500e8ad8d7afe8ee5f629",
        "createdAt": "2021-12-09T09:40:51.656Z",
        "name": "Certificates thru the Philippine National Single Window",
        "serviceCode": "service-20",
        "about": {
          "heading": "Certificates thru the Philippine National Single Window",
          "description": "A Certificate of Exemption is a written authority issued by the Commission to an individual, accredited CPE supplier, and private and government entities for the importation of non-customer premises equipment (CPE).",
          "whoMayAvail": [
            {
              "title": "Individuals"
            },
            {
              "title": "Accredited CPE Suppliers"
            },
            {
              "title": "Private and Government Entities"
            },
          ]
        },
        "applicationTypes": [
          {
            "label": "Certificate of Exemption for Non-Customer Premises Equipment",
            "elements": [
            ],
            "formCode": "ntc1-00",
            "requirements": [
              {
                "key": "proforma-or-commercial-invoice",
                "title": "Proforma/Commercial Invoice",
                "required": true
              },
              {
                "key": "approval-certificate",
                "title": "For CPE Supplier OR Personal/Company Use, ANY of the following:",
                "description": "• Type Approval Certificate\n• Type Acceptance Certificate\n• Grant of Equipment Conformity\n\nNote 1: CPE includes Indoor WDN equipment and Short Range Devices(SRD)",
                "required": true
              },
              {
                "key": "equipment-datasheet",
                "title": "For Demonstration and/or Testing:",
                "description": "Datasheet of proposed equipment",
              },
            ],
            "serviceCode": "CERT",
          },
        ]
      },
      */

            {
                "_id": "71c500e8ad8d7afe8ee5f629",
                "createdAt": "2021-12-09T09:41:51.656Z",
                "name": "Copy of Certificates",
                "serviceCode": "service-21",
                "about": {
                    "heading": "Copy of Certificates",
                    "description": "A Certified True Copy of a Certificate is issued by the Commission to individuals, private and government entities upon request of the holder to authenticate copy of the same.\n\nA Duplicate Copy of a Certificate is issued by the Commission to individuals, private and government entities upon request of the holder for the re-issuance of the same.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals"
                        },
                        {
                            "title": "Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Certified True Copy",
                        "elements": [
                        ],
                        "formCode": "ntc1-ctc-certificate",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Copy of document to be authenticated",
                                "required": true
                            },
                        ],
                        "serviceCode": "CTC",
                        "category": "certificate",
                    },
                    {
                        "label": "Duplicate Copy",
                        "elements": [
                        ],
                        "formCode": "ntc1-21-certificate",
                        "requirements": [
                            {
                                "key": "id-picture",
                                "title": "For Radio Operator Certificate:",
                                "description": "Clear ID picture taken within the last six (6) months",
                            },
                        ],
                        "serviceCode": "DUP",
                        "category": "certificate",
                    },
                ]
            },
        ],
    },
    {
        title: 'Exams',
        key: 'exams',
        logo: require('@assets/services/exam.png'),
        data: [
            {
                "_id": "61c400d8ad8d7afe9ee5f616",
                "createdAt": "2021-12-09T08:40:51.620Z",
                "name": "Admission Slip for Radio Operator Examination",
                "serviceCode": "service-1",
                "about": {
                    "heading": "Admission Slip for Radio Operator Examination",
                    "description": "The Admission Slip is a document issued by the Commission to a qualified applicant authorizing the holder thereof to take the commercial or non-commercial radio operator examination.",
                    "whoMayAvail": [
                        {
                            "title": "Restricted Radio Operator Certificate (RROC) - Aircraft",
                            "list": [
                                "Commercial pilots",
                                "Student pilots"
                            ]
                        },
                        {
                            "title": "Radiotelephone/Radiotelegraph",
                            "list": [
                                "Graduates of General Radio Communication Operator (GRCO)",
                                "Graduates of Industrial Electronics Technician Course (IETC)",
                                "Graduates of Communications Technician Course (CTC)",
                                "Graduates of Bachelor of Science in Avionics Technology (BS AVTECH)",
                                "Graduates of Bachelor of Science in Electronics and Communications Engineering; Bachelor of Science in Electronics Engineering (BS ECE)"
                            ]
                        },
                        {
                            "title": "Amateur",
                            "list": [
                                "Radio enthusiasts",
                                "Licensed amateurs and commercial operators (for upgrading)",
                                "Registered ECE"
                            ]
                        }
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Radiotelegraphy",
                        "elements": [
                            "1RTG - Elements 1, 2, 5, 6 & Code (25/20 wpm)",
                            "1RTG - For removal , Code (25/20 wpm)",
                            "1RTG - For upgrade (2RTG Holder) & Code (25/20 wpm)",
                            "2RTG - Elements 1, 2, 5, 6 & Code (16 wpm)",
                            "2RTG - For removal, Code (16 wpm)",
                            "2RTG - For upgrade (3RTG Holder) , Element 6"
                        ],
                        "formCode": "ntc1-01",
                        "requirements": [
                            {
                                "key": "id",
                                "title": "ANY of the following:",
                                "description": "• Birth Certificate\n• Baptismal Certificate\n• Passport\n• PRC License\n• Driver's License\n• any document which can serve as the basis for age requirement",
                                "required": true
                            },
                            {
                                "key": "tor",
                                "title": "Transcript of Records with Special Order (SO)",
                                "description": "Note 1: The applicant has to show the original copy.\nNote 2: SO is not required for State Universities/Colleges",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "roc",
                                "title": "For upgrade to higher class, Radio Operator Certificate"
                            }
                        ],
                    },
                    {
                        "label": "Radiotelephony",
                        "elements": [
                            "1PHN - Elements 1, 2, 3 & 4",
                            "1PHN - For upgrade (2PHN Holder) , Element 4",
                            "1PHN - For upgrade (3PHN Holder), Element 3 & 4"
                        ],
                        "formCode": "ntc1-01",
                        "requirements": [
                            {
                                "key": "id",
                                "title": "ANY of the following:",
                                "description": "• Birth Certificate\n• Baptismal Certificate\n• Passport\n• PRC License\n• Driver's License\n• any document which can serve as the basis for age requirement",
                                "required": true
                            },
                            {
                                "key": "tor",
                                "title": "Transcript of Records with Special Order (SO)",
                                "description": "Note 1: The applicant has to show the original copy.\nNote 2: SO is not required for State Universities/Colleges",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "roc",
                                "title": "For upgrade to higher class, Radio Operator Certificate"
                            }
                        ]
                    },
                    {
                        "label": "Amateur",
                        "elements": [
                            "Class A - Elements 8, 9, 10 & Code (5 wpm)",
                            "Class A - For removal, Code (5 wmp)",
                            "Class B - Elements 5, 6 & 7",
                            "Class B - For Registered ECE, 1PHN, 1RTG & 2RTG , Element 2",
                            "Class C - Elements 2, 3 & 4",
                            "Class C - For Class D Holder, Elements 3 & 4",
                            "Class D - Element 2"
                        ],
                        "formCode": "ntc1-01",
                        "requirements": [
                            {
                                "key": "id",
                                "title": "ANY of the following:",
                                "description": "• Birth Certificate\n• Baptismal Certificate\n• Passport\n• PRC License\n• Driver's License\n• any document which can serve as the basis for age requirement",
                                "required": true
                            },
                            {
                                "key": "attendance",
                                "title": "Proof of attendance of seminar conducted by NTC accredited Amateur Radio Club",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                            {
                                "key": "roc",
                                "title": "For upgrade to higher class, Radio Operator Certificate"
                            }
                        ]
                    },
                    {
                        "label": "Restricted Radio Operator Certificate - Aircraft",
                        "elements": [
                            "RROC - Aircraft - Element 1"
                        ],
                        "formCode": "ntc1-01",
                        "requirements": [
                            {
                                "key": "pilot-license",
                                "title": "Aircraft pilot's license or student pilot's license issued by the Civil Aviation Authority of the Philippines (CAAP) / Pilot license issued by the aviation authority of the Administration for foreign applicants",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            }
                        ]
                    }
                ]
            },
        ],
    },
    {
        title: 'Licenses',
        key: 'licenses',
        logo: require('@assets/services/license.png'),
        data: [
            {
                "_id": "61c400d8ad8d7afe8ee5f617",
                "createdAt": "2021-12-09T08:40:51.621Z",
                "name": "Licenses in the Amateur Service",
                "serviceCode": "service-3",
                "about": {
                    "heading": "Licenses in the Amateur Service",
                    "description": "The Amateur Radio Station License is a written authority issued by the Commission to a person or a club authorizing the holder thereof to operate a class of radio station in the Amateur Service.\n\nThe RENEWAL of Amateur Radio Station License is required for the continuous operation of any class of radio stations in the Amateur Service.\n\nThe MODIFICATION of Amateur Radio Station License is required for changes in the particulars indicated in the License.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals who have passed the Amateur Radio Operator Examination conducted by NTC"
                        },
                        {
                            "title": "Duly accredited amateur radio clubs"
                        },
                        {
                            "title": "Foreign amateurs qualified under the reciprocity agreement"
                        },
                        {
                            "title": "Licensed amateur radio operators"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Amateur Radio Station License (NEW)",
                        "elements": [
                            "Class A",
                            "Class B",
                            "Class C",
                            "Class D",
                        ],
                        "formCode": "ntc1-03-AT-RSL",
                        "requirements": [
                            {
                                "key": "purchase-possess-permit",
                                "title": "Permit to Purchase/Possess",
                                "required": true
                            },
                            {
                                "key": "amateur-roc",
                                "title": "For Amateur Radio Operator Certificate (AT-ROC) holders:",
                                "description": "Valid AT-ROC"
                            },
                            {
                                "key": "source-of-equipment-proof",
                                "title": "Copy of document indicating source of equipment:",
                                "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For equipment from licensed Amateur, Permit to Sell/Transfer AND Original AT-RSL of the Seller\nNote 1: Apply for Duplicate Copy if Original is lost/mutilated/destroyed or not available.",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "AT-RSL",
                        "sequenceCode": "AT",
                    },
                    {
                        "label": "Amateur Radio Station License (RENEWAL)",
                        "elements": [
                            "Class A",
                            "Class B",
                            "Class C",
                            "Class D",
                        ],
                        "formCode": "ntc1-03-AT-RSL",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Valid Amateur Radio Station License",
                                "required": true
                            },
                            {
                                "key": "amateur-activities-proof",
                                "title": "Proof of Amateur Activities",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            }
                        ],
                        "serviceCode": "AT-RSL",
                        "sequenceCode": "AT",
                    },
                    {
                        "label": "Amateur Radio Station License (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-03-AT-RSL",
                        "modificationDueTos": [
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "amateur-rsl",
                                        "title": "Valid Amateur Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "id-picture",
                                        "title": "Clear ID picture taken within the last six (6) months",
                                        "required": true
                                    },
                                    {
                                        "key": "purchase-possess-permit",
                                        "title": "Permit to Purchase/Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For equipment from licensed Amateur, Permit to Sell/Transfer",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Upgrading",
                                "value": "Upgrading",
                                "requirements": [
                                    {
                                        "key": "amateur-rsl",
                                        "title": "Valid Amateur Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "id-picture",
                                        "title": "Clear ID picture taken within the last six (6) months",
                                        "required": true
                                    },
                                    {
                                        "key": "report-of-rating",
                                        "title": "Valid Report of Rating",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Deletion of Equipment",
                                "value": "Deletion of Equipment",
                                "requirements": [
                                    {
                                        "key": "amateur-rsl",
                                        "title": "Valid Amateur Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "id-picture",
                                        "title": "Clear ID picture taken within the last six (6) months",
                                        "required": true
                                    },
                                    {
                                        "key": "equipment-deletion-proof",
                                        "title": "If deletion of equipment is due to:",
                                        "description": "(a) Lost, Original Affidavit of Loss of Equipment\n(b) Storage, Permit to Purchase/Possess\n(c) Sell/Transfer, Permit to Sell/Transfer",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "requirements": [
                            {
                                "key": "amateur-rsl",
                                "title": "Valid Amateur Radio Station License",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "AT-RSL",
                        "sequenceCode": "AT",
                    },
                    {
                        "label": "Lifetime Amateur Radio Station License for Class A",
                        "elements": [
                        ],
                        "formCode": "ntc1-00",
                        "requirements": [
                            {
                                "key": "letter-request",
                                "title": "Letter request for Issuance of a Lifetime Radio Station License",
                                "required": true
                            },
                            {
                                "key": "good-standing-certificate",
                                "title": "Certificate of Good Standing as a Member from a registered amateur club or association with the NTC",
                                "required": true
                            },
                            {
                                "key": "id",
                                "title": "Copy of ANY of the following:",
                                "description": "• Birth Certificate\n• Passport\n• PRC License\n• Driver's License\nNote 1: The applicant has to show the Original.\nNote 2: Applicant must be at least 60 years of age.",
                                "required": true
                            },
                            {
                                "key": "rsl",
                                "title": "Amateur Class 'A' Radio Station License",
                                "required": true
                            },
                            {
                                "key": "amateur-service-proof",
                                "title": "Proof of amateur service of at least fifteen (15) consecutive years",
                                "required": true
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "AT-LIFETIME",
                        "sequenceCode": "AT",
                    },
                    {
                        "label": "Amateur Club Radio Station License (NEW)",
                        "elements": [],
                        "formCode": "ntc1-03-AT-CLUB-RSL",
                        "requirements": [
                            {
                                "key": "purchase-possess-permit",
                                "title": "Permit to Purchase/Possess",
                                "required": true
                            },
                            {
                                "key": "source-of-equipment-proof",
                                "title": "Copy of document indicating source of equipment:",
                                "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For equipment from licensed Amateur, Permit to Sell/Transfer",
                                "required": true
                            },
                        ],
                        "serviceCode": "AT-CLUB-RSL",
                        "sequenceCode": "AT",
                    },
                    {
                        "label": "Amateur Club Radio Station License (RENEWAL)",
                        "elements": [],
                        "formCode": "ntc1-03-AT-CLUB-RSL",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Amateur Club Radio Station License",
                                "required": true
                            },
                            {
                                "key": "organization-list",
                                "title": "List providing the licensed Amateur Club Trustee, Officers and Members of the organization",
                                "description": "Note 1: List must contain a minimum membership of twenty-five (25) duly licensed amateur radio operators.\nNote 2: The licenses of prospective members shall be validated.\nNote 3: The Amateur Club Trustee designated by the Club must be a licensed Class A for at least five (5) years.\nNote 4: The Amateur Fixed Station shall be issued only to the Club Trustee",
                                "required": true,
                            },
                        ],
                        "serviceCode": "AT-CLUB-RSL",
                        "sequenceCode": "AT",
                    },
                    {
                        "label": "Amateur Club Radio Station License (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-03-AT-CLUB-RSL",
                        "modificationDueTos": [
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "amateur-club-rsl",
                                        "title": "Amateur Club Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "purchase-possess-permit",
                                        "title": "Permit to Purchase/Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For equipment from licensed Amateur, Permit to Sell/Transfer",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Deletion of Equipment",
                                "value": "Deletion of Equipment",
                                "requirements": [
                                    {
                                        "key": "amateur-club-rsl",
                                        "title": "Amateur Club Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "equipment-deletion-proof",
                                        "title": "If deletion of equipment is due to:",
                                        "description": "(a) Lost, Original Affidavit of Loss of Equipment\n(b) Storage, Permit to Purchase/Possess\n(c) Sell/Transfer, Permit to Sell/Transfer",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Club Trustee",
                                "value": "Change of Club Trustee",
                                "requirements": [
                                    {
                                        "key": "amateur-club-rsl",
                                        "title": "Amateur Club Radio Station License",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of station location",
                                "value": "Change of station location",
                                "requirements": [
                                    {
                                        "key": "amateur-club-rsl",
                                        "title": "Amateur Club Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "map",
                                        "title": "Map showing the location with geographical coordinates, as applicable",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "requirements": [
                            {
                                "key": "amateur-club-rsl",
                                "title": "Amateur Club Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "AT-CLUB-RSL",
                        "sequenceCode": "AT",
                    },
                ]
            },
            {
                "_id": "61c400d8ad8d7afe9ee5f617",
                "createdAt": "2021-12-09T08:40:51.622Z",
                "name": "Licenses in the Aeronautical Service",
                "serviceCode": "service-4",
                "about": {
                    "heading": "Licenses in the Aeronautical Service",
                    "description": "A Fixed Aeronautical Station License is a written authority issued by the Commission to an individual, private and government entities authorizing the holder thereof to operate an aeronautical fixed station in the Aeronautical Fixed Service.\n\nAn Aircraft Station License is a written authority issued by the Commission to an individual or private or government entities authorizing the holder thereof to operate a mobile station installed onboard any type of aircraft.\n\nThe RENEWAL of Fixed Aeronautical Station License or Aircraft Station License is required for the continuous operation of an existing radio station.\n\nThe MODIFICATION of Fixed Aeronautical Station License or Aircraft Station License is required for changes in the particulars indicated in the License.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals and Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Fixed Aeronautical Station License (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-ASL",
                        "requirements": [
                            {
                                "key": "aircraft-rsl",
                                "title": "Authenticated copy of existing aircraft station license",
                                "required": true,
                            },
                            {
                                "key": "purchase-possess-permit",
                                "title": "Permit to Purchase/Possess",
                                "required": true
                            },
                            {
                                "key": "source-of-equipment-proof",
                                "title": "Copy of document indicating source of equipment:",
                                "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Valid Radio Operator Certificate (at least 2PHN)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            }
                        ],
                        "serviceCode": "FASL",
                        "sequenceCode": "FA",
                    },
                    {
                        "label": "Fixed Aeronautical Station License (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-ASL",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Valid Radio Station License",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Valid Radio Operator Certificate (at least 2PHN)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            }
                        ],
                        "serviceCode": "FASL",
                        "sequenceCode": "FA",
                    },
                    {
                        "label": "Fixed Aeronautical Station License (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-ASL",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate (at least 2PHN)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Licensee",
                                "value": "Change of Licensee",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Valid Radio Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "roc",
                                        "title": "Valid Radio Operator Certificate (at least 2PHN)",
                                        "required": true,
                                    },
                                    {
                                        "key": "certificate-of-employment",
                                        "title": "Certificate of Employment",
                                        "required": true,
                                    },
                                    {
                                        "key": "registration-document",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Valid Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Valid Radio Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "roc",
                                        "title": "Valid Radio Operator Certificate (at least 2PHN)",
                                        "required": true,
                                    },
                                    {
                                        "key": "certificate-of-employment",
                                        "title": "Certificate of Employment",
                                        "required": true,
                                    },
                                    {
                                        "key": "purchase-possess-permit",
                                        "title": "Permit to Purchase/Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "FASL",
                        "sequenceCode": "FA",
                    },
                    {
                        "label": "Aircraft Station License (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-and-09",
                        "requirements": [
                            {
                                "key": "certificate-of-registration",
                                "title": "Valid Certificate of Registration issued by the Civil Aviation Authority of the Philippines (CAAP)",
                                "required": true,
                            },
                            {
                                "key": "rei-inspection-report",
                                "title": "Valid latest Radio, Electronics and Instruments (REI) Inspection Report duly signed by the authorized Technician of the Civil Aviation Authority of the Philippines (CAAP)",
                                // "required": true
                            },
                            {
                                "key": "restricted-roc-aircraft",
                                "title": "Restricted Radio Operator Certificate - Aircraft",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            }
                        ],
                        "serviceCode": "ASL",
                        "sequenceCode": "MA",
                    },
                    {
                        "label": "Aircraft Station License (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-ASL",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Aircraft Station License",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-registration",
                                "title": "Valid Certificate of Registration issued by the Civil Aviation Authority of the Philippines (CAAP)",
                                "required": true,
                            },
                            {
                                "key": "rei-inspection-report",
                                "title": "Valid latest Radio, Electronics and Instruments (REI) Inspection Report duly signed by the authorized Technician of the Civil Aviation Authority of the Philippines (CAAP)",
                                // "required": true
                            },
                            {
                                "key": "restricted-roc-aircraft",
                                "title": "Restricted Radio Operator Certificate - Aircraft",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            }
                        ],
                        "serviceCode": "ASL",
                        "sequenceCode": "MA",
                    },
                    {
                        "label": "Aircraft Station License (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-ASL",
                        "requirements": [
                            {
                                "key": "aircraft-rsl",
                                "title": "Aircraft Station License",
                                "required": true,
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Licensee",
                                "value": "Change of Licensee",
                                "requirements": [
                                    {
                                        "key": "aircraft-rsl",
                                        "title": "Aircraft Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "certificate-of-registration",
                                        "title": "Valid Certificate of Registration issued by the Civil Aviation Authority of the Philippines (CAAP)",
                                        "required": true,
                                    },
                                ],
                            },
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "aircraft-rsl",
                                        "title": "Aircraft Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For registered equipment, Copy of Permit to Possess",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "ASL",
                        "sequenceCode": "MA",
                    },
                ]
            },
            {
                "_id": "61d400d8ad8d7afe9ee5f617",
                "createdAt": "2021-12-09T08:40:51.623Z",
                "name": "Licenses in the Maritime Service",
                "serviceCode": "service-5",
                "about": {
                    "heading": "Licenses in the Maritime Service",
                    "description": "The Ship Station License or Ship Earth Station License is a written authority issued by the Commission to an individual, private and government entities authorizing the holder thereof to operate ship radio station (radio and navigation equipment) in the Maritime Mobile Service.\n\nA Private Coastal Station License is a written authority issued by the Commission to an individual, private and government entities authorizing the holder thereof to operate a radio station in the Maritime Service.\n\nA Public Coastal Station License is a written authority issued by the Commission to a public telecommunications entity (PTEs) authorizing the holder thereof to operate a public coastal station in the Maritime Service.\n\nThe RENEWAL of a Ship Station License or Ship Earth Station License is required for the continuous operation of an existing radio stations.\n\nThe RENEWAL of a Private Coastal Station License is required for the continuous operation of a private coastal station.\n\nThe RENEWAL of Public Coastal Station License is required for the continuous operation of public coastal stations in the Maritime Service.\n\nThe MODIFICATION of a Ship Station License, Ship Earth Station License, or Private Coastal Radio Station License is required for changes in the particulars indicated in the License.\n\nThe MODIFICATION of Public Coastal Station License is required for changes in the particulars indicated in the License.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals and Private and Government Entities"
                        },
                        {
                            "title": "Public Telecommunications Entities (PTEs) who are authorized to engage in public maritime communications service"
                        }
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Ship Station License DOMESTIC Trade (WITHOUT originally-installed equipment) (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-04-SSL",
                        "requirements": [
                            {
                                "key": "ship-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• Certificate of Vessel Registry and Certificate of Ownership issued by the Maritime Industry Authority (MARINA)\n• Permit issued by the Local Government Unit (LGU)",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "description": "(at least 2nd Class Radiotelephone Operator)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                            {
                                "key": "purchase-possess-permit",
                                "title": "Permit to Purchase/Possess",
                                "required": true,
                            },
                            {
                                "key": "source-of-equipment-proof",
                                "title": "Copy of document indicating source of equipment:",
                                "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b)For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import\n(c) For registered equipment, Copy of Permit to Possess",
                                // "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Ship Station License DOMESTIC Trade (WITH originally-installed equipment) (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-04-and-09-SSL",
                        "requirements": [
                            {
                                "key": "ship-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• Copy of Certificate of Vessel Registry and Certificate of Ownership issued by the Maritime Industry Authority (MARINA)\n• Permit issued by the Local Government Unit (LGU)",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "description": "(at least 2nd Class Radiotelephone Operator)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Ship Station License DOMESTIC Trade (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-04-SSL",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Ship Station License",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "description": "(at least 2nd Class Radiotelephone Operator)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Ship Station License DOMESTIC Trade (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-04-SSL",
                        "requirements": [
                            {
                                "key": "ship-station-license",
                                "title": "Ship Station License",
                                "required": true,
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Licensee",
                                "value": "Change of Licensee",
                                "requirements": [
                                    {
                                        "key": "ship-station-license",
                                        "title": "Ship Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "ship-id",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• Copy of Certificate of Philippine Registry and Certificate of Ownership issued by the Maritime Industry Authority (MARINA)\n• Permit issued by the Local Government Unit (LGU)",
                                        "required": true,
                                    },
                                ],
                            },
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "ship-station-license",
                                        "title": "Ship Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "purchase-possess-permit",
                                        "title": "Permit to Purchase/Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For registered equipment, Copy of Permit to Possess",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Ship Station License INTERNATIONAL Trade (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-04-SSL",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Ship Station License",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-philippine-registry",
                                "title": "Certificate of Philippine Registry (CPR) issued by the Maritime Industry Authority (MARINA)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-inclusion",
                                "title": "Certificate of Inclusion from a Recognized Private Operating Agency or Accounting Authority (AA)",
                                "required": true,
                            },
                            {
                                "key": "maintenance-entity",
                                "title": "Shore-Based Maintenance Entity (SBME) Agreement from duly accredited SBME",
                                "required": true,
                            },
                            {
                                "key": "general-operator-certificate",
                                "title": "General Operator Certificate (GOC) of two (2) deck officers (i.e. First Officer, or Second Officer, or Third Officer)",
                                "required": true,
                            },
                            {
                                "key": "contract-of-employment",
                                "title": "Copy of ANY of the following:",
                                "description": "• Contract of Employment of the deck officers issued by the Philippine Overseas Employment Administration (POEA), OR\n• Certificate of Employment issued by Shipping Company",
                                "required": true,
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Ship Earth Station License INTERNATIONAL Trade (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-04-SSL",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Ship Earth Station License",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-philippine-registry",
                                "title": "Certificate of Philippine Registry (CPR) issued by the Maritime Industry Authority (MARINA)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-inclusion",
                                "title": "Certificate of Inclusion from a Recognized Private Operating Agency or Accounting Authority (AA)",
                                "required": true,
                            },
                            {
                                "key": "maintenance-entity",
                                "title": "Shore-Based Maintenance Entity (SBME) Agreement from duly accredited SBME",
                                "required": true,
                            },
                            {
                                "key": "general-operator-certificate",
                                "title": "General Operator Certificate (GOC) of two (2) deck officers (i.e. First Officer, or Second Officer, or Third Officer)",
                                "required": true,
                            },
                            {
                                "key": "contract-of-employment",
                                "title": "Copy of ANY of the following:",
                                "description": "• Contract of Employment of the deck officers issued by the Philippine Overseas Employment Administration (POEA), OR\n• Certificate of Employment issued by Shipping Company",
                                "required": true,
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Ship Station License INTERNATIONAL Trade (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-04-SSL",
                        "requirements": [
                            {
                                "key": "ship-station-license",
                                "title": "Ship Station License",
                                "required": true,
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Others",
                                "value": "Others",
                                "hasSpecification": true,
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Ship Earth Station License INTERNATIONAL Trade (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-04-SSL",
                        "requirements": [
                            {
                                "key": "ship-earth-station-license",
                                "title": "Ship Station License",
                                "required": true,
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Others",
                                "value": "Others",
                                "hasSpecification": true,
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Private Coastal Station License (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-coastal",
                        "requirements": [
                            {
                                "key": "purchase-possess-permit",
                                "title": "Permit to Purchase/Possess",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "description": "(at least 2nd Class Radiotelephone Operator)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                            {
                                "key": "source-of-equipment-proof",
                                "title": "Copy of document indicating source of equipment:",
                                "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b)For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import\n(c) For registered equipment, Copy of Permit to Possess",
                                "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            },
                        ],
                        "serviceCode": "COASTAL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Private Coastal Station License (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-coastal",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Station License",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "description": "(at least 2nd Class Radiotelephone Operator)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            },
                        ],
                        "serviceCode": "COASTAL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Private Coastal Station License (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-coastal",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true,
                            },
                            {
                                "key": "ntc-inspection-report",
                                "title": "NTC Inspection Report of the subject radio station",
                                // "required": true,
                            }
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Licensee",
                                "value": "Change of Licensee",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "registration-id",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit",
                                        "required": true,
                                    },
                                    {
                                        "key": "ntc-inspection-report",
                                        "title": "NTC Inspection Report of the subject radio station",
                                        // "required": true,
                                    }
                                ],
                            },
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "purchase-possess-permit",
                                        "title": "Permit to Purchase/Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For registered equipment, Copy of Permit to Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "ntc-inspection-report",
                                        "title": "NTC Inspection Report of the subject radio station",
                                        // "required": true,
                                    }
                                ],
                            },
                        ],
                        "serviceCode": "COASTAL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Public Coastal Station License (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-coastal",
                        "requirements": [
                            {
                                "key": "purchase-possess-permit",
                                "title": "Permit to Purchase/Possess",
                                "required": true,
                            },
                            {
                                "key": "source-of-equipment-proof",
                                "title": "Copy of document indicating source of equipment:",
                                "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b)For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import\n(c) For registered equipment, Copy of Permit to Possess",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "description": "(at least 2nd Class Radiotelephone Operator)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                        ],
                        "serviceCode": "PUB-COASTAL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Public Coastal Station License (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-coastal",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Station License",
                                "required": true,
                            },
                            {
                                "key": "roc",
                                "title": "Radio Operator Certificate",
                                "description": "(at least 2nd Class Radiotelephone Operator)",
                                "required": true,
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of Employment",
                                "required": true,
                            },
                        ],
                        "serviceCode": "PUB-COASTAL",
                        "sequenceCode": "MS",
                    },
                    {
                        "label": "Public Coastal Station License (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-coastal",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true,
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Licensee",
                                "value": "Change of Licensee",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "registration-id",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit",
                                        "required": true,
                                    },
                                ],
                            },
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "purchase-possess-permit",
                                        "title": "Permit to Purchase/Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For registered equipment, Copy of Permit to Possess",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Location",
                                "value": "Change of Location",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true,
                                    },
                                    {
                                        "key": "engineering-plans",
                                        "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                        "description": "1. Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)\n3. Antenna System Plan (Type, Gain, Diameter, Beamwidth, Azimuth, Height Above Ground, Polarization)",
                                        "required": true,
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "PUB-COASTAL",
                        "sequenceCode": "MS",
                    },
                ]
            },
            {
                "_id": "61d400d8ad8d7aee9ee5f617",
                "createdAt": "2021-12-09T08:40:51.624Z",
                "name": "Licenses for Government and Private Radio Stations in the Fixed and Land Mobile Service",
                "serviceCode": "service-9",
                "about": {
                    "heading": "Licenses for Government and Private Radio Stations in the Fixed and Land Mobile Service",
                    "description": "A Radio Station License is a written authority issued by the Commission to an individual, private and government entities authorizing the holder thereof to operate a radio station.\n\nThe RENEWAL of a Radio Station License is required from an individual or private or government entities for the continuous operation of an existing radio station.\n\nThe MODIFICATION of a Radio Station License is required from the Commission to an individual, private and government entities for changes in the particulars indicated in the License.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals and Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Radio Station License (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-RSL",
                        "requirements": [
                            {
                                "key": "purchase-possess-permit",
                                "title": "Permit to Purchase/Possess",
                                "required": true
                            },
                            {
                                "key": "roc",
                                "title": "Appropriate and valid Radio Operator Certificate",
                                "required": true,
                            },
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "1. Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)\n3. Antenna System Plan (Type, Gain, Diameter, Beamwidth, Azimuth, Height Above Ground, Polarization)",
                                "required": true,
                            },
                            {
                                "key": "source-of-equipment-proof",
                                "title": "Copy of document indicating source of equipment:",
                                "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For registered equipment, Copy of Permit to Possess",
                                "required": true
                            },
                            {
                                "key": "official-receipt",
                                "title": "For land mobile station:",
                                "description": "Vehicle's valid OR/CR",
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-RSL",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Station License",
                                "required": true
                            },
                            {
                                "key": "roc",
                                "title": "Appropriate and valid Radio Operator Certificate",
                                "required": true,
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-RSL",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Location beyond 500 meters from the original location",
                                "value": "Change of Location beyond 500 meters from the original location",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "engineering-plans",
                                        "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Mode of Transmission",
                                "value": "Change of Mode of Transmission",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "engineering-plans",
                                        "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Point(s) of Communications and Service Area",
                                "value": "Change of Point(s) of Communications and Service Area",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "engineering-plans",
                                        "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Additional Base Station(s)",
                                "value": "Additional Base Station(s)",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "engineering-plans",
                                        "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Vehicle",
                                "value": "Change of Vehicle",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "official-receipt",
                                        "title": "Copy of valid OR/CR",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "purchase-possess-permit",
                                        "title": "Permit to Purchase/Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For registered equipment, Copy of Permit to Possess",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                ]
            },
            {
                "_id": "61c400d8ad8d7afe8ee5f627",
                "createdAt": "2021-12-09T08:40:51.622Z",
                "name": "Other Radio Station Licenses/Services",
                "serviceCode": "service-8",
                "about": {
                    "heading": "Radio Station License",
                    "description": "The RENEWAL of a Radio Station License is required from the public telecommunications entity for the continuous operation of an existing radio station.\n\nThe MODIFICATION of a Radio Station License is required from the public telecommunications entity for changes in the particulars indicated in the License.",
                    "whoMayAvail": [
                        {
                            "title": "Public Telecommunications Entities (PTEs)",
                        },
                        {
                            "title": "Private and Government Entities",
                        }
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Radio Station License - Microwave (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-microwave",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - Microwave (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-microwave",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - VSAT (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-vsat",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - VSAT (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-vsat",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - Public Trunked (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-public-trunked",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - Public Trunked (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-public-trunked",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - BWA (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-bwa",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - BWA (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-bwa",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - WDN (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-wdn",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - WDN (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-wdn",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - WDN (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-wdn",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - BTS (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-bts",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                    {
                        "label": "Radio Station License - BTS (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11-bts",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "permit",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• Permit to Purchase/Possess\n• Permit to Possess for Storage",
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "FX",
                    },
                ]
            },
            {
                "_id": "61c400d8ad8e7afe9ee6f627",
                "createdAt": "2021-12-09T09:51:51.721Z",
                "name": "TVRO/CATV Station License",
                "serviceCode": "service-17",
                "about": {
                    "heading": "TVRO/CATV Station License",
                    "description": "A TVRO Station License or CATV Station License is a written authority issued by the Commission to cable TV operators, private and government entities authorizing the holder thereof to operate a TVRO for commercial purposes or operate a CATV system.\n\nThe RENEWAL of a TVRO Station License or CATV Station License is required for the continuous operation of the subject station.",
                    "whoMayAvail": [
                        {
                            "title": "Cable TV Operators and Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "TVRO Station License (NEW)",
                        "elements": [],
                        "formCode": "ntc1-22-license",
                        "requirements": [
                            {
                                "key": "provisional-authority",
                                "title": "Provisional Authority (PA) OR duly received Motion for Renewal of PA",
                                "required": true,
                            },
                            {
                                "key": "engineering-plans-and-diagrams",
                                "title": "Engineering Plans and Diagrams signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "Plan 1: Map showing the exact location of the TVRO station with geographical coordinates\nPlan 2: Block Diagram of the proposed TVRO system\nPlan 3: Antenna System (Type, Gain, Azimuth, Height Above Ground)",
                                "required": true,
                            },
                            {
                                "key": "head-end-equipment-list",
                                "title": "List of Combiner, Satellite Receivers, Modulators, LNA/LNB and other Head-End Equipment",
                                "description": "Prepared and signed by a duly licensed Professional Electronics Engineer (PECE) / Electronics Engineer (ECE)",
                                "required": true,
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and license of the Supervising PECE/ECE",
                                "required": true,
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and ROC of radio technician",
                                "required": true,
                            },
                        ],
                        "serviceCode": "TVRO-RSL",
                        "sequenceCode": "TVRO",
                    },
                    {
                        "label": "TVRO Station License (RENEWAL)",
                        "elements": [],
                        "formCode": "ntc1-22-license",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "TVRO Station License",
                                "required": true,
                            },
                            {
                                "key": "provisional-authority",
                                "title": "Provisional Authority (PA) OR duly received Motion for Renewal of PA",
                                "required": true,
                            },
                            {
                                "key": "head-end-equipment-list",
                                "title": "List of Combiner, Satellite Receivers, Modulators, LNA/LNB and other Head-End Equipment",
                                "description": "Prepared and signed by a duly licensed Professional Electronics Engineer (PECE) / Electronics Engineer (ECE)",
                                "required": true,
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and license of the Supervising PECE/ECE",
                                "required": true,
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and ROC of radio technician",
                                "required": true,
                            },
                        ],
                        "serviceCode": "TVRO-RSL",
                        "sequenceCode": "TVRO",
                    },
                    {
                        "label": "CATV Station License (NEW)",
                        "elements": [],
                        "formCode": "ntc1-22-license",
                        "requirements": [
                            {
                                "key": "authority-certificate",
                                "title": "Certificate of Authority (CA) OR duly received Motion for Renewal of CA",
                                "required": true,
                            },
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans",
                                "description": "Signed and sealed by a duly licensed Professional Electronics Engineer (PECE)",
                                "required": true,
                            },
                            {
                                "key": "head-end-equipment-list",
                                "title": "List of Combiner, Satellite Receivers, Modulators, LNA/LNB and other Head-End Equipment",
                                "description": "Prepared and signed by a duly licensed Professional Electronics Engineer (PECE) / Electronics Engineer (ECE)",
                                "required": true,
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and license of the Supervising PECE/ECE",
                                "required": true,
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and ROC of radio technician",
                                "required": true,
                            },
                            {
                                "key": "programs",
                                "title": "List of Programs Offered - Channel, Program, and Signal Source",
                                "required": true,
                            }
                        ],
                        "serviceCode": "CATV",
                    },
                    {
                        "label": "CATV Station License (RENEWAL)",
                        "elements": [],
                        "formCode": "ntc1-22-license",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "CATV Station License",
                                "required": true,
                            },
                            {
                                "key": "authority-certificate",
                                "title": "Certificate of Authority (CA) OR duly received Motion for Renewal of CA",
                                "required": true,
                            },
                            {
                                "key": "head-end-equipment-list",
                                "title": "List of Combiner, Satellite Receivers, Modulators, LNA/LNB and other Head-End Equipment",
                                "description": "Prepared and signed by a duly licensed Professional Electronics Engineer (PECE) / Electronics Engineer (ECE)",
                                "required": true,
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and license of the Supervising PECE/ECE",
                                "required": true,
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and ROC of radio technician",
                                "required": true,
                            },
                            {
                                "key": "programs",
                                "title": "List of Programs Offered - Channel, Program, and Signal Source",
                                "required": true,
                            }
                        ],
                        "serviceCode": "CATV",
                    },
                ],
            },
            {
                "_id": "71c500e8ad8d7afe8ee5f629",
                "createdAt": "2021-12-09T09:41:51.656Z",
                "name": "Copy of Licenses",
                "serviceCode": "service-21",
                "about": {
                    "heading": "Copy of Licenses",
                    "description": "A Certified True Copy of a License is issued by the Commission to individuals, private and government entities upon request of the holder to authenticate copy of the same.\n\nA Duplicate Copy of a License is issued by the Commission to individuals, private and government entities upon request of the holder for the re-issuance of the same.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals"
                        },
                        {
                            "title": "Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Certified True Copy",
                        "elements": [
                        ],
                        "formCode": "ntc1-ctc-license",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Copy of document to be authenticated",
                                "required": true
                            },
                        ],
                        "serviceCode": "CTC",
                        "category": "license",
                    },
                    {
                        "label": "Duplicate Copy",
                        "elements": [
                        ],
                        "formCode": "ntc1-21-license",
                        "requirements": [
                            {
                                "key": "id-picture",
                                "title": "For Radio Operator Certificate:",
                                "description": "Clear ID picture taken within the last six (6) months",
                            },
                        ],
                        "serviceCode": "DUP",
                        "category": "license",
                    },
                ]
            },
        ]
    },
    {
        title: 'Permits',
        key: 'permits',
        logo: require('@assets/services/permit.png'),
        data: [
            {
                "_id": "61c400d8ad8d7afe8ee5f617",
                "createdAt": "2021-12-09T08:40:51.621Z",
                "name": "Permits in the Amateur Service",
                "serviceCode": "service-3",
                "about": {
                    "heading": "Permits in the Amateur Service",
                    "description": "The Amateur Radio Station Permit is a written authority issued by the Commission to a person or a club authorizing the holder thereof to operate a class of radio station in the Amateur Service.\n\nThe RENEWAL of Amateur Radio Station Permit and/or Special Permit for the Use of Vanity Call Sign is/are required for the continuous operation of any class of radio stations in the Amateur Service.\n\nThe MODIFICATION of Amateur Radio Station Permit is required for changes in the particulars indicated in the Permit.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals who have passed the Amateur Radio Operator Examination conducted by NTC"
                        },
                        {
                            "title": "Duly accredited amateur radio clubs"
                        },
                        {
                            "title": "Foreign amateurs qualified under the reciprocity agreement"
                        },
                        {
                            "title": "Licensed amateur radio operators"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Amateur Radio Station Permit to PURCHASE",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-AT-pur",
                        "requirements": [
                            {
                                "key": "amateur-roc-or-report-of-rating",
                                "title": "For new Amateur Radio Station License:",
                                "description": "(a) Valid Report of Rating, OR\n(b) Valid Amateur Radio Operator Certificate",
                            },
                            {
                                "key": "amateur-rsl",
                                "title": "For Change of Equipment and/or Additional Equipment:",
                                "description": "Valid Amateur Radio Station License"
                            },
                        ],
                        "serviceCode": "AT-RSL",
                        "sequenceCode": "P/PUR",
                    },
                    {
                        "label": "Amateur Radio Station Permit to POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-AT",
                        "requirements": [
                            {
                                "key": "amateur-roc-or-report-of-rating",
                                "title": "For new Amateur Radio Station License:",
                                "description": "(a) Valid Report of Rating, OR\n(b) Valid Amateur Radio Operator Certificate",
                            },
                            {
                                "key": "amateur-rsl",
                                "title": "For Change of Equipment and/or Additional Equipment:",
                                "description": "Valid Amateur Radio Station License"
                            },
                        ],
                        "serviceCode": "AT-RSL",
                        "sequenceCode": "P/POS",
                    },
                    {
                        "label": "Amateur Radio Station Permit to PURCHASE/POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-AT",
                        "requirements": [
                            {
                                "key": "amateur-roc-or-report-of-rating",
                                "title": "For new Amateur Radio Station License:",
                                "description": "(a) Valid Report of Rating, OR\n(b) Valid Amateur Radio Operator Certificate",
                            },
                            {
                                "key": "amateur-rsl",
                                "title": "For Change of Equipment and/or Additional Equipment:",
                                "description": "Valid Amateur Radio Station License"
                            },
                        ],
                        "serviceCode": "AT-RSL"
                    },
                    {
                        "label": "Amateur Radio Station Permit to SELL/TRANSFER",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-AT-Sell-Transfer",
                        "requirements": [
                            {
                                "key": "seller-amateur-rsl",
                                "title": "Amateur Radio Station License of the Seller"
                            },
                        ],
                        "serviceCode": "AT-RSL"
                    },
                    {
                        "label": "Temporary Permit to Operate an Amateur Radio Station - Foreign Visitor",
                        "elements": [
                            "Class A",
                            "Class B",
                            "Class C",
                        ],
                        "formCode": "ntc1-03-and-09",
                        "requirements": [
                            {
                                "key": "letter-of-intent",
                                "title": "Letter of Intent",
                                "required": true,
                            },
                            {
                                "key": "amateur-roc",
                                "title": "Copy of valid Amateur Radio Operator Certificate issued by the country of citizenship",
                                "required": true,
                            },
                            {
                                "key": "same-privilige-amateur-country-proof",
                                "title": "Any proof that his/her country provides the same privilege with the Filipino Amateurs",
                                "required": true,
                            },
                            {
                                "key": "endorsement",
                                "title": "Endorsement from recognized national organization (i.e. Philippine Amateur Radio Association (PARA), Inc.)",
                                "required": true,
                            },
                            {
                                "key": "id-picture",
                                "title": "Clear ID picture taken within the last six (6) months",
                                "required": true
                            },
                        ],
                        "serviceCode": "AT-TEMPORARY",
                    },
                    {
                        "label": "Special Permit for the Use of Vanity Call Sign (NEW)",
                        "elements": [],
                        "formCode": "ntc1-03",
                        "requirements": [
                            {
                                "key": "amateur-roc-or-license",
                                "title": "Copy of valid Amateur Radio Operator Certificate or Amateur Radio Station License",
                                "required": true,
                            },
                            {
                                "key": "endorsement-or-ameteur-activities",
                                "title": "ANY of the following:",
                                "description": "• Endorsement from the Philippine Amateur Radio Association (PARA), Inc.; OR\n• Proof of ANY of the following radio amateur activities:\n   • DXCentury Club (DXCC) 5B awards\n   • Continental Champion for three (3) consecutive years of a major amateur radio contest\n   • DXpedition in any of the top twenty (20) Most Wanted DXCC entities",
                                "required": true,
                            },
                        ],
                        "serviceCode": "VANITY-AT"
                    },
                    {
                        "label": "Special Permit for the Use of Vanity Call Sign (RENEWAL)",
                        "elements": [],
                        "formCode": "ntc1-03",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Copy of valid Amateur Radio Operator Certificate or Amateur Radio Station License",
                                "required": true,
                            },
                            {
                                "key": "special-permit",
                                "title": "Special Permit",
                                "required": true,
                            },
                        ],
                        "serviceCode": "VANITY-AT"
                    },
                    {
                        "label": "Special Permit for the Use of Special Event Call Sign",
                        "elements": [],
                        "formCode": "ntc1-03",
                        "requirements": [
                            {
                                "key": "letter-request",
                                "title": "Letter Request stating, among others, nature of event, duration of event, etc.",
                                "required": true,
                            },
                            {
                                "key": "amateur-roc-or-license",
                                "title": "Copy of valid Amateur Radio Operator Certificate or Amateur Radio Station License",
                                "required": true,
                            },
                        ],
                        "serviceCode": "SPECIAL-EVENT-AT"
                    },
                ]
            },
            {
                "_id": "61c400d8ad8d7afe9ee5f617",
                "createdAt": "2021-12-09T08:40:51.622Z",
                "name": "Permits in the Aeronautical Service",
                "serviceCode": "service-4",
                "about": {
                    "heading": "Permits in the Aeronautical Service",
                    "description": "A Permit to Purchase/Possess is a written authority issued by the Commission to an individual, private and government entities authorizing the holder thereof to purchase/acquire and/or possess/own a radio transceiver.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals and Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Aeronautical Station Permit to PURCHASE",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-ASL-pur",
                        "requirements": [
                            {
                                "key": "aircraft-rsls",
                                "title": "Valid Aircraft Station License(s)",
                            },
                            {
                                "key": "frequency-assignment-allocation",
                                "title": "For new Aeronautical Fixed Station:",
                                "description": "Frequency assignment/allocation issued by the Civil Aviation Authority of the Philippines (CAAP)",
                            },
                            {
                                "key": "rsl",
                                "title": "For Change of Equipment and/or Additional Equipment for Fixed Aeronautical Station:",
                                "description": "Valid Radio Station License",
                            },
                        ],
                        "serviceCode": "ASL",
                        "sequenceCode": "P/PUR",
                    },
                    {
                        "label": "Aeronautical Station Permit to POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-ASL",
                        "requirements": [
                            {
                                "key": "aircraft-rsls",
                                "title": "Valid Aircraft Station License(s)",
                            },
                            {
                                "key": "frequency-assignment-allocation",
                                "title": "For new Aeronautical Fixed Station:",
                                "description": "Frequency assignment/allocation issued by the Civil Aviation Authority of the Philippines (CAAP)",
                            },
                            {
                                "key": "rsl",
                                "title": "For Change of Equipment and/or Additional Equipment for Fixed Aeronautical Station:",
                                "description": "Valid Radio Station License",
                            },
                        ],
                        "serviceCode": "ASL",
                        "sequenceCode": "P/POS",
                    },
                    {
                        "label": "Aeronautical Station Permit to PURCHASE/POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-ASL",
                        "requirements": [
                            {
                                "key": "aircraft-rsls",
                                "title": "Valid Aircraft Station License(s)",
                            },
                            {
                                "key": "frequency-assignment-allocation",
                                "title": "For new Aeronautical Fixed Station:",
                                "description": "Frequency assignment/allocation issued by the Civil Aviation Authority of the Philippines (CAAP)",
                            },
                            {
                                "key": "rsl",
                                "title": "For Change of Equipment and/or Additional Equipment for Fixed Aeronautical Station:",
                                "description": "Valid Radio Station License",
                            },
                        ],
                        "serviceCode": "ASL"
                    },
                ]
            },
            {
                "_id": "61d400d8ad8d7afe9ee5f617",
                "createdAt": "2021-12-09T08:40:51.623Z",
                "name": "Permits in the Maritime Service",
                "serviceCode": "service-5",
                "about": {
                    "heading": "Permits in the Maritime Service",
                    "description": "A Permit to Purchase/Possess is a written authority issued by the Commission to a public telecommunications entity (PTEs) authorizing the holder thereof to purchase/acquire and/or possess/own a radio transceiver.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals and Private and Government Entities"
                        },
                        {
                            "title": "Public Telecommunications Entities (PTEs) who are authorized to engage in public maritime communications service"
                        }
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Ship Station Permit to PURCHASE (DOMESTIC Trade)",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-MS-pur",
                        "requirements": [
                            {
                                "key": "ship-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• Certificate of Vessel Registry and Certificate of Ownership issued by the Maritime Industry Authority (MARINA)\n• Permit issued by the Local Government Unit (LGU)\n• Ship Station License",
                                "required": true,
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "P/PUR",
                    },
                    {
                        "label": "Ship Station Permit to POSSESS (DOMESTIC Trade)",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-MS-pos",
                        "requirements": [
                            {
                                "key": "ship-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• Certificate of Vessel Registry and Certificate of Ownership issued by the Maritime Industry Authority (MARINA)\n• Permit issued by the Local Government Unit (LGU)\n• Ship Station License",
                                "required": true,
                            },
                        ],
                        "serviceCode": "SSL",
                        "sequenceCode": "P/POS",
                    },
                    {
                        "label": "Ship Station Permit to PURCHASE/POSSESS (DOMESTIC Trade)",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-MS-pos",
                        "requirements": [
                            {
                                "key": "ship-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• Certificate of Vessel Registry and Certificate of Ownership issued by the Maritime Industry Authority (MARINA)\n• Permit issued by the Local Government Unit (LGU)\n• Ship Station License",
                                "required": true,
                            },
                        ],
                        "serviceCode": "SSL",
                    },
                    {
                        "label": "Private Coastal Station Permit to PURCHASE",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-MS-pur",
                        "requirements": [
                            {
                                "key": "ship-station-license",
                                "title": "Ship Station License(s) for ship(s) engaged in Domestic Trade",
                                "required": true,
                            },
                        ],
                        "serviceCode": "COASTAL",
                        "sequenceCode": "P/PUR",
                    },
                    {
                        "label": "Private Coastal Station Permit to POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-MS-pos",
                        "requirements": [
                            {
                                "key": "ship-station-license",
                                "title": "Ship Station License(s) for ship(s) engaged in Domestic Trade",
                                "required": true,
                            },
                        ],
                        "serviceCode": "COASTAL",
                        "sequenceCode": "P/POS",
                    },
                    {
                        "label": "Private Coastal Station Permit to PURCHASE/POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-MS-pos",
                        "requirements": [
                            {
                                "key": "ship-station-license",
                                "title": "Ship Station License(s) for ship(s) engaged in Domestic Trade",
                                "required": true,
                            },
                        ],
                        "serviceCode": "COASTAL",
                    },
                    {
                        "label": "Public Coastal Station Permit to PURCHASE",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-MS-pur",
                        "requirements": [
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "1. Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)\n3. Antenna System Plan (Type, Gain, Diameter, Beamwidth, Azimuth, Height Above Ground, Polarization)",
                                "required": true,
                            },
                            {
                                "key": "provisional-authority-or-certificate-of-public-convenience-and-necessity",
                                "title": "Copy of ANY of the following:",
                                "description": "• Provisional Authority\n• Certificate of Public Convenience and Necessity",
                                "required": true,
                            },
                        ],
                        "serviceCode": "PUB-COASTAL",
                        "sequenceCode": "P/PUR",
                    },
                    {
                        "label": "Public Coastal Station Permit to POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-MS-pos",
                        "requirements": [
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "1. Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)\n3. Antenna System Plan (Type, Gain, Diameter, Beamwidth, Azimuth, Height Above Ground, Polarization)",
                                "required": true,
                            },
                            {
                                "key": "provisional-authority-or-certificate-of-public-convenience-and-necessity",
                                "title": "Copy of ANY of the following:",
                                "description": "• Provisional Authority\n• Certificate of Public Convenience and Necessity",
                                "required": true,
                            },
                        ],
                        "serviceCode": "PUB-COASTAL",
                        "sequenceCode": "P/POS",
                    },
                    {
                        "label": "Public Coastal Station Permit to PURCHASE/POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-MS-pos",
                        "requirements": [
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "1. Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)\n3. Antenna System Plan (Type, Gain, Diameter, Beamwidth, Azimuth, Height Above Ground, Polarization)",
                                "required": true,
                            },
                            {
                                "key": "provisional-authority-or-certificate-of-public-convenience-and-necessity",
                                "title": "Copy of ANY of the following:",
                                "description": "• Provisional Authority\n• Certificate of Public Convenience and Necessity",
                                "required": true,
                            },
                        ],
                        "serviceCode": "PUB-COASTAL",
                    },
                ]
            },
            {
                "_id": "61d400d8ad8d7aee9ee5f617",
                "createdAt": "2021-12-09T08:40:51.624Z",
                "name": "Permits for Government and Private Radio Stations in the Fixed and Land Mobile Service",
                "serviceCode": "service-9",
                "about": {
                    "heading": "Permits for Government and Private Radio Stations in the Fixed and Land Mobile Service",
                    "description": "A Permit to Purchase/Possess is a written authority issued by the Commission to an individual or private or government entities authorizing the holder thereof to purchase/acquire and/or possess/own a radio transceiver.\n\nA Permit to Possess for Storage is a written authority issued by the Commission to an individual, private and government entities authorizing the storage of radio communications equipment.\n\nA Construction Permit is a written authority issued by the Commission to an individual, private and government entities authorizing the holder thereof to construct or install radio transceivers or radio station(s).",
                    "whoMayAvail": [
                        {
                            "title": "Individuals and Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Permit to PURCHASE",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-GOVTPVT-pur",
                        "requirements": [
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "1. Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)\n3. Antenna System Plan (Type, Gain, Diameter, Beamwidth, Azimuth, Height Above Ground, Polarization)",
                                "required": true,
                            },
                            {
                                "key": "proposed-radio-equipment-datasheet",
                                "title": "For applications requiring new frequency assignment:",
                                "description": "Datasheet of proposed radio equipment",
                            },
                            {
                                "key": "link-budget-analysis",
                                "title": "For Microwave Radio Link:",
                                "description": "Link Budget Analysis",
                            },
                            {
                                "key": "transponder-lease-agreement-or-certificate",
                                "title": "For VSAT, ANY of the following:",
                                "description": "• Copy of valid Transponder Lease Agreement (TLA) with any Philippine or International Satellite Operator\n• Certification of assigned transponder(s) with the following parameters: (i) Transponder ID/Number (ii) Center Frequency (Uplink/Downlink), (iii) Bandwidth, (iv) Polarization (Uplink/Downlink)",
                            },
                            {
                                "key": "registration-id",
                                "title": "For Private Entities, ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit",
                            },
                            {
                                "key": "civic-action-group-documents",
                                "title": "For Civic Action Groups:",
                                "description": "(a) Copy of SEC Registration, OR Copy of DTI Registration, OR Copy of valid Business/Mayor's Permit OR Copy of existing Radio Station License from national office of the Civic Action Group\n(b) List of Officers and at least 50 active Members\n(c) Copy of Memorandum of Agreement with the government & non-government organizations",
                            },
                            {
                                "key": "letter-of-intent",
                                "title": "For Government Entities:",
                                "description": "Letter of Intent duly signed by the head of the agency or his duly authorized representative stating, among others, the technical information and availability of funds to support the proposal",
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "P/PUR",
                    },
                    {
                        "label": "Permit to POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-GOVTPVT-pos",
                        "requirements": [
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "1. Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)\n3. Antenna System Plan (Type, Gain, Diameter, Beamwidth, Azimuth, Height Above Ground, Polarization)",
                                "required": true,
                            },
                            {
                                "key": "proposed-radio-equipment-datasheet",
                                "title": "For applications requiring new frequency assignment:",
                                "description": "Datasheet of proposed radio equipment",
                            },
                            {
                                "key": "link-budget-analysis",
                                "title": "For Microwave Radio Link:",
                                "description": "Link Budget Analysis",
                            },
                            {
                                "key": "transponder-lease-agreement-or-certificate",
                                "title": "For VSAT, ANY of the following:",
                                "description": "• Copy of valid Transponder Lease Agreement (TLA) with any Philippine or International Satellite Operator\n• Certification of assigned transponder(s) with the following parameters: (i) Transponder ID/Number (ii) Center Frequency (Uplink/Downlink), (iii) Bandwidth, (iv) Polarization (Uplink/Downlink)",
                            },
                            {
                                "key": "registration-id",
                                "title": "For Private Entities, ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit",
                            },
                            {
                                "key": "civic-action-group-documents",
                                "title": "For Civic Action Groups:",
                                "description": "(a) Copy of SEC Registration, OR Copy of DTI Registration, OR Copy of valid Business/Mayor's Permit OR Copy of existing Radio Station License from national office of the Civic Action Group\n(b) List of Officers and at least 50 active Members\n(c) Copy of Memorandum of Agreement with the government & non-government organizations",
                            },
                            {
                                "key": "letter-of-intent",
                                "title": "For Government Entities:",
                                "description": "Letter of Intent duly signed by the head of the agency or his duly authorized representative stating, among others, the technical information and availability of funds to support the proposal",
                            },
                        ],
                        "serviceCode": "RSL",
                        "sequenceCode": "P/POS",
                    },
                    {
                        "label": "Permit to PURCHASE/POSSESS",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-GOVTPVT-pos",
                        "requirements": [
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "1. Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)\n3. Antenna System Plan (Type, Gain, Diameter, Beamwidth, Azimuth, Height Above Ground, Polarization)",
                                "required": true,
                            },
                            {
                                "key": "proposed-radio-equipment-datasheet",
                                "title": "For applications requiring new frequency assignment:",
                                "description": "Datasheet of proposed radio equipment",
                            },
                            {
                                "key": "link-budget-analysis",
                                "title": "For Microwave Radio Link:",
                                "description": "Link Budget Analysis",
                            },
                            {
                                "key": "transponder-lease-agreement-or-certificate",
                                "title": "For VSAT, ANY of the following:",
                                "description": "• Copy of valid Transponder Lease Agreement (TLA) with any Philippine or International Satellite Operator\n• Certification of assigned transponder(s) with the following parameters: (i) Transponder ID/Number (ii) Center Frequency (Uplink/Downlink), (iii) Bandwidth, (iv) Polarization (Uplink/Downlink)",
                            },
                            {
                                "key": "registration-id",
                                "title": "For Private Entities, ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit",
                            },
                            {
                                "key": "civic-action-group-documents",
                                "title": "For Civic Action Groups:",
                                "description": "(a) Copy of SEC Registration, OR Copy of DTI Registration, OR Copy of valid Business/Mayor's Permit OR Copy of existing Radio Station License from national office of the Civic Action Group\n(b) List of Officers and at least 50 active Members\n(c) Copy of Memorandum of Agreement with the government & non-government organizations",
                            },
                            {
                                "key": "letter-of-intent",
                                "title": "For Government Entities:",
                                "description": "Letter of Intent duly signed by the head of the agency or his duly authorized representative stating, among others, the technical information and availability of funds to support the proposal",
                            },
                        ],
                        "serviceCode": "RSL",
                    },
                    {
                        "label": "Permit to POSSESS for Storage",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-GOVTPVT-pos",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true,
                            },
                        ],
                        "serviceCode": "RS-SRO",
                        "sequenceCode": "P/POS",
                    },
                    {
                        "label": "Construction Permit (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-11",
                        "requirements": [
                            {
                                "key": "purchase-possess-permit",
                                "title": "Permit to Purchase/Possess",
                                "required": true
                            },
                            {
                                "key": "roc",
                                "title": "Appropriate and valid Radio Operator Certificate",
                                "required": true,
                            },
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "1. Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)\n3. Antenna System Plan (Type, Gain, Diameter, Beamwidth, Azimuth, Height Above Ground, Polarization)",
                                "required": true,
                            },
                            {
                                "key": "source-of-equipment-proof",
                                "title": "Copy of document indicating source of equipment:",
                                "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For registered equipment, Copy of Permit to Possess",
                                "required": true
                            },
                            {
                                "key": "official-receipt",
                                "title": "For land mobile station:",
                                "description": "Vehicle's valid OR/CR",
                            },
                        ],
                        "serviceCode": "RSL",
                    },
                    {
                        "label": "Construction Permit (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-13",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Location beyond 500 meters from the original location",
                                "value": "Change of Location beyond 500 meters from the original location",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "engineering-plans",
                                        "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Mode of Transmission",
                                "value": "Change of Mode of Transmission",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "engineering-plans",
                                        "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Point(s) of Communications and Service Area",
                                "value": "Change of Point(s) of Communications and Service Area",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "engineering-plans",
                                        "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Additional Base Station(s)",
                                "value": "Additional Base Station(s)",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "engineering-plans",
                                        "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Vehicle",
                                "value": "Change of Vehicle",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "official-receipt",
                                        "title": "Copy of valid OR/CR",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of Equipment and/or Additional Equipment",
                                "value": "Change of Equipment and/or Additional Equipment",
                                "requirements": [
                                    {
                                        "key": "rsl",
                                        "title": "Radio Station License",
                                        "required": true
                                    },
                                    {
                                        "key": "purchase-possess-permit",
                                        "title": "Permit to Purchase/Possess",
                                        "required": true
                                    },
                                    {
                                        "key": "source-of-equipment-proof",
                                        "title": "Copy of document indicating source of equipment:",
                                        "description": "(a) For locally-sourced equipment, Official Receipt or Sales Invoice from authorized Radio Dealer, OR\n(b) For imported equipment, Copy of Invoice from the supplier AND Copy of Permit to Import, OR\n(c) For registered equipment, Copy of Permit to Possess",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "RSL",
                    },
                    {
                        "label": "Temporary Permit to Demonstrate and Propagate",
                        "elements": [
                        ],
                        "formCode": "ntc1-14",
                        "requirements": [
                            {
                                "key": "engineering-plans",
                                "title": "Engineering Plans signed and sealed by a duly licensed Professional Electronics Engineer (PECE), to wit:",
                                "description": "1.Network Diagram indicating locations of all stations and the proposed frequency band\n2. Map showing exact location (Region, Province, City/ Municipality, Barangay) of all stations with geographical coordinates (Longitude/Latitude in Degrees/Minutes/Seconds)",
                                "required": true
                            },
                            {
                                "key": "datasheet",
                                "title": "Datasheet of proposed radio equipment",
                                "required": true
                            },
                            {
                                "key": "transponder-lease-agreement",
                                "title": "If VSAT Outdoor Unit will be utilized in the Demo:",
                                "description": "Transponder Lease Agreement (TLA) with any satellite operator",
                                // "required": true
                            },
                        ],
                        "serviceCode": "RS-DEMO",
                    },
                ]
            },
            {
                "_id": "61c400d8ad8d7afe8ee5f627",
                "createdAt": "2021-12-09T08:40:51.622Z",
                "name": "Permits for Public Telecommunications Entities (PTEs)",
                "serviceCode": "service-8",
                "about": {
                    "heading": "Permits for Public Telecommunications Entities (PTEs)",
                    "description": "A Permit to Possess for Storage is a written authority issued by the Commission to public telecommunications entities authorizing the storage of radio communications equipment.",
                    "whoMayAvail": [
                        {
                            "title": "Public Telecommunications Entities (PTEs)"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Permit to Possess for Storage (PTEs)",
                        "elements": [
                        ],
                        "formCode": "ntc1-09-PTEs",
                        "requirements": [
                            {
                                "key": "rsl",
                                "title": "Radio Station License",
                                "required": true
                            },
                        ],
                        "serviceCode": "RSL"
                    },
                ]
            },
            {
                "_id": "61c400e8ad8d7afe8ee5f627",
                "createdAt": "2021-12-09T08:40:51.626Z",
                "name": "Permits for Radio Communications Equipment",
                "serviceCode": "service-14",
                "about": {
                    "heading": "Permits for Radio Communications Equipment",
                    "description": "A Permit to Transport is a written authority issued by the Commission to an individual, private and government entities authorizing the holder thereof to transport radio communications equipment.\n\nAn Accreditation for Radio Communications Equipment (RCE) Dealer or RCE Manufacturer or RCE Service Center is a written authority issued by the Commission to a person, firm, company, association or corporation authorizing the holder thereof to engage in the acquisition and purchase/sale, or manufacture, or servicing and maintenance of radio communications equipment.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals and PrivatsecDtiRegistationNumbere and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Permit to Transport",
                        "elements": [
                        ],
                        "formCode": "ntc1-16",
                        "requirements": [
                            {
                                "key": "radio-communications-equipment-registration",
                                "title": "Copy of ANY of the following:",
                                "description": "• Permit to Purchase\n• Permit to Possess\n• Construction Permit/Radio Station License\n• Permit to Transfer\n• Radio Communication Equipment Dealer Permit",
                                "required": true
                            },
                        ],
                        "serviceCode": "RCE-PTR",
                    },
                    {
                        "label": "Dealer Permit (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18-RCE",
                        "requirements": [
                            {
                                "key": "registration-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit\n\nNote : The purpose of the company as indicated in its registration document must include information related to the accreditation applied for.",
                                "required": true
                            },
                            {
                                "key": "paid-up-capital",
                                "title": "Proof of Paid-Up Capital",
                                "description": "Minimum of PHP350,000",
                                "required": true
                            },
                            {
                                "key": "instruments",
                                "title": "List of Test Equipment and Measuring Instruments",
                                "description": "Refer to Section 6.1, M.C. No. 2-05-88\n\nNote: This requirement does not apply to WDN Indoor/SRD/RFID Dealers",
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license/ROC of at least one (1) qualified Radio Technician (Electronics Technician duly licensed by the Professional Regulation Commission OR a holder of a First Class Radiotelephone/ Radiotelegraph Certificate) employed on a full time basis\n\nNote: This requirement does not apply to WDN Indoor/SRD/RFID Dealers"
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license of Supervising Electronics Engineer (ECE) or Professional Electronics Engineer (PECE)\n\nNote: This requirement does not apply to WDN Indoor/SRD/RFID Dealers",
                            },
                        ],
                        "serviceCode": "RCE",
                        "category": "dealer",
                        "sequenceCode": "MP",
                    },
                    {
                        "label": "Dealer Permit (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18-RCE",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Communication Equipment Dealer Permit",
                                "required": true
                            },
                            {
                                "key": "business-or-mayors-permit",
                                "title": "Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license/ROC of at least one (1) qualified Radio Technician (Electronics Technician duly licensed by the Professional Regulation Commission OR a holder of a First Class Radiotelephone/ Radiotelegraph Certificate) employed on a full time basis\n\nNote: This requirement does not apply to WDN Indoor/SRD/RFID Dealers"
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license of Supervising Electronics Engineer (ECE) or Professional Electronics Engineer (PECE)\n\nNote: This requirement does not apply to WDN Indoor/SRD/RFID Dealers",
                            },
                        ],
                        "serviceCode": "RCE",
                        "category": "dealer",
                        "sequenceCode": "MP",
                    },
                    {
                        "label": "Dealer Permit (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18-RCE",
                        "requirements": [
                            {
                                "key": "radio-communication-equipment-permit",
                                "title": "Radio Communication Equipment Dealer Permit",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Permittee",
                                "value": "Change of Permittee",
                                "requirements": [
                                    {
                                        "key": "radio-communication-equipment-permit",
                                        "title": "Radio Communication Equipment Dealer Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "registration-id",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit\n\nNote : The purpose of the company as indicated in its registration document must include information related to the accreditation applied for.",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of company address",
                                "value": "Change of company address",
                                "requirements": [
                                    {
                                        "key": "radio-communication-equipment-permit",
                                        "title": "Radio Communication Equipment Dealer Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "business-or-mayors-permit",
                                        "title": "Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "RCE",
                        "category": "dealer",
                        "sequenceCode": "MP",
                    },
                    {
                        "label": "Manufacturer Permit (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18-RCE",
                        "requirements": [
                            {
                                "key": "registration-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit\n\nNote : The purpose of the company as indicated in its registration document must include information related to the accreditation applied for.",
                                "required": true
                            },
                            {
                                "key": "paid-up-capital",
                                "title": "Proof of Paid-Up Capital",
                                "description": "Minimum of PHP1,000,000",
                                "required": true
                            },
                            {
                                "key": "instruments",
                                "title": "List of Test Equipment and Measuring Instruments",
                                "description": "Refer to Section 6.2, M.C. No. 2-05-88",
                                "required": true,
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license/ROC of at least one (1) qualified Radio Technician (Electronics Technician duly licensed by the Professional Regulation Commission OR a holder of a First Class Radiotelephone/ Radiotelegraph Certificate) employed on a full time basis",
                                "required": true,
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license of supervising Professional Electronics Engineer (PECE)",
                                "required": true,
                            },
                        ],
                        "serviceCode": "RCE",
                        "category": "manufacturer",
                    },
                    {
                        "label": "Manufacturer Permit (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18-RCE",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Communication Equipment Manufacturer Permit",
                                "required": true
                            },
                            {
                                "key": "business-or-mayors-permit",
                                "title": "Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license/ROC of at least one (1) qualified Radio Technician (Electronics Technician duly licensed by the Professional Regulation Commission OR a holder of a First Class Radiotelephone/ Radiotelegraph Certificate) employed on a full time basis",
                                "required": true,
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license of supervising Professional Electronics Engineer (PECE)",
                                "required": true,
                            },
                        ],
                        "serviceCode": "RCE",
                        "category": "manufacturer",
                    },
                    {
                        "label": "Manufacturer Permit (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18-RCE",
                        "requirements": [
                            {
                                "key": "radio-communication-equipment-permit",
                                "title": "Radio Communication Equipment Manufacturer Permit",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Permittee",
                                "value": "Change of Permittee",
                                "requirements": [
                                    {
                                        "key": "radio-communication-equipment-permit",
                                        "title": "Radio Communication Equipment Manufacturer Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "registration-id",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit\n\nNote : The purpose of the company as indicated in its registration document must include information related to the accreditation applied for.",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of company address",
                                "value": "Change of company address",
                                "requirements": [
                                    {
                                        "key": "radio-communication-equipment-permit",
                                        "title": "Radio Communication Equipment Manufacturer Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "business-or-mayors-permit",
                                        "title": "Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "RCE",
                        "category": "manufacturer",
                    },
                    {
                        "label": "Service Center Permit (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "registration-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit\n\nNote : The purpose of the company as indicated in its registration document must include information related to the accreditation applied for.",
                                "required": true
                            },
                            {
                                "key": "paid-up-capital",
                                "title": "Proof of Paid-Up Capital",
                                "description": "Minimum of PHP100,000",
                                "required": true
                            },
                            {
                                "key": "instruments",
                                "title": "List of Test Equipment and Measuring Instruments",
                                "description": "Refer to Section 6.1, M.C. No. 2-05-88",
                                "required": true
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license/ROC of at least one (1) qualified Radio Technician (Electronics Technician duly licensed by the Professional Regulation Commission OR a holder of a First Class Radiotelephone/ Radiotelegraph Certificate) employed on a full time basis"
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license of Supervising Electronics Engineer (ECE) or Professional Electronics Engineer (PECE)",
                            },
                        ],
                        "serviceCode": "RCE",
                        "category": "service center",
                        "sequenceCode": "SC",
                    },
                    {
                        "label": "Service Center Permit (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18-RCE",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Radio Communication Equipment Service Center Permit",
                                "required": true
                            },
                            {
                                "key": "business-or-mayors-permit",
                                "title": "Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "technician-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license/ROC of at least one (1) qualified Radio Technician (Electronics Technician duly licensed by the Professional Regulation Commission OR a holder of a First Class Radiotelephone/ Radiotelegraph Certificate) employed on a full time basis"
                            },
                            {
                                "key": "engineer-documents",
                                "title": "Copy of the following:",
                                "description": "Certificate of Employment and copy of valid license of Supervising Electronics Engineer (ECE) or Professional Electronics Engineer (PECE)",
                            },
                        ],
                        "serviceCode": "RCE",
                        "category": "service center",
                        "sequenceCode": "SC",
                    },
                    {
                        "label": "Service Center Permit (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18-RCE",
                        "requirements": [
                            {
                                "key": "radio-communication-equipment-permit",
                                "title": "Radio Communication Equipment Service Center Permit",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Permittee",
                                "value": "Change of Permittee",
                                "requirements": [
                                    {
                                        "key": "radio-communication-equipment-permit",
                                        "title": "Radio Communication Equipment Service Center Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "registration-id",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit\n\nNote : The purpose of the company as indicated in its registration document must include information related to the accreditation applied for.",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of company address",
                                "value": "Change of company address",
                                "requirements": [
                                    {
                                        "key": "radio-communication-equipment-permit",
                                        "title": "Radio Communication Equipment Service Center Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "business-or-mayors-permit",
                                        "title": "Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "RCE",
                        "category": "service center",
                        "sequenceCode": "SC",
                    },
                ]
            },
            {
                "_id": "61c500e8ad8d7afe8ee5f625",
                "createdAt": "2021-12-09T09:40:51.636Z",
                "name": "Permits for Mobile Phone",
                "serviceCode": "service-15",
                "about": {
                    "heading": "Permits for Mobile Phone",
                    "description": "An Accreditation for Mobile Phone Dealer or Mobile Phone Retailer/Reseller or Mobile Phone Service Center is a written authority issued by the Commission to a person, firm, company, association or corporation authorizing the holder thereof to engage in the acquisition and purchase/sale, or servicing and maintenance of mobile phones.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals and Private Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Dealer Permit (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "registration-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "dealership-agreement",
                                "title": "Dealership agreement from Mobile Phone Distributor/Supplier duly accredited by the NTC",
                                // "required": true
                            },
                            {
                                "key": "paid-up-capital",
                                "title": "Proof of Paid-Up Capitalization",
                                "description": "Minimum of PHP 100,000.00, duly certified by the Treasurer of the Corporation or by the partners in a partnership or by the owner in a sole proprietorship\n\nNote: List of stocks of spare parts and accessories sufficient enough to cover the warranty of mobile phone units for at least six (6) months, or in accordance with dealership agreement with the NTC accredited supplier/distributor",
                                "required": true
                            },
                        ],
                        "serviceCode": "MP",
                        "category": "dealer",
                        "sequenceCode": "MP",
                    },
                    {
                        "label": "Dealer Permit (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Mobile Phone Dealer Permit",
                                "required": true
                            },
                            {
                                "key": "business-or-mayors-permit",
                                "title": "Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "dealership-agreement",
                                "title": "Dealership agreement from Mobile Phone Distributor/Supplier duly accredited by the NTC",
                                "description": "Note: Sales and Stocks Report(s) shall be submitted in the prescribed form not later than seven (7) days after the end of each quarter to the Regional Office",
                                // "required": true,
                            },

                        ],
                        "serviceCode": "MP",
                        "category": "dealer",
                        "sequenceCode": "MP",
                    },
                    {
                        "label": "Dealer Permit (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "letter-of-intent",
                                "title": "Letter of Intent",
                                "required": true
                            },
                            {
                                "key": "mobile-phone-dealer-permit",
                                "title": "Mobile Phone Dealer Permit",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Permittee",
                                "value": "Change of Permittee",
                                "requirements": [
                                    {
                                        "key": "letter-of-intent",
                                        "title": "Letter of Intent",
                                        "required": true
                                    },
                                    {
                                        "key": "mobile-phone-dealer-permit",
                                        "title": "Mobile Phone Dealer Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "registration-document",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Valid Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of company address",
                                "value": "Change of company address",
                                "requirements": [
                                    {
                                        "key": "letter-of-intent",
                                        "title": "Letter of Intent",
                                        "required": true
                                    },
                                    {
                                        "key": "mobile-phone-dealer-permit",
                                        "title": "Mobile Phone Dealer Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "business-or-mayors-permit",
                                        "title": "Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "MP",
                        "category": "dealer",
                        "sequenceCode": "MP",
                    },
                    {
                        "label": "Retailer/Reseller Permit (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "registration-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "paid-up-capital",
                                "title": "Proof of Paid-Up Capitalization",
                                "description": "Minimum of PHP 50,000.00, duly certified by the Treasurer of the Corporation or by the partners in a partnership or by the owner in a sole proprietorship",
                                "required": true
                            },
                            {
                                "key": "stall-lease-certificate",
                                "title": "Certificate of Stall Lease Agreement for the conduct of its business activity",
                                "required": true
                            },
                        ],
                        "serviceCode": "MP",
                        "category": "retailer/reseller",
                        "sequenceCode": "MRR",
                    },
                    {
                        "label": "Retailer/Reseller Permit (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Mobile Phone Retailer/Reseller Permit",
                                "required": true
                            },
                            {
                                "key": "registration-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "stall-lease-certificate",
                                "title": "Certificate of Stall Lease Agreement for the conduct of its business activity",
                                "required": true
                            },
                        ],
                        "serviceCode": "MP",
                        "category": "retailer/reseller",
                        "sequenceCode": "MRR",
                    },
                    {
                        "label": "Retailer/Reseller Permit (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "mobile-phone-dealer-permit",
                                "title": "Mobile Phone Retailer/Reseller Permit",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Permittee",
                                "value": "Change of Permittee",
                                "requirements": [
                                    {
                                        "key": "mobile-phone-dealer-permit",
                                        "title": "Mobile Phone Retailer/Reseller Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "registration-document",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Valid Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of company address",
                                "value": "Change of company address",
                                "requirements": [
                                    {
                                        "key": "mobile-phone-dealer-permit",
                                        "title": "Mobile Phone Retailer/Reseller Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "business-or-mayors-permit",
                                        "title": "Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "MP",
                        "category": "retailer/reseller",
                        "sequenceCode": "MRR",
                    },
                    {
                        "label": "Service Center Permit (NEW)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "registration-id",
                                "title": "Copy of ANY of the following:",
                                "description": "• SEC Registration\n• DTI Registration\n• Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "instruments",
                                "title": "List of Test Equipment and Measuring Instruments",
                                "required": true
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of employment of qualified electronic technician who has completed a formal training course in the repair, servicing and maintenance of mobile phone",
                                "required": true
                            },
                        ],
                        "serviceCode": "MP",
                        "category": "service center",
                        "sequenceCode": "SC",
                    },
                    {
                        "label": "Service Center Permit (RENEWAL)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Mobile Phone Service Center Permit",
                                "required": true
                            },
                            {
                                "key": "business-or-mayors-permit",
                                "title": "Business/Mayor's Permit",
                                "required": true
                            },
                            {
                                "key": "instruments",
                                "title": "List of Test Equipment and Measuring Instruments",
                                "required": true
                            },
                            {
                                "key": "certificate-of-employment",
                                "title": "Certificate of employment of qualified electronic technician who has completed a formal training course in the repair, servicing and maintenance of mobile phone",
                                "required": true
                            },

                        ],
                        "serviceCode": "MP",
                        "category": "service center",
                        "sequenceCode": "SC",
                    },
                    {
                        "label": "Service Center Permit (MODIFICATION)",
                        "elements": [
                        ],
                        "formCode": "ntc1-18",
                        "requirements": [
                            {
                                "key": "mobile-phone-service-center-permit",
                                "title": "Mobile Phone Service Center Permit",
                                "required": true
                            },
                        ],
                        "modificationDueTos": [
                            {
                                "label": "Change of Permittee",
                                "value": "Change of Permittee",
                                "requirements": [
                                    {
                                        "key": "mobile-phone-service-center-permit",
                                        "title": "Mobile Phone Service Center Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "registration-document",
                                        "title": "Copy of ANY of the following:",
                                        "description": "• SEC Registration\n• DTI Registration\n• Valid Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                            {
                                "label": "Change of company address",
                                "value": "Change of company address",
                                "requirements": [
                                    {
                                        "key": "mobile-phone-service-center-permit",
                                        "title": "Mobile Phone Service Center Permit",
                                        "required": true
                                    },
                                    {
                                        "key": "business-or-mayors-permit",
                                        "title": "Business/Mayor's Permit",
                                        "required": true
                                    },
                                ],
                            },
                        ],
                        "serviceCode": "MP",
                        "category": "service center",
                        "sequenceCode": "SC",
                    },
                ]
            },

            /*
      {
        "_id": "61c500e8ad8d7afe8ee5f629",
        "createdAt": "2021-12-09T09:40:51.656Z",
        "name": "Permits thru the Philippine National Single Window",
        "serviceCode": "service-20",
        "about": {
          "heading": "Permits thru the Philippine National Single Window",
          "description": "A Permit to Import is a written authority issued by the Commission to an individual, accredited CPE supplier, and private and government entities for the importation of type- approved/type-accepted customer premises equipment (CPE).",
          "whoMayAvail": [
            {
              "title": "Individuals"
            },
            {
              "title": "Accredited CPE Suppliers"
            },
            {
              "title": "Private and Government Entities"
            },
          ]
        },
        "applicationTypes": [
          {
            "label": "Permit to Import for Customer Premises Equipment",
            "elements": [
            ],
            "formCode": "ntc1-00",
            "requirements": [
              {
                "key": "proforma-or-commercial-invoice",
                "title": "Proforma/Commercial Invoice",
                "required": true
              },
              {
                "key": "approval-certificate",
                "title": "For CPE Supplier OR Personal/Company Use, ANY of the following:",
                "description": "• Type Approval Certificate\n• Type Acceptance Certificate\n• Grant of Equipment Conformity\n\nNote 1: CPE includes Indoor WDN equipment and Short Range Devices(SRD)",
                "required": true
              },
              {
                "key": "equipment-datasheet",
                "title": "For Demonstration and/or Testing:",
                "description": "Datasheet of proposed equipment",
              },
            ],
            "serviceCode": "IMPORT"
          },
        ]
      },
      */

            {
                "_id": "71c500e8ad8d7afe8ee5f629",
                "createdAt": "2021-12-09T09:41:51.656Z",
                "name": "Copy of Permits",
                "serviceCode": "service-21",
                "about": {
                    "heading": "Copy of Permits",
                    "description": "A Certified True Copy of a Permit is issued by the Commission to individuals, private and government entities upon request of the holder to authenticate copy of the same.\n\nA Duplicate Copy of a Permit is issued by the Commission to individuals, private and government entities upon request of the holder for the re-issuance of the same.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals"
                        },
                        {
                            "title": "Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Certified True Copy",
                        "elements": [
                        ],
                        "formCode": "ntc1-ctc-permit",
                        "requirements": [
                            {
                                "key": "document",
                                "title": "Copy of document to be authenticated",
                                "required": true
                            },
                        ],
                        "serviceCode": "CTC",
                        "category": "permit",
                    },
                    {
                        "label": "Duplicate Copy",
                        "elements": [
                        ],
                        "formCode": "ntc1-21-permit",
                        "requirements": [
                            {
                                "key": "id-picture",
                                "title": "For Radio Operator Certificate:",
                                "description": "Clear ID picture taken within the last six (6) months",
                            },
                        ],
                        "serviceCode": "DUP",
                        "category": "permit",
                    },
                ]
            },

        ],
    },
    {
        title: 'Requests/Complaints',
        key: 'complaints-requests',
        logo: require('@assets/services/complaint-request.png'),
        data: [
            {
                "_id": "71c500e8ad8d7afe8ee5f729",
                "createdAt": "2021-12-09T09:41:51.658Z",
                "name": "Requests and Complaints of Consumers/Subscribers",
                "serviceCode": "service-22",
                "about": {
                    "heading": "Requests and Complaints of Consumers/Subscribers",
                    "description": "The Commission acts on:\n\n(a) requests for blocking of mobile phone's IMEI (International Mobile Equipment Identity) and SIM (Subscriber Identity Module) due to lost/stolen cellphone units or unblocking of the same;\n\n(b) complaints of consumers/subscribers of telecommunications companies such as text scams, unwanted calls/texts and illegal/obscene/threat/other similar text messages; and\n\n(c) complaints of consumers/subscribers of telecommunications or broadcast Service Providers (i.e. Cable TV, DTH, etc.) such as billing complaint, poor customer service, poor technical service and fair usage issues.",
                    "whoMayAvail": [
                        {
                            "title": "Individuals"
                        },
                        {
                            "title": "Private and Government Entities"
                        },
                    ]
                },
                "applicationTypes": [
                    {
                        "label": "Request for Blocking of IMEI and SIM of Lost/Stolen Mobile Phone",
                        "elements": [
                        ],
                        "formCode": "ntc1-24",
                        "requirements": [
                            {
                                "key": "proof-of-ownership",
                                "title": "Proof of ownership, ANY of the following:",
                                "description": "• Official Receipt of the mobile phone\n• Box of the mobile phone with International Mobile Equipment Identity (IMEI)\n• Police Blotter",
                                "required": true
                            },
                            {
                                "key": "id",
                                "title": "Copy of valid Identification",
                                "description": "• Any government-issued ID OR Passport\n• For students, School ID\n• For cases when ID is not available, Birth Certificate OR NBI Clearance",
                                "required": true,
                            }
                        ],
                        "isDirectProcess": true,
                    },
                    {
                        "label": "Request for Unblocking of IMEI and SIM of Lost/Stolen Mobile Phone",
                        "elements": [
                        ],
                        "formCode": "ntc1-unblock",
                        "requirements": [
                            {
                                "key": "proof-of-blocking",
                                "title": "ANY of the following:",
                                "description": "• Blocking Form\n• Proof of Blocking",
                                "required": true,
                            },
                            {
                                "key": "id",
                                "title": "Valid ID",
                                "required": true,
                            },
                        ],
                        "isDirectProcess": true,
                    },
                    {
                        "label": "Complaint on Text Spam, Text Scam, or Illegal/Obscene/Threat/Other Similar Text Messages",
                        "elements": [
                        ],
                        "formCode": "ntc1-25-sms",
                        "requirements": [
                            {
                                "key": "id",
                                "title": "Copy of valid Identification",
                                "description": "• Any government-issued ID OR Passport\n• For students, School ID\n• For cases when ID is not available, Birth Certificate OR NBI Clearance",
                                "required": true,
                            },
                            {
                                "key": "screenshot",
                                "title": "Screenshot of text message",
                                "required": true,
                            },
                            {
                                "key": "notarized-complaint",
                                "title": "If complaint proceeds to administrative case:",
                                "description": "Copy of duly notarized Complaint",
                            },
                        ],
                        "isDirectProcess": true,
                    },
                    {
                        "label": "Complaint on Services offered by Telecommunications or Broadcast Service Providers",
                        "elements": [
                        ],
                        "formCode": "ntc1-25-telco",
                        "requirements": [
                            {
                                "key": "id",
                                "title": "Copy of valid Identification",
                                "description": "• Any government-issued ID OR Passport\n• For students, School ID\n• For cases when ID is not available, Birth Certificate OR NBI Clearance",
                                "required": true,
                            },
                            {
                                "key": "services-complained",
                                "title": "ANY of the following:",
                                "description": "• Service Contract\n• Billing Statement\n• Document indicating services availed by the complainant",
                                "required": true,
                            },
                            {
                                "key": "notarized-complaint",
                                "title": "If complaint proceeds to administrative case:",
                                "description": "Copy of duly notarized Complaint",
                            },
                        ],
                        "isDirectProcess": true,
                    },
                    {
                        "label": "Request for Mandatory Tape Preservation",
                        "elements": [
                        ],
                        "formCode": "ntc1-toa",
                        "requirements": [
                            {
                                "key": "letter-request",
                                "title": "Letter Request",
                                "required": true,
                            },
                        ],
                        "isDirectProcess": true,
                    },
                ]
            },
        ]
    },
];
export {
    NTCPreview,
    NTCServices,
    birthyearList, GUEST_USER,
    _classOfStation,
    _employementType,
    _employementStatus,
    _bandwidthUnits,
    permission ,
    datesArray,hoursArray,ampmArray,monthsArray,
    fuzzysearch,
    recursionObject,
    birthyearList,
    GUEST_USER,
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
