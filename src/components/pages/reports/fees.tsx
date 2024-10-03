import {
    View,
    ScrollView,FlatList

} from 'react-native';
import {_colors, formatData} from "../../../utils/ntc";

import {useReportFees} from "../../../hooks/useReportFees";
import React, {useMemo} from 'react';
//import { PieChart } from 'react-native-svg-charts'
export const  FeesScreen = () => {
    const {
        dimensions,
        numFeeColumns,
        renderFeeItem,
        fees,
        feesTotal,
        noService
    } = useReportFees();



    return <>

        <View style={{backgroundColor: "#F8F8F8", flex: 1}}>


            <ScrollView style={{padding: 15}}>
                {/*{
                    feesTotal > 0 ? <PieChart style={{ height: 200 }} data={fees} /> : <PieChart style={{ height: 200 }} data={noService} />
                }*/}
                <FlatList
                  initialNumToRender={100}
                    contentContainerStyle={{flex: 1, padding: 15 }}
                    key={numFeeColumns}
                    data={formatData(fees, numFeeColumns)}
                    // style={styles.container}
                    numColumns={numFeeColumns}
                    renderItem={renderFeeItem}
                />
            </ScrollView>
        </View>

    </>
}


