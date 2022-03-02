import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
} from "react";
import {
  View,
  TextInput,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInputProps
} from "react-native";
import styles from "./styles";

interface Props {
  value: string,
  onChangeText?: (text:string) => any;
  onSubmitEditing?: () => any;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  textInputProps?: TextInputProps;
  [x: string]: any;
}

export type TextInputRef =  {
  blur: Function,
  focus: Function,
}

const Input: ForwardRefRenderFunction<TextInputRef, Props> = ({
  value,
  onChangeText,
  onSubmitEditing,
  inputStyle,
  inputContainerStyle,
  textInputProps,
  ...otherProps
}, ref) => {
  const inputRef:any = useRef(null);
  useImperativeHandle(ref, () => ({
    blur: () => inputRef.current.blur(),
    focus: () => inputRef.current.focus(),
  }));

  return (
    <View style={[styles.textInputContainer, inputContainerStyle]}>
      <TextInput
        ref={inputRef}
        {...textInputProps}
        style={[styles.textInput, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        underlineColorAndroid="transparent"
        {...otherProps}
      />
    </View>
  )
  };

export default forwardRef(Input);