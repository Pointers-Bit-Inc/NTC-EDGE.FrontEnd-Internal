import React , {FC , useState} from 'react';
import {StyleSheet , TouchableOpacity , View} from 'react-native';
import {ExclamationIcon , EyeIcon} from '@atoms/icon';
import Text from '@atoms/text';
import TextInput from '@components/atoms/input';
import {button , defaultColor , input , primaryColor} from 'src/styles/color';
import inputStyles from "@styles/input-style";

const styles = StyleSheet.create({
    container : {
        paddingVertical : 10
    } ,
    label : {
        position : 'absolute' ,
        top : 2 ,
        left : 15 ,
        paddingHorizontal : 5 ,
        backgroundColor : 'white' ,
        zIndex : 99 ,
        flexDirection : 'row'
    } ,
    inputContainer : {
        borderWidth : 1 ,
        borderColor : 'black' ,
        borderRadius : 10 ,
        overflow : 'hidden' ,
        width : '100%' ,
        flexDirection : 'row' ,
        alignItems : 'center' ,
    } ,
    description : {
        paddingTop : 2 ,
    } ,
    info : {
        flexDirection : 'row' ,
        alignItems : 'center' ,
    }
});

interface Props {
    label?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    required?: boolean;
    hasValidation?: boolean;
    containerStyle?: any;
    inputStyle?: any;
    labelStyle?: any;
    outlineStyle?: any;
    description?: string;
    error?: string;
    errorColor?: string;
    activeColor?: string;
    requiredColor?: string;
    showPassword?: any;

    [x: string]: any;
}

const PasswordField: FC<Props> = ({
                                      label = '' ,
                                      placeholder = '' ,
                                      secureTextEntry = false ,
                                      required = false ,
                                      hasValidation = false ,
                                      containerStyle ,
                                      inputStyle ,
                                      labelStyle ,
                                      outlineStyle ,
                                      description ,
                                      error ,
                                      errorColor ,
                                      activeColor ,
                                      requiredColor ,
                                      showPassword = () => {
                                      } ,
                                      ...otherProps
                                  }) => {
    const [isFocused , setIsFocused] = useState(false);
    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);

    return (
        <View style={inputStyles.mainContainer}>
            <View style={[
                inputStyles.container,
                inputStyles.rowContainer,
                !!error && {
                    backgroundColor: input.background?.error,
                    borderColor: input.text?.errorColor,
                },
                !error && isFocused && {
                    backgroundColor: input.background?.default,
                    borderColor: primaryColor,
                }
            ]}>
                <View style={{ flex: 0.95 }}>
                    {!!otherProps.value && !!label && (
                        <View style={inputStyles.labelContainer}>
                            <Text
                                style={[
                                    inputStyles.labelText,
                                    (isFocused || !!otherProps.value || !!error) && {
                                        color: isFocused ? activeColor : "#808196"
                                    },
                                    !!error && {color: input.text?.errorColor}
                                ]}
                            >
                                {label}
                            </Text>
                            {required && (
                                <Text style={[inputStyles.requiredText, !!requiredColor && {
                                    color: isFocused ? requiredColor : "#808196"
                                }]}>
                                    {'*'}
                                </Text>
                            )}
                        </View>
                    )}
                    <TextInput
                        style={inputStyles.inputText}
                        placeholder={placeholder || label}
                        placeholderTextColor={!!error ? input.text?.errorColor : input.text?.defaultColor}
                        secureTextEntry={secureTextEntry}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        {...otherProps}
                    />
                </View>
                <TouchableOpacity onPress={showPassword}>
                    <EyeIcon size={20} color={secureTextEntry ? input.text.defaultColor : input.text.mainColor}/>
                </TouchableOpacity>
            </View>
            {
                hasValidation && (!!error || !!description) && (
                    <View>
                        <Text
                            style={[
                                inputStyles?.validationText,
                                !!error && { color: input.text?.errorColor }
                            ]}
                        >
                            {error || description}
                        </Text>
                    </View>
                )
            }
        </View>
    );
};

export default PasswordField;
