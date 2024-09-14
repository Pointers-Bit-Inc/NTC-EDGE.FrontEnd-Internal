import React,{forwardRef,ForwardRefRenderFunction,useImperativeHandle,useRef,useState,} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '@atoms/text';
import TextInput from '@components/atoms/input';
import {defaultColor, input, primaryColor, successColor, text} from '@styles/color';
import inputStyles from "@styles/input-style"
import CloseIcon from "@assets/svg/close";
import {fontValue} from "@pages/activities/fontValue";
import CheckIcon from '@assets/svg/check';

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10
    },
    label: {
        position: 'absolute',
        top: 2,
        left: 15,
        paddingHorizontal: 5,
        backgroundColor: 'white',
        zIndex: 99,
        flexDirection: 'row'
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        width: '100%'
    },
    description: {
        paddingTop: 2,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

interface Props {
    label?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    required?: boolean;
    hasValidation?: boolean;
    containerStyle?: any;
    mainContainerStyle?:any,
    inputStyle?: any;
    labelStyle?: any;
    outlineStyle?: any;
    description?: string;
    error?: string;
    errorColor?: string;
    activeColor?: string;
    requiredColor?: string;
    onBlur?: () => void;
    onFocus?: () => void;
    [x: string]: any;
}

export type TextInputRef =  {
    blur: any,
    focus: any,
}

const InputField: ForwardRefRenderFunction<TextInputRef, Props> = ({
      clearable=true,
      checkable=false,
      label = '',
      placeholder = '',
      secureTextEntry = false,
      required = false,
      hasValidation = false,
      containerStyle,
      inputStyle,
      labelStyle,
      outlineStyle,
      description,
      error,
      errorColor,
      activeColor,
      requiredColor,
      disabledColor,
      onBlur = () => {},
      onFocus = () => {},
    onClose = () => {},
    onCheck = () => {},
   mainContainerStyle,
      ...otherProps
  }, ref) => {

    const inputRef:any = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const editable = otherProps?.editable === false || otherProps?.editable === true ? otherProps?.editable : true;

    const onFocusFN = () => {
        setIsFocused(true)
        onFocus();
    };
    const onBlurFN = () => {
        setIsFocused(false)
        onBlur();
    };
    useImperativeHandle(ref, () => ({
        blur: () => inputRef?.current?.blur(),
        focus: () => inputRef?.current?.focus(),
    }));


    return (
        <View style={[inputStyles.mainContainer, mainContainerStyle, ]}>

            <View style={[

                inputStyles.container,

                inputStyles.rowContainer,

                !!error && {
                    backgroundColor: input.background?.error,
                    borderColor: input.text?.errorColor,
                },
                !error && isFocused && {
                    backgroundColor: '#fff', //input.background?.default,
                    borderColor: primaryColor,
                },
containerStyle
            ]}>
                <View style={{ flex: 0.95 }}>
                    {!!otherProps.value && !!label && (
                        <View style={inputStyles.labelContainer}>
                            <Text
                                style={[
                                    inputStyles.labelText,
                                    (/*isFocused ||*/ !!otherProps.value || !!error) && {
                                        color: !!error ? text.error : /*isFocused ? activeColor :*/ "#808196"
                                    },
                                    !editable && {color: disabledColor}
                                ]}
                            >
                                {label}
                                {required && (
                                    <Text style={[inputStyles.requiredText,
                                        !!requiredColor && {
                                            //color:  isFocused ? requiredColor : "#808196"
                                            color:  requiredColor
                                        },
                                        !editable && {color: disabledColor}]}>
                                        {'*'}
                                    </Text>
                                )}
                            </Text>
                        </View>
                    )}
                    <View
                        style={[

                            outlineStyle,
                            isFocused && { borderColor: activeColor },
                            !!error && { borderColor: errorColor },
                            !editable && {borderColor: disabledColor}  ,

                        ]}
                    >
                        <TextInput

                        ref={inputRef}
                        style={[inputStyles.inputText , !editable && {color: disabledColor}, inputStyle]}
                        placeholder={(placeholder || label) + (!!requiredColor ? "*" : "") }

                        placeholderTextColor={!editable ? disabledColor : (!!error ? input.text?.errorColor : defaultColor)}
                        secureTextEntry={secureTextEntry}
                        onFocus={onFocusFN}
                        onBlur={onBlurFN}
                        {...otherProps}
                    />
                    </View>
                </View>
                {
                    (checkable && (Platform.OS == 'web' ? true : isFocused) ) &&
                    <TouchableOpacity style={{display: undefined}} onPress={() => {
                        onCheck()
                    }}>
                        <CheckIcon height={fontValue(15)} width={fontValue(15)} color={successColor}/>
                    </TouchableOpacity>


                }
                {
                    ((clearable && isFocused && !!editable && !!otherProps.value) || (checkable && (Platform.OS == 'web' ? true :isFocused) ) )&&
                    <TouchableOpacity  onPress={() => {

                        if(otherProps?.onChangeText ){

                            otherProps?.onChangeText('')
                        }
                        if(otherProps?.onChange ){

                            otherProps?.onChange({e:{
                                    nativeEvent: {
                                        text: ''
                                    }
                                }})
                        }
                        onClose()
                    }}>
                        <CloseIcon height={fontValue(10)} width={fontValue(10)} color={error ? input.text.errorColor : input.text.mainColor}/>
                    </TouchableOpacity>


                }


            </View>

            {
                hasValidation && (!!error || !!description) && (
                    <View>
                        <Text
                            style={[
                                inputStyles?.validationText,
                                !!error && { color: input.text?.errorColor },
                            ]}
                        >
                            {description || error}
                        </Text>
                    </View>
                )
            }
        </View>









    );
};

export default forwardRef(InputField);
