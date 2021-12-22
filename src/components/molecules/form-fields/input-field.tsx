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
  [x: string]: any;
}

export type TextInputRef =  {
  blur: () => void,
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
  ...otherProps
}, ref) => {
  const inputRef:any = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);
  useImperativeHandle(ref, () => ({
    blur: inputRef.current.blur,
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
              }
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
                }
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
          !!error && { borderColor: errorColor }
        ]}
      >
        <TextInput
          ref={inputRef}
          style={inputStyle}
          placeholder={placeholder || label}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
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
