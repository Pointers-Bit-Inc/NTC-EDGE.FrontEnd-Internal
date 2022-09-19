import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {
    FlatList,
    Platform,
    ScrollView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import {isTablet} from "react-native-device-info";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import LeftSideWeb from "@atoms/left-side-web";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";
import RenderServiceMiscellaneous from "@pages/activities/application/renderServiceMiscellaneous2";
import {UploadIcon} from "@atoms/icon";
import {disabledColor, successColor, text} from "@styles/color";
import * as ImagePicker from "expo-image-picker";
import {BASE_URL} from "../../../services/config";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setRegion, setRegions} from "../../../reducers/configuration/actions";
import RegionIcon from "@assets/svg/regionIcon";
import CloseIcon from "@assets/svg/close";
import lodash from "lodash";
import {isDiff} from "../../../utils/ntc";
import parseSchedule from "@pages/schedule/parseSchedule";
import {validateText} from "../../../utils/form-validations";

export default function ConfigurationPage(props: any) {
    const dimensions = useWindowDimensions();
    const dispatch = useDispatch();
    const [value, setValue] = useState();
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const sessionToken = useSelector((state: RootStateOrAny) => state.user.sessionToken);
    const [createRegion, setCreateRegion] = useState(false)

    async function onPress(position) {
        let picker = await ImagePicker.launchImageLibraryAsync({
            presentationStyle: 0
        });
        if (!picker.cancelled) {

            let uri = picker?.uri;
            let split = uri?.split('/');
            let name = split?.[split?.length - 1];
            let mimeType = name?.split('.')?.[1] || picker?.type;

            let _file = {
                name,
                mimeType,
                uri,
            };
            let base64 = _file?.uri;
            let mime = isMobile ? _file?.mimeType : base64?.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
            let mimeResult: any = null;
            if (mime && mime.length) {
                mimeResult = isMobile ? mime : mime[1];
            }
            let _mimeType = isMobile ? mime : mimeResult?.split("/")?.[1];

            await fetch(base64)
                .then(res => {

                    return res?.blob()
                })
                .then(blob => {

                    const fd = new FormData();
                    const file = isMobile ? {
                        name: _file?.name,
                        type: 'application/octet-stream',
                        uri: _file?.uri,
                    } : new File([blob], (
                        _file?.name + "." + _mimeType || _file?.mimeType));

                    fd.append('profilePicture', file, (
                        _file?.name + "." + _mimeType || _file?.mimeType));

                    const API_URL = `${BASE_URL}/regions/${region?._id}/${position}/upload-signature`;

                    fetch(API_URL, {
                        method: 'POST', body: fd, headers: {
                            'Authorization': `Bearer ${sessionToken}`,
                        }
                    })
                        .then(res => {

                            return res?.json()
                        })
                })
        }
    }

    const regions = useSelector((state: RootStateOrAny) => state.configuration.regions);

    const region = useSelector((state: RootStateOrAny) => state.configuration.region);
    const fetchConfigurations = () => {
        setLoading(true);
        axios.get(BASE_URL + "/regions?page=" + page, {
            headers: {
                Authorization: "Bearer ".concat(sessionToken)
            }
        }).then((response) => {
            dispatch(setRegions(response.data))
            setLoading(false);
        }).catch((response) => {

            console.log(response.response)
        })
    }
    const regionsMemo = useMemo(() => {
        return regions
    }, [regions])

    useEffect(() => {
        return fetchConfigurations()
    }, [regions.length == 0])

    function onDelete(id) {

    }

    const onItemPress = useCallback((item) => {

        dispatch(setRegion(item))
        let _originalForm = [...JSON.parse(JSON.stringify(originalForm))]
        parseSchedule(_originalForm, item)
        setFormValue(_originalForm)


        if (isMobile) {
            props.navigation.push("EditConfigurationScreen")
        }

    }, [formValue])
    const renderListItem = ({item}) => {
        return <TouchableOpacity onPress={() => {
            if (!isMobile) {
                let _originalForm = [...JSON.parse(JSON.stringify(originalForm))]
                parseSchedule(_originalForm, item);
                setOriginalForm(_originalForm)
            }
            onItemPress(item)

        }}><View style={[
            styles?.scheduleContainer,
        ]}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <View style={{flex: 0.95}}>
                    <View style={styles?.scheduleRow}>
                        <RegionIcon color={"#000"}/>
                        <Text style={styles?.scheduleText}>{item?.label}</Text>
                    </View>
                </View>
                <View style={{flex: 0.05}}>
                    <TouchableOpacity onPress={() => onDelete(item.id)}>
                        <CloseIcon/>
                    </TouchableOpacity>
                </View>

            </View>


        </View>
        </TouchableOpacity>
    }


    function onUpdateCreateRegion(post: string) {

    }

    const [originalForm, setOriginalForm] = useState([
        {
            id: 1,
            stateName: "commissioner",
            label: 'Commissioner',
            value: "",
            error: false,
            type: '',
        },
        {
            id: 1,
            stateName: "director",
            label: 'Director',
            value: "",
            error: false,
            type: '',
        },
    ]);
    const [formValue, setFormValue] = useState(originalForm);
    const updateValid = useMemo(() => {
        return isDiff(lodash.map(formValue, 'value'), lodash.map(originalForm, 'value'));
    }, [formValue, originalForm])

    const onUpdateForm = (id: number, text: any, element?: string, _key?: string) => {

        const index = formValue?.findIndex(app => app?.id == id);
        let newArr = [...formValue];
        newArr[index]['value'] = text;
        if (typeof text == "string") {
            newArr[index]['error'] = !validateText(text);
        }

        setFormValue(newArr)
    };

    const onClose = () => {
        setCreateRegion(false)
        dispatch(setRegion({}))
    };
console.log(region?.configuration?.director?.signature)
    const [edit, setEdit] = useState(false)
    return (
        <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
            <LeftSideWeb>
                <View style={styles.header}>
                    <Header title={"Configurations"}>
                        <TouchableOpacity onPress={() => {
                            setEdit(edit => !edit)

                        }}>
                            <Text>Edit</Text>
                        </TouchableOpacity>
                    </Header>
                    <View style={{marginHorizontal: 26,}}>

                        <View style={{
                            paddingTop: 14,
                            paddingBottom: 12,
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexDirection: "row",
                        }}>
                            <View style={{flex: 1, paddingRight: 15}}>
                                <TextInput value={value} onChangeText={text => {
                                    setValue(text)
                                }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                                <View style={styles.searchIcon}>
                                    <SearchIcon/>
                                </View>
                            </View>


                        </View>


                    </View>

                </View>
                <View style={{flex: 1}}>
                    <ScrollView>

                        <FlatList
                            data={regionsMemo}
                            contentContainerStyle={{padding: 10,}}
                            renderItem={renderListItem}
                            keyExtractor={item => item._id}
                        />
                        <RenderServiceMiscellaneous edit={edit} service={{
                            // SERVICE 1
                            "ExaminationFee": {
                                "ExamFee": 50,
                            },
                            // SERVICE 2
                            "1RTG": {
                                "CertificateFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "2RTG": {
                                "CertificateFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            "3RTG": {
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "1PHN": {
                                "CertificateFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            "2PHN": {
                                "CertificateFee": 100,
                                "DocumentaryStampTax": 30
                            },
                            "3PHN": {
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "ROC-TEMPORARY": {
                                "CertificateFee": 100,
                                "DocumentaryStampTax": 30
                            },
                            "RROC-aircraft": {
                                "CertificateFee": 100,
                                "DocumentaryStampTax": 30
                            },
                            "SROP": {
                                "FilingFee": 20,
                                "SeminarFee": 20,
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "GROC": {
                                "FilingFee": 10,
                                "SeminarFee": 20,
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "RROC-RLM": {
                                "FilingFee": 10,
                                "SeminarFee": 20,
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "MODIFICATION": {
                                "ModificationFee": 120,
                                "DocumentaryStampTax": 120
                            },
                            // SERVICE 3
                            "AT-ROC": {
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "AT-RSL-ClassA": {
                                "FilingFee": 60,
                                "LicenseFee": 120,
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "AT-RSL-ClassB": {
                                "FilingFee": 60,
                                "LicenseFee": 132,
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "AT-RSL-ClassC": {
                                "FilingFee": 60,
                                "LicenseFee": 144,
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "AT-RSL-ClassD": {
                                "FilingFee": 60,
                                "LicenseFee": 144,
                                "CertificateFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "AT-LIFETIME": {
                                "FilingFee": 60,
                                "LicenseFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "AT-CLUB-RSL-Simplex": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 700,
                                "DocumentaryStampTax": 30
                            },
                            "AT-CLUB-RSL-Repeater": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 1320,
                                "DocumentaryStampTax": 30
                            },
                            "AT-TEMPORARY-ClassA": {
                                "FilingFee": 60,
                                "LicenseFee": 120,
                                "CertificateFee": 60,
                                "PurchasePermitFee": 50,
                                "PossessPermitFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "AT-TEMPORARY-ClassB": {
                                "FilingFee": 60,
                                "LicenseFee": 132,
                                "CertificateFee": 60,
                                "PurchasePermitFee": 50,
                                "PossessPermitFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "AT-TEMPORARY-ClassC": {
                                "FilingFee": 60,
                                "LicenseFee": 144,
                                "CertificateFee": 60,
                                "PurchasePermitFee": 50,
                                "PossessPermitFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "FEEPUR/POS/S/TF-AT-RSL": {
                                "PurchasePermitFee": 50,
                                "PossessPermitFee": 50,
                                "Sell/TransferPermitFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "FEEPUR/POS/S/TF-AT-CLUB-RSL": {
                                "PurchasePermitFee": 50,
                                "PossessPermitFee": 50,
                                "Sell/TransferPermitFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "FEEPUR/POS/S/TF-AT-TEMPORARY": {
                                "PurchasePermitFee": 50,
                                "PossessPermitFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "FEEAT": {
                                "PurchasePermitFee": 50,
                                "FilingFee": 50,
                                "CertificateFee": 50,
                                "LicenseFee": 50,
                                "PossessPermitFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "VANITY-AT": {
                                "SpecialPermitFee": 1000,
                                "DocumentaryStampTax": 30
                            },
                            "FEESPECIAL-EVENT-AT": {
                                "SpecialPermitFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            "Modification-AT-ROC": {
                                "FilingFee": 50,
                                "ModificationFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "Modification-AT-RSL": {
                                "FilingFee": 60,
                                "ModificationFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "Modification-AT-LIFETIME": {
                                "FilingFee": 50,
                                "ModificationFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "Modification-AT-CLUB-RSL": {
                                "FilingFee": 180,
                                "ModificationFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            "FEEPUR/POS-ASL-HighPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 240,
                                "PossessPermitFee": 120,
                                "ConstructionPermitFee": 1080,
                                "LicenseFee": 1080,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "FEEPUR/POS-ASL-MediumPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "ConstructionPermitFee": 840,
                                "LicenseFee": 960,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "FEEPUR/POS-ASL-LowPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 96,
                                "PossessPermitFee": 60,
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 840,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "FASL-HighPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 240,
                                "PossessPermitFee": 120,
                                "ConstructionPermitFee": 1080,
                                "LicenseFee": 1080,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "FASL-MediumPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "ConstructionPermitFee": 840,
                                "LicenseFee": 960,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "FASL-LowPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 96,
                                "PossessPermitFee": 60,
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 840,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "FASL-HighPowered-Modification": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 1080,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "FASL-MediumPowered-Modification": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 840,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "FASL-LowPowered-Modification": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 600,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "ASL-HighPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 240,
                                "PossessPermitFee": 120,
                                "ConstructionPermitFee": 960,
                                "LicenseFee": 1320,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "ASL-MediumPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "ConstructionPermitFee": 840,
                                "LicenseFee": 1080,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "ASL-LowPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 96,
                                "PossessPermitFee": 60,
                                "ConstructionPermitFee": 720,
                                "LicenseFee": 840,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "ASL-HighPowered-Modification": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 960,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "ASL-MediumPowered-Modification": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 840,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "ASL-LowPowered-Modification": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 720,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 5
                            "SSL-Domestic-HighPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 240,
                                "PossessPermitFee": 120,
                                "ConstructionPermitFee": 720,
                                "LicenseFee": 840,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "SSL-Domestic-MediumPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 720,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "SSL-Domestic-LowPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 96,
                                "PossessPermitFee": 60,
                                "ConstructionPermitFee": 480,
                                "LicenseFee": 600,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "SSL-International-HighPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 240,
                                "PossessPermitFee": 120,
                                "ConstructionPermitFee": 1200,
                                "LicenseFee": 1500,
                                "InspectionFee": 1200,
                                "DocumentaryStampTax": 30
                            },
                            "SSL-International-MediumPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "ConstructionPermitFee": 1200,
                                "LicenseFee": 1500,
                                "InspectionFee": 1200,
                                "DocumentaryStampTax": 30
                            },
                            "SSL-International-LowPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 96,
                                "PossessPermitFee": 60,
                                "ConstructionPermitFee": 1200,
                                "LicenseFee": 1500,
                                "InspectionFee": 1200,
                                "DocumentaryStampTax": 30
                            },
                            "COASTAL-HighPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 240,
                                "PossessPermitFee": 120,
                                "ConstructionPermitFee": 1320,
                                "LicenseFee": 1440,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "COASTAL-MediumPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "ConstructionPermitFee": 960,
                                "LicenseFee": 1200,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "COASTAL-LowPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 96,
                                "PossessPermitFee": 60,
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 1080,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "SSL-Domestic-Modification-HighPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 720,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "SSL-Domestic-Modification-MediumPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 600,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "SSL-Domestic-Modification-LowPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 480,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "SSL-International-Modification-HighPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 1200,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 60
                            },
                            "SSL-International-Modification-MediumPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 1200,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 60
                            },
                            "SSL-International-Modification-LowPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 1200,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 60
                            },
                            "COASTAL-Modification-HighPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 1320,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "COASTAL-Modification-MediumPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 960,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "COASTAL-Modification-LowPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 600,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "COASTAL-High": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "ConstructionPermitFee": 480,
                                "LicenseFee": 720,
                                "InspectionFee": 720,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "COASTAL-VeryHigh": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "ConstructionPermitFee": 480,
                                "LicenseFee": 480,
                                "InspectionFee": 480,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            // Service 6
                            "PUB-COASTAL-HighPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 240,
                                "PossessPermitFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-MediumPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-LowPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 96,
                                "PossessPermitFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-RadioTelegraphy-HighPowered": {
                                "ConstructionPermitFee": 1200,
                                "LicenseFee": 2160,
                                "InspectionFee": 840,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-RadioTelegraphy-MediumPowered": {
                                "ConstructionPermitFee": 840,
                                "LicenseFee": 1680,
                                "InspectionFee": 840,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-RadioTelegraphy-LowPowered": {
                                "ConstructionPermitFee": 480,
                                "LicenseFee": 1200,
                                "InspectionFee": 840,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-High-HighPowered": {
                                "ConstructionPermitFee": 480,
                                "LicenseFee": 1560,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-High-MediumPowered": {
                                "ConstructionPermitFee": 480,
                                "LicenseFee": 1080,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-High-LowPowered": {
                                "ConstructionPermitFee": 480,
                                "LicenseFee": 480,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-RadioTelephony-VeryHighFrequency": {
                                "ConstructionPermitFee": 480,
                                "LicenseFee": 1200,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-Modification-RadioTelegraphy-HighFrequency-HighPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 1200,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-Modification-RadioTelegraphy-HighFrequency-MediumPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 840,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-Modification-RadioTelegraphy-HighFrequency-LowPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 480,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-Modification-RadioTelephony-HighFrequency-HighPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 480,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-Modification-RadioTelephony-HighFrequency-MediumPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 480,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-Modification-RadioTelephony-HighFrequency-LowPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 480,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-Modification-RadioTelephony-VeryHighFrequency-HighPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 480,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-renew-RadioTelephony-HighPowered": {
                                "LicenseFee": 2160,
                                "InspectionFee": 840,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-renew-RadioTelegraphy-MediumPowered": {
                                "LicenseFee": 1680,
                                "InspectionFee": 840,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-renew-RadioTelegraphy-LowPowered": {
                                "LicenseFee": 1200,
                                "InspectionFee": 840,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-renew-RadioTelephony-HighFrequency-HighPowered": {
                                "LicenseFee": 1560,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-renew-RadioTelephony-HighFrequency-MediumPowered": {
                                "LicenseFee": 1080,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-renew-RadioTelephony-HighFrequency-LowPowered": {
                                "LicenseFee": 480,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "PUB-COASTAL-renew-RadioTelephony-VeryHighFrequency": {
                                "LicenseFee": 1200,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            // Service 8
                            "RSL-renew": {
                                "LicenseFee": 480,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-renew-BTS": {
                                "LicenseFee": 480,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-renew-PublicTrunked": {
                                "LicenseFee": 1680,
                                "InspectionFee": 360,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-renew-TC": {
                                "LicenseFee": 360,
                                "InspectionFee": 420,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-Modification-HighPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 360,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-Modification-MediumPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 360,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-Modification-LowPowered": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 360,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "SUF-LowerThan1GHz": {
                                "MetroManila": 6,
                                "HighlyUrbanizedCities": 5,
                                "AllOtherAreas": 4
                            },
                            "SUF-1-10": {
                                "MetroManila": 5,
                                "HighlyUrbanizedCities": 4,
                                "AllOtherAreas": 3
                            },
                            "SUF-10-20": {
                                "MetroManila": 4,
                                "HighlyUrbanizedCities": 3,
                                "AllOtherAreas": 2
                            },
                            "SUF-20above": {
                                "MetroManila": 3,
                                "HighlyUrbanizedCities": 2,
                                "AllOtherAreas": 1.25
                            },
                            "SUF-SatelliteService": {
                                "MetroManila": 5,
                                "HighlyUrbanizedCities": 2.5,
                                "AllOtherAreas": 1.75
                            },
                            "SUF-PublicRadioPaging": {
                                "MetroManila": 5,
                                "HighlyUrbanizedCities": 2.5,
                                "AllOtherAreas": 1.25
                            },
                            "SUF-PublicTrunked": {
                                "MetroManila": 5,
                                "HighlyUrbanizedCities": 2.5,
                                "AllOtherAreas": 1.25
                            },
                            "SUF-WirelessLocalLoop": {
                                "MetroManila": 1,
                                "HighlyUrbanizedCities": 0.5,
                                "AllOtherAreas": 0.25
                            },
                            "SUF-PointToMultipoint": {
                                "Fee": 5
                            },
                            "SUF-PointTopoint": {
                                "LowerThan1GHz": 2.5,
                                "1GHz-10GHz": 2,
                                "10GHz-20GHz": 1.5,
                                "20GHzAbove": 1.25
                            },
                            "RSL-PossessionForStorageHigh": {
                                "PossessPermitFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-PossessionForStorageMedium": {
                                "PossessPermitFee": 96,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-PossessionForStorageLow": {
                                "PossessPermitFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 9
                            "RSL-PUR/POS-HighPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 240,
                                "PossessPermitFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-PUR/POS-MediumPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 120,
                                "PossessPermitFee": 96,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-PUR/POS-LowPowered": {
                                "FilingFee": 180,
                                "PurchasePermitFee": 96,
                                "PossessPermitFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 10
                            "Simplex-HighPowered-Fixed": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 600,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-HighPowered-LandBase": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 720,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-HighPowered-LandMobile": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-HighPowered-Portable": {
                                "ConstructionPermitFee": 0,
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-MediumPowered-Fixed": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-MediumPowered-LandBase": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 600,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-MediumPowered-LandMobile": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 360,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-MediumPowered-Portable": {
                                "ConstructionPermitFee": 0,
                                "LicenseFee": 360,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-LowPowered-Fixed": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 360,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-LowPowered-LandBase": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-LowPowered-LandMobile": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 240,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Simplex-LowPowered-Portable": {
                                "ConstructionPermitFee": 0,
                                "LicenseFee": 240,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-HighPowered-Repeater": {
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 1320,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-HighPowered-Fixed": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 1200,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-HighPowered-LandBase": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 1440,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-HighPowered-LandMobile": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 960,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-HighPowered-Portable": {
                                "ConstructionPermitFee": 0,
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-MediumPowered-Repeater": {
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 1320,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-MediumPowered-Fixed": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 960,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-MediumPowered-LandBase": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 1200,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-MediumPowered-LandMobile": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 720,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-MediumPowered-Portable": {
                                "ConstructionPermitFee": 0,
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-LowPowered-Repeater": {
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 1320,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-LowPowered-Fixed": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 720,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-LowPowered-LandBase": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 960,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-LowPowered-LandMobile": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-LowPowered-Portable": {
                                "ConstructionPermitFee": 0,
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-WirelessDataNetwork-Fixed": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-WirelessDataNetwork-LandMobile": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 240,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Duplex-WirelessDataNetwork-Portable": {
                                "ConstructionPermitFee": 0,
                                "LicenseFee": 240,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "Modification-RT": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 600,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "Modification-FX,FB,ML": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 240,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "Modification-P": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 0,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "SUF-Simplex-FB": {
                                "MetroManila": 20,
                                "HighlyUrbanizedCities": 10,
                                "AllOtherAreas": 5
                            },
                            "SUF-Simplex-ML,P": {
                                "MetroManila": 2,
                                "HighlyUrbanizedCities": 1,
                                "AllOtherAreas": 0.5
                            },
                            "SUF-Duplex-FB": {
                                "MetroManila": 50,
                                "HighlyUrbanizedCities": 25,
                                "AllOtherAreas": 12.50
                            },
                            "SUF-Duplex-ML,P": {
                                "MetroManila": 2,
                                "HighlyUrbanizedCities": 1,
                                "AllOtherAreas": 0.50
                            },
                            "SUF-PublicTrunked-RT,FX,FB,ML,P": {
                                "MetroManila": 5,
                                "HighlyUrbanizedCities": 2.5,
                                "AllOtherAreas": 1.25
                            },
                            "SUF-PrivateTrunked-RT,FX,FB,ML,P": {
                                "MetroManila": 20,
                                "HighlyUrbanizedCities": 10,
                                "AllOtherAreas": 5
                            },
                            "SUF-PointToPoint-FX": {
                                "LowerThan1": 2.5,
                                "1-10": 2,
                                "10-20": 1.5,
                                "20Above": 1.25
                            },
                            "SUF-WirelessDataNetwork": {
                                "DataRateBelow11MBps": 500,
                                "DataRateMoreThan11MBps": 1000
                            },
                            // SERVICE 11
                            "RSL-RENEW-SIMPLEX-HIGH-FIXED": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 600,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-HIGH-LANDBASE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 720,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-HIGH-LANDMOBILE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-HIGH-PORTABLE": {
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-MEDIUM-FIXED": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-MEDIUM-LANDBASE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 600,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-MEDIUM-LANDMOBILE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 360,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-MEDIUM-PORTABLE": {
                                "LicenseFee": 360,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-LOW-FIXED": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 360,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-LOW-LANDBASE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-LOW-LANDMOBILE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 240,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-SIMPLEX-LOW-PORTABLE": {
                                "LicenseFee": 240,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-HIGH-REPEATER": {
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 1320,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-HIGH-FIXED": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 1200,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-HIGH-LANDBASE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 1440,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-HIGH-LANDMOBILE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 960,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-HIGH-PORTABLE": {
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-MEDIUM-REPEATER": {
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 1320,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-MEDIUM-FIXED": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 960,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-MEDIUM-LANDBASE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 1200,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-MEDIUM-LANDMOBILE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 720,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-MEDIUM-PORTABLE": {
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-LOW-REPEATER": {
                                "ConstructionPermitFee": 600,
                                "LicenseFee": 1320,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-LOW-FIXED": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 720,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-LOW-LANDBASE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 960,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-LOW-LANDMOBILE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-LOW-PORTABLE": {
                                "LicenseFee": 480,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-WDN-FIXED": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 480,
                                "InspectionFee": 480,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-WDN-LANDMOBILE": {
                                "ConstructionPermitFee": 240,
                                "LicenseFee": 240,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-RENEW-DUPLEX-WDN-PORTABLE": {
                                "LicenseFee": 240,
                                "InspectionFee": 240,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-MODIFICATION-RT": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 600,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-MODIFICATION-FX,FB,ML": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 240,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-MODIFICATION-P": {
                                "FilingFee": 180,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-MODIFICATION-WDN-FX,ML": {
                                "FilingFee": 180,
                                "ConstructionPermitFee": 240,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-MODIFICATION-WDN-P": {
                                "FilingFee": 180,
                                "ModificationFee": 180,
                                "DocumentaryStampTax": 30
                            },
                            "RSL-SUF-MetroManila": {
                                "Simplex-FB": 20,
                                "Simplex-ML,P": 2,
                                "Duplex-FB": 50,
                                "Duplex-ML,P": 2,
                                "PublicTrunked": 5,
                                "PrivateTrunked": 20
                            },
                            "RSL-SUF-HighlyUrbanizedCities": {
                                "Simplex-FB": 10,
                                "Simplex-ML,P": 1,
                                "Duplex-FB": 25,
                                "Duplex-ML,P": 1,
                                "PublicTrunked": 2.5,
                                "PrivateTrunked": 10
                            },
                            "RSL-SUF-AllOtherAreas": {
                                "Simplex-FB": 5,
                                "Simplex-ML,P": 0.50,
                                "Duplex-FB": 12.50,
                                "Duplex-ML,P": 0.50,
                                "PublicTrunked": 1.25,
                                "PrivateTrunked": 5
                            },
                            "RSL-SUF-Fixed": {
                                "<1": 2.50,
                                "1-10": 2,
                                "10-20": 1.50,
                                ">20": 1.25
                            },
                            "RSL-SUF-WDN": {
                                "<11MBPS": 500,
                                ">11MPBS": 1000
                            },
                            // SERVICE 12
                            "RS-SRO-HIGH": {
                                "PossessPermitFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            "RS-SRO-MEDIUM": {
                                "PossessPermitFee": 96,
                                "DocumentaryStampTax": 30
                            },
                            "RS-SRO-LOW": {
                                "PossessPermitFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            "RS-SRO-WDN": {
                                "PossessPermitFee": 60,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 13
                            "RS-DEMO": {
                                "FilingFee": 180,
                                "Demo/PropagateFee": 85,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 14
                            "RCE-PTR": {
                                "PermitToTransportFee": 85,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 15
                            "RCE-DEALER": {
                                "FilingFee": 180,
                                "Permit/AccreditationFee": 1200,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "RCE-MANUFACTURER": {
                                "FilingFee": 180,
                                "Permit/AccreditationFee": 1760,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "RCE-SERVICE-CENTER": {
                                "FilingFee": 180,
                                "Permit/AccreditationFee": 720,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "CPE-NON-MOBILE PHONES": {
                                "FilingFee": 180,
                                "Permit/AccreditationFee": 1200,
                                "ModificationFee": 120,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "CPE-MOBILE PHONES": {
                                "FilingFee": 500,
                                "Permit/AccreditationFee": 2500,
                                "ModificationFee": 120,
                                "InspectionFee": 1500,
                                "DocumentaryStampTax": 30
                            },
                            "MOBILE PHONE-DEALER-MAIN": {
                                "FilingFee": 500,
                                "Permit/AccreditationFee": 2500,
                                "ModificationFee": 120,
                                "InspectionFee": 1500,
                                "DocumentaryStampTax": 30
                            },
                            "MOBILE-PHONE-DEALER-BRANCH": {
                                "FilingFee": 500,
                                "Permit/AccreditationFee": 1500,
                                "ModificationFee": 120,
                                "InspectionFee": 1500,
                                "DocumentaryStampTax": 30
                            },
                            "MOBILE-PHONE-RETAILER/RESELLER": {
                                "FilingFee": 500,
                                "Permit/AccreditationFee": 1500,
                                "ModificationFee": 120,
                                "InspectionFee": 1500,
                                "DocumentaryStampTax": 30
                            },
                            "MOBILE-PHONE-SERVICE-CENTER": {
                                "FilingFee": 180,
                                "Permit/AccreditationFee": 1200,
                                "ModificationFee": 120,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "MODIFICATION-RCE-DEALER": {
                                "ModificationFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            "MODIFICATION-RCE-MANUFACTURER": {
                                "ModificationFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            "MODIFICATION-RCE-SERVICE CENTER": {
                                "ModificationFee": 120,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 16
                            "RFID-HIGH": {
                                "FilingFee": 180,
                                "RegistrationFee": 300,
                                "DocumentaryStampTax": 30
                            },
                            "RFID-LOW": {
                                "FilingFee": 180,
                                "RegistrationFee": 100,
                                "DocumentaryStampTax": 30
                            },
                            "RFID-SRD/WDN": {
                                "FilingFee": 180,
                                "RegistrationFee": 50,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 17
                            "TVRO-COMMERCIAL-REGISTRATION": {
                                "RegistrationFee": 6500,
                                "DocumentaryStampTax": 30
                            },
                            "TVRO-RSL": {
                                "LicenseFee": 2600,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            //SERVICE 18
                            "TVRO-NON-COMMERCIAL-REGISTRATION": {
                                "RegistrationFee": 6500,
                                "DocumentaryStampTax": 30
                            },
                            "TVRO-RSL-RENEW": {
                                "LicenseFee": 2600,
                                "DocumentaryStampTax": 30
                            },
                            "CATV-RSL-NEW": {
                                "FilingFee": 400,
                                "ConstructionPermitFee": 1140,
                                "LicenseFee": 3600,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            "CATV-RSL-RENEW": {
                                "LicenseFee": 3600,
                                "InspectionFee": 720,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 19
                            "REG-VAS-RENEW": {
                                "ARF": 6000,
                                "EXTENSION": 1000,
                                "DocumentaryStampTax": 30
                            },
                            // SERVICE 20
                            "IMPORT/CERT": {
                                "IMF": 240,
                                "CERT": 120,
                                "DocumentaryStampTax": 30
                            },
                            // service 21
                            "CERTIFICATION-ROC": {
                                "FirstCopy": 6,
                                "SucceedingCopies": 2.50,
                                "DocumentaryStampTax": 30
                            },
                            "CERTIFICATION-PERMITS AND LICENCES": {
                                "FirstCopy": 24,
                                "SucceedingCopies": 6,
                                "DocumentaryStampTax": 30
                            },
                            "DUPLICATE": {
                                "DuplicateFee": 120,
                                "DocumentaryStampTax": 30
                            }
                        }
                        }/>
                    </ScrollView>


                </View>
            </LeftSideWeb>
            {
                !(
                    (
                        isMobile && !(
                            Platform?.isPad || isTablet()))) && (!createRegion) && lodash.isEmpty(region) && dimensions?.width > 768 &&
                <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                    <NoActivity/>
                    <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                        selected</Text>


                </View>
            }
            {
                !lodash.isEmpty(region) && Platform.OS == "web" ? <View style={[{flex: 1, backgroundColor: "#fff",}]}>

                    <Header size={24} title={"Region: "}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>


                    <View style={{

                       flex: 1

                    }}>
                        <View style={{padding: 20, justifyContent: 'space-between', alignItems: 'center',}}>
                            <View style={styles.border}>
                                <Image  resizeMode={"contain"} source={region?.configuration?.director?.signature || require('@assets/avatar.png')} style={{height: 200, width: 200}}/>
                            </View>
                            <TouchableOpacity onPress={() => onPress('director')}>
                                <View style={styles.uploadSignature}>
                                    <UploadIcon color={text.info}/>
                                    <Text>Director Signature</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{padding: 20, justifyContent: 'space-between', alignItems: 'center',}}>
                        <TouchableOpacity onPress={() => onPress('commissioner')}>
                            <View style={styles.border}>
                                <Image resizeMode={"contain"} source={region?.configuration?.commissioner?.signature || require('@assets/avatar.png')} style={{height: 200, width: 200}}/>
                            </View>
                            <View style={styles.uploadSignature}>
                                <UploadIcon color={text.info}/>
                                <Text>Commissioner Signature</Text>
                            </View>
                        </TouchableOpacity>
                        </View>
                    </View>
                        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <View style={{alignItems: "center"}}>
                            <TouchableOpacity onPress={() => onUpdateCreateRegion('patch')} disabled={!updateValid}
                                              style={{
                                                  backgroundColor: updateValid ? successColor : disabledColor,
                                                  paddingVertical: 10,
                                                  paddingHorizontal: 20,
                                                  borderRadius: 10
                                              }}>

                                <Text style={[styles.text, {color: "#fff"}]} size={14}>Update Region</Text>

                            </TouchableOpacity>
                        </View>




                </View> : <></>
            }


            {(createRegion && lodash.isEmpty(region) && !isMobile) ?
                <View style={[{flex: 1, backgroundColor: "#fff",}]}>
                    <Header size={24} title={"Create Region"}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>

                    <View style={{
                        bottom: 0,
                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity onPress={() => onUpdateCreateRegion('post')} style={styles.scheduleButton}>

                            <Text style={[styles.text, {color: "#fff"}]} size={14}>Create Region</Text>

                        </TouchableOpacity>
                    </View>
                </View> : <></>

            }
        </View>
    )
}
