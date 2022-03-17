import React, {useState} from "react";
import QrCodeScan from "@pages/barcode/qr-code-scanner";
import {Dimensions , SafeAreaView , StatusBar , Text} from "react-native";

const Scan = (props: any) => {
    const screenW = Dimensions.get( 'window' ).width;
    const screenH = Dimensions.get( 'window' ).height;
    const defaultWidth = 375;
    const defaultHeight = 667;
    const _scaleWidth = screenW / defaultWidth;
    const _scaleHeight = screenH / defaultHeight;
    function px2dp( size: number ) {
        return px2dpW( size );
    }
    function px2dpW( size:number ) {
        return size * _scaleWidth;
    }


    const [scanner, setScanner] = useState(true)
    return <>
        {scanner && <SafeAreaView style={{backgroundColor: '#041B6E', flex: 1}}>

            <QrCodeScan onBack={()=> props.navigation.goBack()} onScanned={() => props.navigation.navigate("Activities")}/>
        </SafeAreaView>}

    </>
}
export  default Scan;