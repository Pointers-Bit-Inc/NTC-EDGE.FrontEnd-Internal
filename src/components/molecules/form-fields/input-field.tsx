import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { ExclamationIcon } from '@atoms/icon';
import Text from '@atoms/text';
import TextInput from '@components/atoms/input';
import { defaultColor } from '@styles/color';

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
  [x: string]: any;
}

export type TextInputRef =  {
  blur: any,
  focus: any,
}

const InputField: ForwardRefRenderFunction<TextInputRef, Props> = ({
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
    <View style={[styles.container, containerStyle]}>
      {(isFocused || !!otherProps.value || !!error) && !!label && (
        <View style={styles.label}>
          <Text
            style={[
              labelStyle,
              (isFocused || !!otherProps.value || !!error) && {
                color: activeColor
              },
              !editable && {color: disabledColor}
            ]}
            weight={'600'}
            size={12}
          >
            {label}
          </Text>
          {required && (
            <Text
              style={[
                labelStyle,
                !!requiredColor && {
                  color: requiredColor
                },
                !editable && {color: disabledColor}
              ]}
            >
              {'*'}
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.inputContainer,
          outlineStyle,
          isFocused && { borderColor: activeColor },
          !!error && { borderColor: errorColor },
          !editable && {borderColor: disabledColor}
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[inputStyle, !editable && {color: disabledColor}]}
          placeholder={placeholder || label}
          placeholderTextColor={!editable ? disabledColor : defaultColor}
          secureTextEntry={secureTextEntry}
          onFocus={onFocusFN}
          onBlur={onBlurFN}
          {...otherProps}
        />
      </View>
      {
        hasValidation && (
          <View style={styles.description}>
            <View style={styles.info}>
              {
                !!error && (
                  <ExclamationIcon
                    size={12}
                    color={errorColor}
                  />
                )
              }
              <Text
                style={[
                  labelStyle,
                  !!error && {
                    marginLeft: 10,
                    color: errorColor
                  }
                ]}
                size={12}
              >
                {error || description}
              </Text>
            </View>
          </View>
        )
      }
    </View>
  );
};

export default forwardRef(InputField);