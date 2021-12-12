import React, {useEffect, useState,} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import Button from '@components/atoms/button';
import axios from "axios";

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
        <View style={styles.root}>
            <View style={styles.upperSection}>

                    <View style={{flex: 1}}>
                        <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
                                        type={type}
                                        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                                        style={[StyleSheet.absoluteFillObject, styles.container]}>

                            <BarcodeMask edgeColor="#62B1F6" showAnimatedLine/>

                        </BarCodeScanner>
                    </View>

            </View>


        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,

        height: 1,

        width: '80%',
    },
    root: {
        flex: 1,
    },
    upperSection: {
        flex: 1
    },
    lowerSection: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    camera: {
        height: '100%',
    },
});
