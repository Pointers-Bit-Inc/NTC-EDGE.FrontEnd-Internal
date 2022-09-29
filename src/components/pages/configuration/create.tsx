import React from "react";
import {Animated, TouchableOpacity, View} from "react-native";
import Header from "@molecules/header";
import Text from "@atoms/text";
import {styles} from "@pages/activities/styles";
import ScheduleCreateEdit from "@pages/schedule/ScheduleCreateEdit";
import useSchedule from "../../../hooks/useSchedule";

const CreateConfigurationScreen = (props) => {
    const {
        dimensions,
        animation,
        background,
        display,
        success,
        onClose,
        formValue,
        onUpdateForm,
        handleStartPress,
        handleEndPress,
        onUpdateCreateSchedule,
        onDateChange,
    } = useSchedule(props);
    return <View style={[{flex: 1, backgroundColor: "#fff",}]}>
        <Header size={24} title={"Create Schedule"}>
            <TouchableOpacity onPress={onClose}>
                <Text>Close</Text>
            </TouchableOpacity>
        </Header>
        <ScheduleCreateEdit id={schedule.id} formElements={formValue} onChange={onUpdateForm} onPress={handleStartPress}
                            onPress1={handleEndPress} backgroundColor={background} scale={display}
                            translateY={success} onPress2={() => {
            Animated.spring(animation, {
                toValue: 0,
                useNativeDriver: false,
            }).start();
        }} dimensions={dimensions} onDateChange={onDateChange}/>
        <View style={{
            bottom: 0,
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <TouchableOpacity onPress={() => onUpdateCreateSchedule('post')} style={styles.scheduleButton}>

                <Text style={[styles.text, {color: "#fff"}]} size={14}>Create Schedule</Text>

            </TouchableOpacity>
        </View>
    </View>
}

export default CreateConfigurationScreen
