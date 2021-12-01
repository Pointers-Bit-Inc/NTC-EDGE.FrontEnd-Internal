import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {InputField} from "@molecules/form-fields";
import DateTimeField from "@molecules/form-fields/dropdown-field";
import RNPickerSelect from "react-native-picker-select";
import Button from "@atoms/button";
import Text from "@atoms/text";

const styles = StyleSheet.create({});

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
                                   onChangeText={(text: string) => onChange(id, text)}/>;
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
                    {...styleProps} {...otherProps}
                    onValueChange={(value) => onChange(id, value)}
                    items={
                        pickerData.map((pick: any, index: number) => {
                            return {label: pick.label, value: pick.value}
                        })
                    }
                />;
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
