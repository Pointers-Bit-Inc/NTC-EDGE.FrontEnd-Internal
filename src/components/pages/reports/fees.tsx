import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Platform,
    useWindowDimensions,
    Animated as RNAnimated, Dimensions, TouchableOpacity, FlatList
} from 'react-native';
import {_colors, formatData} from "../../../utils/ntc";
import {LineChart, PieChart, ProgressChart} from "react-native-chart-kit";

import {useReportFees} from "../../../hooks/useReportFees";
import React from 'react';

export const  FeesScreen = () => {
    const {
        dimensions,
        numFeeColumns,
        renderFeeItem,
        fees,
    } = useReportFees();
    return <>

        <View style={{backgroundColor: "#F8F8F8", flex: 1}}>


            <ScrollView>
                <PieChart

                    hasLegend={true}
                    data={fees}
                    width={dimensions.width }
                    height={dimensions.height}
                    chartConfig={{

                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 0,

                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,

                        },
                    }}

                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute //for the absolute number remove if you want percentage
                />
                <FlatList
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


