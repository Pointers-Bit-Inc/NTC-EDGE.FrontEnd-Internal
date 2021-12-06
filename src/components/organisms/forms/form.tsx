import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {DropdownField, InputField} from "@molecules/form-fields";
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from "@atoms/button";
import Text from "@atoms/text";
import {Ionicons} from "@expo/vector-icons";
import {outline, text} from "../../../styles/color";

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
                                   onEndEditing={(e: any) => {
                                       onChange(id, e.nativeEvent.text, 'input')
                                   }
                                   }
                                   onChangeText={(text: string) => onChange(id, text, 'input')}
                                   onSubmitEditing={(event: any) => onChange(id, event.nativeEvent.text, 'input')}/>;


            case "date":

                return (
                    <View>
                        <Text style={{color: text.default}} >{otherProps.label}</Text>
                        <DateTimePicker style={{width: '100%'}}
                                        onChange={(event: any, selectedDate: any) => {
                                            onChange(id, selectedDate)
                                        }}
                                        key={id} {...styleProps} {...otherProps}  />
                    </View>
                );
            case "radiobutton":
                return (<View style={radioButton.typeContainer}>
                    <Text color={text.default} size={14}>Gender</Text>
                    {
                        pickerData.map((item: any) => (
                            <TouchableOpacity
                                key={item.value}
                                onPress={() => onChange(id, item.value)}
                            >
                                <View style={radioButton.buttonContainer}>
                                    <View
                                        style={[radioButton.circle, item.value === otherProps.value && radioButton.circleActive]}/>
                                    <Text color={text.default} size={14}>{item.label}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </View>)
            case "button":
                return <Button onPress={onSubmit} key={id}   {...styleProps} {...otherProps}>
                    <Text fontSize={16} color={'white'}>
                        {otherProps.label}
                    </Text>
                </Button>

            case "picker":

                return <DropdownField
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 10,
                            right: 12,
                        },
                    }}
                    Icon={() => {
                        return <Ionicons name="chevron-down-outline" size={24} color="gray"/>;
                    }}
                    key={id}
                    label={otherProps.label}
                    placeholder={{
                        label: otherProps.label,
                        value: null,
                        color: 'black',
                    }}
                    itemKey={'value'}
                    {...styleProps} {...otherProps}
                    onChangeValue={(value: string) => onChange(id, value)}
                    items={
                        pickerData.map((pick: any, key: number) => {
                            return {label: pick.label, value: pick.value, key: key}
                        })
                    }/>

        }
    }
    return (
        <>
            {formElements.map((element: any, key: number) => {
                return element.type != 'submit' && (
                    <View key={element.id}>
                        {renderElements(
                            element.id,
                            element,
                            inputColor,
                            otherProps
                        )}
                    </View>
                );
            })}
        </>
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
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 5,
    },
    circle: {
        height: 15,
        width: 15,
        borderColor: outline.default,
        borderWidth: 1.2,
        borderRadius: 15,
        marginRight: 5,
    },
    circleActive: {
        borderColor: outline.primary,
        borderWidth: 5,
    }
});


export default FormField;