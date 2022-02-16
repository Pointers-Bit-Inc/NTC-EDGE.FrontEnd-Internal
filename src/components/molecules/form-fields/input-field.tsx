import React, { FC, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@atoms/text';
import TextInput from '@atoms/input';
import { CloseIcon } from '@atoms/icon';
import styles from '@styles/input-style';
import { input } from '@styles/color';

interface Props {
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  required?: boolean;
  hasValidation?: boolean;
  description?: string;
  error?: string;
  [x: string]: any;
}

const InputField: FC<Props> = ({
  label = '',
  placeholder = '',
  secureTextEntry = false,
  required = false,
  hasValidation = false,
  description,
  error,
  ...otherProps
}) => {
  const { text, background } = input;

  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  return (
    <View style={styles.mainContainer}>
      <View style={[
        styles.container,
        styles.rowContainer,
        !!error && {
          backgroundColor: background?.error,
          borderColor: text?.errorColor,
        }
      ]}>
        <View style={{ flex: 0.95 }}>
          {!!otherProps.value && !!label && (
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.labelText,
                  !!error && {color: text?.errorColor}
                ]}
              >
                {label}
              </Text>
              {required && (
                <Text style={styles.requiredText}>
                  {'*'}
                </Text>
              )}
            </View>
          )}
          <TextInput
            style={styles.inputText}
            placeholder={placeholder || label}
            placeholderTextColor={!!error ? text?.errorColor : text?.defaultColor}
            secureTextEntry={secureTextEntry}
            onFocus={onFocus}
            onBlur={onBlur}
            {...otherProps}
          />
        </View>
        {
          !!otherProps.value && focused &&
          <TouchableOpacity onPress={() => otherProps?.onChangeText ? otherProps?.onChangeText('') : {}}>
            <CloseIcon size={15} color={error ? text.errorColor : text.mainColor}/>
          </TouchableOpacity>
        }
      </View>
      {
        hasValidation && (!!error || !!description) && (
          <View>
            <Text
              style={[
                styles?.validationText,
                !!error && { color: text?.errorColor },
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

export default InputField;
