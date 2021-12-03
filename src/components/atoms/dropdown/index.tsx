import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Entypo } from '@expo/vector-icons';
import { defaultColor, text } from 'src/styles/color';

const styles = StyleSheet.create({
  viewContainer: {
    padding: 10,
  },
  inputIOS: {
    color: text.default,
    fontSize: 14,
    paddingRight: 25,
  },
  inputAndroid: {
    backgroundColor: 'transparent',
    color: text.default,
    fontSize: 14,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 25,
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 0 : 10,
  },
  inputWeb: {
    ...Platform.select({
      native: {
        borderColor: 'transparent',
        backgroundColor: 'transparent'
      },
      default: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        '-webkit-appearance': 'none'
      }
    })
  }
});

const Dropdown = ({
  value = '',
  onChangeValue = () => {},
  items = [],
  placeholder = {},
}) => {

  return (
    <RNPickerSelect
      style={{
        ...styles,
        placeholder: {
          color: defaultColor,
          fontSize: 14,
        },
      }}
      placeholder={placeholder}
      value={value}
      onValueChange={onChangeValue}
      items={items}
      useNativeAndroidPickerStyle={false}
      Icon={() => (
        <Entypo
          name="chevron-thin-down"
          size={18}
          color={text.default}
        />
      )}
    />
  );
};

export default Dropdown;
