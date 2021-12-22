import React, {useEffect, useState,} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import Button from '@atoms/button';
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';

const finderWidth: number = 280;
const finderHeight: number = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;
export default function QrCodeScan(props: any) {

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
        const {type, data, bounds: {origin} = {}} = scanningResult;
        if (!scanned && (origin ? 1: 0)) {

                if(origin ? 1: 0){
                    const {x, y}: any = origin;
                    if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
                        setScanned(true);
                        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
                    }
                }

        }else{
            axios.get(`https://private-anon-3f439e7212-ntcedgeustp.apiary-mock.com/services/scan-qr`, { headers: { Authorization: `Bearer ` } }).then((response) =>{

                alert(`Bar code with type ${response?.data?.name} has been scanned!`);
                props.onScanned()
            }).catch((e) =>{
                console.log(e)
            })


        }
    };
    if (hasPermission === null) {

        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.rect}>
                    <View style={styles.iconRow}>
                        <TouchableOpacity onPress={()=>{
                            props.onBack()
                        }}>
                            <Ionicons name="md-arrow-back" style={styles.icon}></Ionicons>
                        </TouchableOpacity>

                        <View style={styles.rect2}></View>
                        <Text style={styles.testTester}>Test Tester</Text>
                    </View>
                    <View style={styles.iconRowFiller}></View>
                   <TouchableOpacity onPress={handleBarCodeScanned}>
                        <Text style={styles.scanQr}>SCAN{"\n"}QR</Text>
                   </TouchableOpacity>

                </View>
            </View>
            <View style={{flex: 1}}>
                <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
                                type={type}
                                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                                style={[StyleSheet.absoluteFillObject, styles.container]}>

                    <BarcodeMask edgeColor="#62B1F6" showAnimatedLine/>

                </BarCodeScanner>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group1: {
        height: 124,
        width: "100%",
        alignSelf: "center"
    },
    rect: {
        height: 124,
        backgroundColor: "#E6E6E6",
        flexDirection: "row"
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 40,
        height: 44,
        width: 27,
        marginTop: 3
    },
    rect2: {
        borderRadius: 25,
        height: 50,
        backgroundColor: "rgba(181,181,181,1)",
        width: 50,
        marginLeft: 7
    },
    testTester: {
        color: "#121212",
        fontSize: 20,
        marginLeft: 9,
        marginTop: 13
    },
    iconRow: {
        height: 50,
        flexDirection: "row",
        marginLeft: 23,
        marginTop: 53
    },
    iconRowFiller: {
        flex: 1,
        flexDirection: "row"
    },
    scanQr: {
        fontWeight: 'bold',
        color: "#121212",
        marginRight: 28,
        marginTop: 62
    }
});


