import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '@atoms/text';
import DateTimePicker from '@atoms/datetime-picker';
import PropTypes from "prop-types";
import {InputField} from "@molecules/form-fields";
import DateTimeField from "@molecules/form-fields/dropdown-field";
import RNPickerSelect from "react-native-picker-select";

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
        const { type, pickerData, ...otherProps } = element;
        switch (type) {
            case "text":
                return <InputField {...styleProps} {...otherProps} />;

            case "date":
                return <DateTimeField {...styleProps} {...otherProps} />;
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
        <View >
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
        </View>
    );
};


export default FormField;
