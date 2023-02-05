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


import CalendarPicker from 'react-native-calendar-picker';
import LeftSideWeb from "@atoms/left-side-web";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";
import {isMobile} from "@pages/activities/isMobile";
import {isTablet} from "react-native-device-info";
import {useEffect, useMemo, useRef, useState} from "react";
import {styles} from "@pages/activities/styles";
import modalStyle from "@styles/modal";
import {infoColor} from "@styles/color";
import {DeclineButton} from "@atoms/button/errorButton";
import {setCalendarVisible, setDateEnd, setDateStart, setServices} from "../../../reducers/dashboard/actions";
import {SuccessButton} from "@atoms/button/successButton";
import {Bold} from "@styles/font";
import CalendarView from "@pages/schedule/CalendarView";
import CalendarIcon from "@assets/svg/calendarIcon";
import {fontValue} from "@pages/activities/fontValue";
import {_colors, formatData} from "../../../utils/ntc";
import {LineChart, PieChart, ProgressChart} from "react-native-chart-kit";
import {useReportFees} from "../../../hooks/useReportFees";
import React from 'react';

export const  ServicesScreen = () => {
    const {
        dimensions,
        numColumns,
        renderItem,
        servicesMemo
    } = useReportFees();
    return <>

        <View style={{backgroundColor: "#F8F8F8", flex: 1}}>


            <ScrollView>

                <PieChart
                    hasLegend={false}
                    data={servicesMemo}
                    width={dimensions.width }
                    height={dimensions.height}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2,

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

