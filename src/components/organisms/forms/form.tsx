import React, {Component, useReducer, useRef, useState} from 'react';
import {
    InputAccessoryView,
    Picker,
    Pressable,
    ScrollView,
    StyleSheet, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {InputField} from "@molecules/form-fields";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import Button from "@atoms/button";
import Text from "@atoms/text";
import {Ionicons} from "@expo/vector-icons";
const FormField = ({
                       color,
                       formElements,
                       onChange,
                        onSubmit,
                       ...otherProps
                   }: any) => {
    const inputColor = color ? color : "#486c86";

    const renderElements = (id: number, element: any, color: any, styleProps: any) => {
        element.color = color;
        const {type, pickerData, ...otherProps} = element;
        switch (type) {
            case "text":
                return <Text key={id} {...styleProps} {...otherProps} >{otherProps.label}</Text>;
            case "input":

                return <InputField key={id}  {...styleProps} {...otherProps}
                                   onChangeText={(text: string) => onChange(id, text)}
                                   onSubmitEditing={(event: any) => onChange(id, event.nativeEvent.text)}/>;
            case "date":
                return <DateTimePicker onChange={ (event:any, selectedDate:any) => {
                  alert(event)
                }} key={id}  {...styleProps} {...otherProps} />;
            case "radiobutton":
                return <><Text>Gender</Text>
            {pickerData.map((data:any, key: number) => {
                        return (<>
                            <View key={data.value}>
                                {otherProps.checked == data.value ?
                                    <TouchableOpacity onPress={ ()=> onChange(id, data.value, 'checked')} style={radioButton.btn}>
                                        <Ionicons name={'radio-button-on'}/>
                                        <Text>{data.label}</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={ ()=> onChange(id, data.value, 'checked')} style={radioButton.btn}>
                                        <Ionicons name={'radio-button-off'}/>
                                        <Text>{data.label}</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            </>
                        )
                    })}
                    </>
            case "button":
                return <Button onPress={onSubmit} key={id}   {...styleProps} {...otherProps}>
                    <Text fontSize={16} color={'white'}>
                        {otherProps.label}
                    </Text>
                </Button>


            case "picker":

                return <RNPickerSelect
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 10,
                            right: 12,
                        },
                    }}
                    Icon={() => {
                        return <Ionicons name="chevron-down-outline" size={24} color="gray" />;
                    }}
                    key={id}
                    itemKey={'value'}
                    {...styleProps} {...otherProps}
                    value={otherProps.value}
                    onValueChange={(value) => {
                            onChange(id, value)
                    }}
                    items={
                        pickerData.map((pick: any, key: number) => {
                            return {label: pick.label, value: pick.value, key: key}
                    })
                    }/>

        }
    }
    return (
        <ScrollView>
            {formElements.map((element: any, key: number) => {
                return (
                    <View >
                        {renderElements(
                            element.id,
                            element,
                            inputColor,
                            otherProps
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
};
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

const radioButton = StyleSheet.create({
    img:{
        height:20,
        width: 20
    },
    btn:{
        flexDirection: 'row'
    }
});
export default FormField;
