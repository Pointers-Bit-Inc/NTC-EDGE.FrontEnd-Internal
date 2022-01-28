import React, {useEffect, useState,} from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import axios from "axios";
import { defaultColor, errorColor, successColor, text, warningColor} from '@styles/color';
import AwesomeAlert from 'react-native-awesome-alerts';
import QrScanCodeIcon from "@assets/svg/qrCodeScanIcon";
import UploadIcon from "@assets/svg/uploadQrCode";
import {Response} from "./response"
import * as ImagePicker from "expo-image-picker";
import {styles} from "./styles"
import {RootStateOrAny, useSelector} from "react-redux";
import {BASE_URL} from "../../../services/config";
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
    const [verifiedInfo, setVerifiedInfo] = useState()
    const [alert, setAlert] = useState({
        title: '',
        message: '',
        color: defaultColor,
    });
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
           if(!(status === 'granted')){
               props.onScanned()
           }
        })();
    }, []);
    const handleResponse = (data:string) => {
        const query = `${BASE_URL}/qr/${data}`
        axios.get(query , { headers: { Authorization: "Bearer ".concat(user.sessionToken) } }).then((response) =>{

            setVerifiedInfo(response.data)
            setIsLoading(false)
            setIsError(false)
            setIsVerified(true)

        }).catch((e) =>{
            setIsLoading(false)
            setIsError(true)
            setIsVerified(false)
        })
    }
    const handleBarCodeScanned = (scanningResult: any) => {

        try {
            setIsLoading(true)
            const {type, data, bounds: {origin} = {}} = scanningResult;
            if (!scanned && (origin ? 1: 0)) {
                if(origin ? 1: 0){
                    const {x, y}: any = origin;
                    if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
                        handleResponse(data)
                        return;
                    }
                }
            }
            handleResponse(data);
        }catch (error) {
            setIsLoading(false)
        }

    };
    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            setAlert({
                title: 'Permission Denied',
                message: 'Permission to access photo library is required.',
                color: warningColor
            });
            setShowAlert(true);
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
                const results = await BarCodeScanner.scanFromURLAsync(r?.uri)
                const query = `${BASE_URL}/qr/${results[0]?.data}`
                axios.get(query, { headers: { Authorization: "Bearer ".concat(user.sessionToken) } }).then((response) =>{
                    setIsLoading(false)
                    setIsVerified(true)
                    setVerifiedInfo(response.data)
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
   
    return (
        <View style={styles.container}>
            {
                hasPermission && (
                    <RNCamera
                        onBarCodeRead={handleBarCodeScanned}
                        type={RNCamera.Constants.Type.back}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        style={[StyleSheet.absoluteFillObject, styles.container]}
                    >
                        <BarcodeMask edgeColor="#62B1F6" showAnimatedLine/>
                    </RNCamera>
                )
            }
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
                          verifiedInfo={verifiedInfo}
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
            <AwesomeAlert
                actionContainerStyle={{ flexDirection: 'row-reverse' }}
                show={showAlert}
                showProgress={false}
                title={alert?.title}
                titleStyle={{ color: text.default }}
                message={alert?.message}
                messageStyle={{ textAlign: 'center', color: text.default }}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText='Close'
                confirmButtonColor={alert?.color}
                onConfirmPressed={() => setShowAlert(false)}
            />
        </View>

    );
}


