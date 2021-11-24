import React, { useState, FC } from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@atoms/text';
import TextInput from '@components/atoms/input';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
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
  },
  description: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
})

interface Props {
  label?: string,
  placeholder?: string,
  secureTextEntry?: boolean,
  required?: boolean,
  containerStyle?: any,
  labelStyle?: any,
  description?: string,
  error?: string,
  errorColor?: string,
  activeColor?: string,
  [x:string]: any,
}

const InputField: FC<Props> = ({
  label = '',
  placeholder = '',
  secureTextEntry = false,
  required = false,
  containerStyle,
  labelStyle,
  description,
  error,
  errorColor,
  activeColor,
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {
        isFocused && !!label && (
          <View style={styles.label}>
            <Text
              style={[
                labelStyle,
                isFocused && {
                  color: activeColor
                }
              ]}
              weight={'bold'}
              size={14}>
              {label}
            </Text>
            {
              required && (
                <Text
                  style={[
                    labelStyle,
                    isFocused && {
                      color: activeColor
                    },
                    !!error && {
                      color: errorColor
                    },
                  ]}>
                  {' *'}
                </Text>
              )
            }
          </View>
        )
      }
      <View style={[styles.inputContainer, isFocused && { borderColor: activeColor }, !!error && { borderColor: errorColor }]}>
        <TextInput
          placeholder={placeholder || label}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          {...otherProps}
        />
      </View>
      <View style={styles.description}>
        <Text
          style={[
            labelStyle,
            !!error && {
              color: errorColor
            },
          ]}>
          {error || description}
        </Text>
      </View>
    </View>
  )
}

export default InputField
