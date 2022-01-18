import React, {useEffect, useState,} from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import axios from "axios";
import QrScanCodeIcon from "@assets/svg/qrCodeScanIcon";
import UploadIcon from "@assets/svg/uploadQrCode";
import {Response} from "./response"
import * as ImagePicker from "expo-image-picker";
import {styles} from "./styles"
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
    const handleResponse = (data:string) => {
        axios.get(data, { headers: { Authorization: "Bearer ".concat(user.sessionToken) } }).then((response) =>{

            setIsLoading(false)
            setIsError(false)
            setIsVerified(true)
        }).catch((e) =>{
            setIsLoading(false)
            setIsError(true)
            setIsVerified(false)
        })
    }
    const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {

        try {
            setIsLoading(true)
            const {type, data, bounds: {origin} = {}} = scanningResult;

            if (!scanned && (origin ? 1: 0)) {

                if(origin ? 1: 0){
                    const {x, y}: any = origin;
                    if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
                        handleResponse(data)
                    }
                }

            }else{
                handleResponse(data)
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
                <Response verified={isVerified}
                          onPress={() => setIsVerified(false)}
                          error={isError}
                          onPress1={() => setIsError(false)}/>
                <View style={styles.group6}>
                   
                    <View style={styles.group3}>
                        <View style={styles.rect2}>
                            <TouchableOpacity onPress={decode} style={styles.group2}>
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


