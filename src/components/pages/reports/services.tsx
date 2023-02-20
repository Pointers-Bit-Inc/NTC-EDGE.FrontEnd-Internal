import {
    View,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import {_colors, formatData} from "../../../utils/ntc";
import {useReportFees} from "../../../hooks/useReportFees";
import React from 'react';
import { PieChart } from 'react-native-svg-charts'
export const  ServicesScreen = () => {
    const {
        dimensions,
        numColumns,
        renderItem,
        servicesMemo,
        servicesTotal,
        noService
    } = useReportFees();


    return <>

        <View style={{backgroundColor: "#F8F8F8", flex: 1}}>


            <ScrollView style={{padding: 15}}>
                {servicesTotal > 0 ? <PieChart style={{ height: 200 }} data={servicesMemo} /> : <PieChart style={{ height: 200 }} data={noService} />}
                    <FlatList
                        contentContainerStyle={{flex: 1, padding: 15 }}
                        key={numColumns}
                        data={formatData(servicesMemo, numColumns)}
                        // style={styles.container}
                        numColumns={numColumns}
                        renderItem={renderItem}
                    />
            </ScrollView>

        </View>

    </>
}



const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
        paddingTop: 30,
        backgroundColor: '#ecf0f1',
    }, shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    item: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: 120,
        width: 90
    },
    itemTransparent: {
        backgroundColor: 'transparent',
    },
    itemText: {
    },


});

