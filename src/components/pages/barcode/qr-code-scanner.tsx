import React, {useEffect, useState,} from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import axios from "axios";
import QrScanCodeIcon from "@assets/svg/qrCodeScanIcon";
import UploadIcon from "@assets/svg/uploadQrCode";
import * as ImagePicker from "expo-image-picker";
import CloseIcon from "@assets/svg/close";
import CheckMarkIcon from "@assets/svg/checkmark";
import ErrorIcon from "@assets/svg/erroricon";
import {RootStateOrAny, useSelector} from "react-redux";
const finderWidth: number = 280;
const finderHeight: number = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;
export default function QrCodeScan(props: any) {
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [isVerified, setIsVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState<any>(BarCodeScanner.Constants.Type.back);
    const [scanned, setScanned] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {

        try {
            setIsLoading(true)
            const {type, data, bounds: {origin} = {}} = scanningResult;

            if (!scanned && (origin ? 1: 0)) {

                if(origin ? 1: 0){
                    const {x, y}: any = origin;
                    if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
                        setIsLoading(false)
                        setIsVerified(true)
                        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
                    }
                }

            }else{
                axios.get(data, { headers: { Authorization: "Bearer ".concat(user.sessionToken) } }).then((response) =>{

                    setIsLoading(false)
                    setIsVerified(true)
                }).catch((e) =>{
                    setIsLoading(false)
                    setIsError(true)
                })


            }
        }catch (error) {
            setIsLoading(false)
        }

    };
    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let picker = await ImagePicker.launchImageLibraryAsync()
        return picker
    }
    const decode = async () => {
        setIsLoading(true)
        try {
            openImagePickerAsync().then(async (r: any) => {
                if(!r.uri) return setIsLoading(false)
                const results = await BarCodeScanner.scanFromURLAsync(r.uri)
                axios.get(results[0]?.data, { headers: { Authorization: "Bearer ".concat(user.sessionToken) } }).then((response) =>{
                    setIsLoading(false)
                    setIsVerified(true)
                }).catch((e) =>{
                    setIsLoading(false)
                    setIsError(true)
                })

            })


        } catch (error) {
            setIsLoading(false)
            setIsError(true)
        }
    }
    if (hasPermission === null) {

        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
                            type={type}
                            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                            style={[StyleSheet.absoluteFillObject, styles.container]}>

                <BarcodeMask edgeColor="#62B1F6" showAnimatedLine/>

            </BarCodeScanner>
            <View style={styles.group7}>
                <View style={styles.header}>
                    <View style={styles.rect}>
                        <Text style={styles.qrReader}>QR Reader</Text>
                    </View>
                </View>
                {isLoading && <View style={styles.group34}>
                    <View style={styles.rect19}>
                        <ActivityIndicator style={styles.icon2}/>
                    </View>
                </View>}
                {isVerified && <View style={styles.group32}>
                    <View style={styles.rect13}>
                        <View style={styles.group31}>
                            <View style={styles.group30}>
                                <View style={styles.rect14}>
                                    <View style={styles.group33}>
                                        <View style={{width: "33.33%"}}>
                                            <View style={styles.group12}>
                                                <View style={styles.rect15}>
                                                    <CheckMarkIcon></CheckMarkIcon>
                                                </View>
                                                <Text style={styles.verified}>Verified</Text>
                                            </View>
                                        </View>


                                        <TouchableOpacity onPress={() => setIsVerified(false)} style={styles.rect18}>
                                            <CloseIcon style={{alignSelf: "flex-end"}}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rect17}></View>
                            <View style={styles.group29}>
                                <View style={styles.group17}>
                                    <Text style={styles.examDetails}>BASIC INFO</Text>
                                    <View style={styles.group18}>
                                        <View style={styles.group19}>
                                            <Text style={styles.name2}>Name:</Text>
                                            <Text style={styles.address2}>Address:</Text>
                                        </View>
                                        <View style={styles.group20}>
                                            <Text style={styles.name3}>Name:</Text>
                                            <Text style={styles.address3}>Address:</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.group17}>
                                    <Text style={styles.examDetails}>EXAM DETAILS</Text>
                                    <View style={styles.group18}>
                                        <View style={styles.group19}>
                                            <Text style={styles.name2}>Venue:</Text>
                                            <Text style={styles.address2}>Date:</Text>
                                            <Text style={styles.address2}>Time:</Text>
                                        </View>
                                        <View style={styles.group20}>
                                            <Text style={styles.name3}>Name:</Text>
                                            <Text style={styles.address3}>Address:</Text>
                                            <Text style={styles.address3}>Address:</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.group17}>
                                    <Text style={styles.examDetails}>PAYMENT DETAILS</Text>
                                    <View style={styles.group18}>
                                        <View style={styles.group19}>
                                            <Text style={styles.name2}>O.R. No.:</Text>
                                            <Text style={styles.address2}>Amount::</Text>
                                            <Text style={styles.address2}>Date:</Text>
                                        </View>
                                        <View style={styles.group20}>
                                            <Text style={styles.name3}>Name:</Text>
                                            <Text style={styles.address3}>Address:</Text>
                                            <Text style={styles.address3}>Address:</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>}
                {isError && <View style={styles.group11}>
                    <View style={styles.group10}>
                        <View style={styles.rect6}>
                            <ErrorIcon></ErrorIcon>
                        </View>
                        <Text style={styles.invalidQrCode}>Invalid QR Code</Text>
                        <View style={styles.group9}>
                            <View style={styles.rect9}>
                                <Text style={styles.pleaseTryAgain}>Please try again</Text>
                            </View>
                        </View>
                        <View style={styles.group8}>
                            <View style={styles.rect11}></View>
                            <TouchableOpacity onPress={() => setIsError(false)} style={styles.rect12}>
                                <Text style={styles.close}>CLOSE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>}
                <View style={styles.group6}>
                    <View style={styles.group3}>
                        <View style={styles.rect2}>

                            <TouchableOpacity onPress={handleBarCodeScanned} style={styles.group2} >
                                <QrScanCodeIcon  style={styles.icon}></QrScanCodeIcon>
                                <Text style={styles.generateQrCode}>Generate QR Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.group3}>
                        <View style={styles.rect2}>
                            <TouchableOpacity onPress={decode}  style={styles.group2}>
                                <UploadIcon style={styles.icon}/>
                                <Text style={styles.generateQrCode1}>Upload QR Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    rect19: {

        justifyContent: "center",
        flex: 1
    },
    icon2: {
        color: "rgba(128,128,128,1)",
        fontSize: 40,
        alignSelf: "center"
    },
    group34:{
        position: "absolute",
        width: "100%",
        height: "100%"
    },
    container: {
        flex: 1
    },
    group7: {
        width: "100%",
        height: "95%",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "center"
    },
    header: {
        height: 100,
        width: "100%"
    },
    rect: {
        height: 100,
        backgroundColor: "rgba(0,65,172,1)"
    },
    qrReader: {
        color: "rgba(255,255,255,1)",
        fontSize: 18,
        textAlign: "center",
        marginTop: 50
    },
    group32: {
        width: 350,
        zIndex: 1,
        height: height < 668 ? 480 : 495,
        position: "absolute",
        top: "19%",
        borderRadius: 14
    },
    rect13: {
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 14,
        flex: 1
    },
    group31: {
        height: 443,
        justifyContent: "space-between",
        alignItems: "center"
    },
    group30: {
        height: 50,
        alignSelf: "stretch"
    },
    rect14: {
        height: 50,
        backgroundColor: "rgba(0,171,118,0.1)",
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14
    },
    group33: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 1
    },
    group12: {
        width: 78,
        height: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        margin: 0
    },
    rect15: {
        width: 15,
        height: 15,
        justifyContent: "center"
    },
    verified: {
        fontWeight: "bold",
        color: "rgba(0,171,118,1)",
        textAlign: "center",
        letterSpacing: 0
    },
    rect18: {
        width: "33.33%",
        paddingRight: "5%",
        margin: 0,
    },
    rect17: {
        width: 150,
        height: 150,
        backgroundColor: "#E6E6E6",
        borderRadius: 5
    },
    group29: {
        width: 350,
        height: 202,
        justifyContent: "flex-start",
    },
    group17: {
        width: 150,
        paddingBottom: 10,
        justifyContent: "space-between",
        marginLeft: 20
    },
    examDetails: {
        fontWeight: "bold",
        color: "#121212",
        textAlign: "left",
        lineHeight: 22
    },
    group18: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    group19: {
        height: 29,
        justifyContent: "space-between"
    },
    name2: {
        color: "#606A80"
    },
    address2: {
        color: "#606A80"
    },
    group20: {
        justifyContent: "space-between"
    },
    name3: {
        color: "#121212"
    },
    address3: {
        color: "#121212"
    },
    group11: {
        width: 337,
        height: 250,
        alignSelf: "center",
        justifyContent: "flex-end",
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,1)",
    },
    group10: {
        height: 218,
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch"
    },
    rect6: {
        width: 60,
        height: 60,
        alignSelf: "center"
    },
    invalidQrCode: {
        color: "#121212",
        fontSize: 17,
        textAlign: "center",
        lineHeight: 28,
        alignSelf: "center"
    },
    group9: {
        width: 302,
        height: 22,
        alignSelf: "center"
    },
    rect9: {
        height: 22,
        justifyContent: "center",
    },
    pleaseTryAgain: {
        color: "#121212",
        textAlign: "center",
    },
    group8: {
        height: 66,
        alignSelf: "stretch"
    },
    rect11: {
        height: 1,
        backgroundColor: "rgba(217,219,233,1)",
        alignSelf: "stretch"
    },
    rect12: {
        top: 0,
        left: 0,
        position: "absolute",
        right: 0,
        bottom: 0,
        justifyContent: "center"
    },
    close: {
        color: "#121212",
        height: 16,
        width: 80,
        textAlign: "center",
        alignSelf: "center"
    },
    group6: {
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: 335,
        alignSelf: "center"
    },
    group3: {
        width: 160,
        height: 70
    },
    rect2: {
        backgroundColor: "#fff",
        borderRadius: 10,
        height: 70
    },
    group2: {
        height: 44,
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 13
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 26,
        alignSelf: "center"
    },
    generateQrCode: {
        color: "#121212",
        alignSelf: "center",
        flex: 1
    },
    group4: {
        width: 160,
        height: 70
    },
    rect4: {
        backgroundColor: "#E6E6E6",
        borderRadius: 10,
        justifyContent: "center",
        flex: 1
    },
    group5: {
        height: 44,
        justifyContent: "space-between",
        alignItems: "center"
    },
    icon1: {
        color: "rgba(128,128,128,1)",
        fontSize: 26,
        alignSelf: "center"
    },
    generateQrCode1: {
        color: "#121212",
        alignSelf: "center"
    }
});

