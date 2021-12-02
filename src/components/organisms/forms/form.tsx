import React, {Component, useReducer, useRef, useState} from 'react';
import {Picker, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {InputField} from "@molecules/form-fields";
import DateTimeField from "@molecules/form-fields/datetime-field";
import RNPickerSelect from "react-native-picker-select";
import Button from "@atoms/button";
import Text from "@atoms/text";
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    checkboxBase: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'coral',
        backgroundColor: 'transparent',
    },

    checkboxChecked: {
        backgroundColor: 'coral',
    },

    appContainer: {
        flex: 1,
        alignItems: 'center',
    },

    appTitle: {
        marginVertical: '16',
        fontWeight: 'bold',
        fontSize: 24,
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    checkboxLabel: {
        marginLeft: '8',
        fontWeight: '500',
        fontSize: 18,
    },
});



const FormField = ({
                       color,
                       formElements,
                       onChange,
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
                return <DateTimeField key={id}  {...styleProps} {...otherProps} />;
            case "button":
                return <Button key={id}  {...styleProps} {...otherProps}>
                    <Text fontSize={16} color={'white'}>
                        {otherProps.label}
                    </Text>
                </Button>


            case "picker":

                return <RNPickerSelect
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
                    <View key={key}>
                        {renderElements(
                            key,
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

export default FormField;
