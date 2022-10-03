import {Animated, TouchableOpacity, View} from "react-native";
import {styles} from "@pages/activities/styles";
import CloseIcon from "@assets/svg/close";
import {isMobile} from "@pages/activities/isMobile";
import {infoColor} from "@styles/color";
import React from "react";
import CalendarPicker from 'react-native-calendar-picker';
function CalendarModal(props: { backgroundColor: Animated.AnimatedInterpolation, scale: Animated.AnimatedInterpolation, translateY: Animated.AnimatedInterpolation, onPress: () => void, dimensions: ScaledSize, formElements: ({ stateName: string; id: number; label: string; error: boolean; type: string; value: any } | { data: { label: string; value: string }[]; stateName: string; id: number; label: string; error: boolean; type: string; value: any })[], onDateChange: (date, type) => void }) {
    return <Animated.View
        pointerEvents="box-none"
        style={[
            styles.background,
            {
                backgroundColor: props.backgroundColor,
            },
        ]}>
        <Animated.View
            style={[
                styles.background,
                {
                    transform: [{scale: props.scale}, {translateY: props.translateY}],
                },
            ]}>
            <View style={styles.wrap}>
                <View style={styles.modalHeader}/>
                <View style={{
                    padding: 20,
                    flexDirection: "row",
                    justifyContent: "flex-end"
                }}>
                    <View>
                        <TouchableOpacity

                            onPress={props.onPress}>
                            <CloseIcon/>
                        </TouchableOpacity>
                    </View>
                </View>

                <CalendarPicker

                    width={props.dimensions.width * 0.7}
                    height={props.dimensions.height * 0.8}
                    headerWrapperStyle={!isMobile ? {width: "100%"} : {}}
                    startFromMonday={true}
                    allowRangeSelection={true}
                    todayBackgroundColor="#f2e6ff"
                    selectedStartDate={props.formElements?.[2]?.value}
                    selectedEndDate={props.formElements?.[3]?.value}
                    selectedDayColor={infoColor}
                    selectedDayTextColor="#FFFFFF"
                    onDateChange={props.onDateChange}
                />

            </View>
        </Animated.View>
    </Animated.View>;
}


export default CalendarModal
