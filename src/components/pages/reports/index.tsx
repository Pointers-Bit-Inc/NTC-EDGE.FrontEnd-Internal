import * as React from 'react';
import {
    Animated as RNAnimated,
    Platform,
    StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
import {FeesScreen} from "@pages/reports/fees";
import {ServicesScreen} from "@pages/reports/services";
import {styles} from "@pages/activities/styles";
import Header from "@molecules/header";
import CalendarIcon from "@assets/svg/calendarIcon";
import {isTablet} from "react-native-device-info";
import {fontValue} from "@pages/activities/fontValue";
import SearchIcon from "@assets/svg/search";
import {Bold} from "@styles/font";
import CalendarView from "@pages/schedule/CalendarView";
import {setCalendarVisible, setDateEnd, setDateStart, setGetReport} from "../../../reducers/dashboard/actions";
import modalStyle from "@styles/modal";
import {isMobile} from "@pages/activities/isMobile";
import {infoColor} from "@styles/color";
import {DeclineButton} from "@atoms/button/errorButton";
import {SuccessButton} from "@atoms/button/successButton";
import {useReportFees} from "../../../hooks/useReportFees";
import CalendarPicker from 'react-native-calendar-picker';
import {setVisible} from "../../../reducers/activity/actions";
import Filter from "@atoms/icon/filter";
const  Dashboard = (props) => {


    const {
        dimensions,
        dispatch,
        calendarVisible,
        visible,
        prevDateEnd,
        prevDateStart,
        dateEnd,
        dateStart,
        animation,
        background,
        display,
        success,
        onDateChange,
        calendarPress,
        calendarChangeData,
        getReport,
        calendarConfirm,
    } = useReportFees();






    return (
<>
    <View style={[styles.header, {backgroundColor: "#fff"}]}>
        <Header title={"Reports"}>
            <View style={{flexDirection: "row", paddingHorizontal: 15}}>
                <TouchableOpacity onPress={() => calendarPress(false)}>
                    <CalendarIcon color={(Platform.OS == "web" || Platform.isPad || isTablet())? "#4E4B66"  :"white"} pressed={visible} width={fontValue(Platform.OS == "web" || Platform.isPad ? 26 : 23)}
                                  height={fontValue(Platform.OS == "web" || isTablet() || Platform.isPad ? 20 : 23)}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => calendarPress(true)}>
                    <Filter  width={fontValue(isTablet() || Platform.OS == "web" || Platform.isPad ? 30 : 21)}
                            height={fontValue(Platform.OS == "web" || isTablet() || Platform.isPad ? 30 : 21)}/>
                </TouchableOpacity>
            </View>
        </Header>
        <View style={{marginHorizontal:26,}}>

            <View style={{
                paddingTop:14,
                paddingBottom:12,
                alignItems:"center",
                justifyContent:"space-between",
                flexDirection:"row",
                flex:1
            }}>
                <View style={{flex:1}}>


                    {calendarVisible ? <View style={styles.calendarView}>
                        <View style={{padding: 10}}>
                            <Text style={{fontSize: 16, fontFamily: Bold}}>Date Filter: </Text>
                        </View>
                        <CalendarView onPress={()=> dispatch(setCalendarVisible(true))}
                                      isCloseable={true}
                                      onCloseable={() => {
                                          dispatch(setDateEnd(null));
                                          dispatch(setDateStart(null));
                                          dispatch(setCalendarVisible(!calendarVisible))

                                      }}
                                      startDate={dateStart}
                                      endDate={dateEnd}
                        />
                    </View> : <></>}



                </View>

            </View>


        </View>
    </View>
    <Tab.Navigator>
        <Tab.Screen name="Fees" component={FeesScreen} />
        <Tab.Screen name="Services" component={ServicesScreen} />
    </Tab.Navigator>

    {calendarVisible ? <RNAnimated.View
        pointerEvents="box-none"
        style={[
            {
                backgroundColor: background,
            },
            modalStyle.background,

        ]}>
        <RNAnimated.View
            style={[
                modalStyle.background,
                {
                    transform: [{scale: display}, {translateY: success}],
                },
            ]}>
            <View style={modalStyle.wrap}>
                <View style={modalStyle.modalHeader} />
                <CalendarPicker
                    maxDate={new Date()}
                    allowBackwardRangeSelect={true}
                    width={isMobile? dimensions.width * 0.8 : dimensions.width * 0.3}
                    height={dimensions.height * 0.8}
                    headerWrapperStyle={!isMobile ? {width: "100%"} : {}}
                    startFromMonday={true}
                    allowRangeSelection={true}

                    selectedStartDate={dateStart}
                    selectedEndDate={dateEnd}
                    selectedDayColor={infoColor}
                    selectedDayTextColor="#FFFFFF"
                    onDateChange={onDateChange}
                />
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10}}>
                    <View style={{flex: 0.9, paddingHorizontal: 10}}>
                        <DeclineButton onPress={() => {

                            if(!(dateStart && dateEnd)){
                                dispatch(setCalendarVisible(!calendarVisible))
                            }
                            dispatch(setDateEnd(prevDateEnd));
                            dispatch(setDateStart(prevDateStart));

                            if(!(prevDateEnd && prevDateStart)){
                                dispatch(setCalendarVisible(false))
                            }

                            RNAnimated.spring(animation, {
                                toValue: 0,
                                useNativeDriver: false,
                            }).start();
                        }} name={"Cancel"}/>
                    </View>
                    <View style={{flex: 0.9,  paddingHorizontal: 10}}>
                        <SuccessButton disabled={!(dateStart && dateEnd)} onPress={()=>{
                            if(getReport){
                                calendarChangeData()
                            }else{
                                calendarConfirm()
                            }
                           dispatch(setGetReport(false))

                            RNAnimated.spring(animation, {
                                toValue: 0,
                                useNativeDriver: false,
                            }).start();

                        }} name={"Confirm"}/>
                    </View>

                </View>

            </View>
        </RNAnimated.View>
    </RNAnimated.View> : <></>}
</>






    )
}
export default Dashboard
