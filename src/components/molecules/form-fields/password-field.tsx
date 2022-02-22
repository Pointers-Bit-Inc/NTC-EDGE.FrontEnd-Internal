import React, {
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
    ForwardRefRenderFunction,
} from 'react';
import {View , StyleSheet , TouchableOpacity} from 'react-native';
import Text from '@atoms/text';
import TextInput from '@components/atoms/input';
import {defaultColor , primaryColor, text} from '@styles/color';
import inputStyles from "@styles/input-style"
import {input} from "@styles/color"
import { EyeIcon } from '@atoms/icon';
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
        overflow: 'hidden',
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
    showPassword?: any;
    [x: string]: any;
}

export type TextInputRef =  {
    blur: any,
    focus: any,
}

const PasswordField: ForwardRefRenderFunction<TextInputRef, Props> = ({
      clearable=true,
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
      showPassword = () => {},
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
        blur: () => inputRef.current.blur(),
        focus: () => inputRef.current.focus(),
    }));
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
                    backgroundColor: '#fff', //input.background?.default,
                    borderColor: primaryColor,
                },
                containerStyle,
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
                                            color:  isFocused ? requiredColor : "#808196"
                                        }]}>
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
                            !editable && {borderColor: disabledColor}
                        ]}
                    >
                        <TextInput
                        ref={inputRef}
                        style={[inputStyle, isFocused ? inputStyles.inputText : { ...inputStyles.inputText, color: defaultColor}, !editable && {color: disabledColor}]}
                        placeholder={placeholder || label}
                        placeholderTextColor={!editable ? disabledColor : (!!error ? input.text?.errorColor : defaultColor)}
                        secureTextEntry={secureTextEntry}
                        onFocus={onFocusFN}
                        onBlur={onBlurFN}
                        {...otherProps}
                    />
                    </View>
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
                                !!error && { color: input.text?.errorColor },
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

export default forwardRef(PasswordField);