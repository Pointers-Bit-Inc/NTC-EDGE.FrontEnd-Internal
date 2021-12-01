import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {InputField} from "@molecules/form-fields";
import DateTimeField from "@molecules/form-fields/dropdown-field";
import RNPickerSelect from "react-native-picker-select";
import Button from "@atoms/button";
import Text from "@atoms/text";

const styles = StyleSheet.create({

});

const FormField = ({
                  color,
                  formElements,
                  ...otherProps
              }: any) => {
    const inputColor = color ? color : "#486c86";
    const renderElements = (element: any, color: any, styleProps: any) =>  {
        element.color = color;
        const { label, type, pickerData, ...otherProps } = element;
        switch (type) {
            case "text":
                return <Text {...styleProps} {...otherProps} >{label}</Text>;
            case "input":
                return <InputField {...styleProps} {...otherProps} />;
            case "date":
                return <DateTimeField {...styleProps} {...otherProps} />;
            case "button":
                return <Button {...styleProps} {...otherProps}>
                    <Text fontSize={16} color={'white'}>
                        {label}
                    </Text>
                </Button>
            case "picker":
                return <RNPickerSelect
                        {...styleProps} {...otherProps}
                        onValueChange={(value) => console.log(value)}
                        items ={
                            pickerData.map((pick:any, index: number) => {
                                return  { label: pick.label , value: pick.value }
                            })
                        }
                    />;
        }
    }
    return (
        <ScrollView >
            {formElements.map((element: any, key:number) => {
                return (
                    <View key={key}>
                        {renderElements(
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
