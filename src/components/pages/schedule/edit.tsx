import React, {useEffect, useMemo} from "react";
import Header from "@molecules/header";
import {Animated, TouchableOpacity, View} from "react-native";
import {disabledColor, successColor} from "@styles/color";
import Text from "@atoms/text";
import {styles} from "@pages/activities/styles";
import ScheduleCreateEdit from "@pages/schedule/ScheduleCreateEdit";
import useSchedule from "../../../hooks/useSchedule";
import {setSchedule} from "../../../reducers/schedule/actions";
import parseSchedule from "@pages/schedule/parseSchedule";
import {Bold} from "@styles/font";

const EditScheduleScreen = (props) => {
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
        updateValid,
        schedule,
        originalForm,
        setFormValue,setOriginalForm
    } = useSchedule(props);




    useEffect(()=>{
        let _originalForm = [...JSON.parse(JSON.stringify(originalForm))]
        parseSchedule(_originalForm, schedule);
        setOriginalForm(_originalForm)
        let __originalForm = [...JSON.parse(JSON.stringify(originalForm))]
        parseSchedule(__originalForm, schedule)
        setFormValue(__originalForm)

    }, [])
    return <View style={[{flex: 1, backgroundColor: "#fff",}]}>

        <Header size={24} title={"Schedule: "}>
            <TouchableOpacity onPress={onClose}>
                <Text style={{fontFamily: Bold}}>Close</Text>
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

            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
            <TouchableOpacity onPress={() => onUpdateCreateSchedule('patch')} disabled={!updateValid}
                              style={{
                                  backgroundColor: updateValid ? successColor : disabledColor,
                                  paddingVertical: 10,
                                  paddingHorizontal: 20,
                                  borderRadius: 10
                              }}>

                <Text style={[styles.text, {color: "#fff"}]} size={14}>Update Schedule</Text>

            </TouchableOpacity>
        </View>


    </View>
}


export default EditScheduleScreen
