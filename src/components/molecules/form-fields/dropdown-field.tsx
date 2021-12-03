import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExclamationIcon } from '@atoms/icon';
import Text from '@atoms/text';
import Dropdown from '@atoms/dropdown';

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

const DateTimeField = ({
  value = '',
  label = '',
  labelStyle,
  placeholder = {},
  items = [],
  onChangeValue = () => {},
  outlineStyle,
  required = false,
  requiredColor = '',
  activeColor = '',
  errorColor = '',
  hasValidation = false,
  error = '',
  description = '',
  style,
  ...otherProps
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  return (
    <View style={[styles.container, style]}>
      {
        (isFocused || !!value || !!error) && !!label && (
          <View style={styles.label}>
            <Text
              style={[
                labelStyle,
                !!activeColor && {
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
        )
      }
      <View style={[styles.inputContainer, outlineStyle, !!error && { borderColor: errorColor }]}>
        <Dropdown
          value={value}
          placeholder={placeholder}
          items={items}
          onChangeValue={onChangeValue}
          onOpen={onFocus}
          onDonePress={onBlur}
          onClose={onBlur}
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

export default DateTimeField;
