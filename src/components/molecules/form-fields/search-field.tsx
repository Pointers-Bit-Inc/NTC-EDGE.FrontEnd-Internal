import React, { useState, useCallback, FC } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import lodash from 'lodash';
import { ExclamationIcon, NewSearchIcon } from '@atoms/icon';
import Text from '@atoms/text';
import TextInput from '@components/atoms/input';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = StyleSheet.create({
  container: {
    paddingVertical: RFValue(10),
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    paddingVertical: RFValue(15),
    marginBottom: Platform.OS === 'ios' ? -2 : -5,
  },
  description: {
    paddingTop: 2,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 15,
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
  iconStyle?: any;
  description?: string;
  error?: string;
  errorColor?: string;
  activeColor?: string;
  requiredColor?: string;
  onChangeText?: Function | undefined;
  onChangeTextDebounce?: Function | undefined;
  debounceTime?: number;
  [x: string]: any;
}

const InputField: FC<Props> = ({
  label = '',
  placeholder = '',
  secureTextEntry = false,
  required = false,
  hasValidation = false,
  containerStyle,
  inputStyle,
  labelStyle,
  outlineStyle,
  iconStyle,
  description,
  error,
  errorColor,
  activeColor,
  requiredColor,
  onChangeText = () => {},
  onChangeTextDebounce = () => {},
  debounceTime = 500,
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);
  const onChangeTextFn = (text:string) => {
    onChangeText(text);
    changeValueDebouncer(text);
  }
  const changeTextDebounced = (text:string) => onChangeTextDebounce(text);
  const changeValueDebouncer = useCallback(lodash.debounce(changeTextDebounced, debounceTime), []);

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
        <NewSearchIcon
          style={[styles.icon, iconStyle]}
          height={RFValue(20)}
          width={RFValue(20)}
          color={'#6E7191'}
        />
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder || label}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          numberOfLines={1}
          onChangeText={onChangeTextFn}
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

export default InputField;
