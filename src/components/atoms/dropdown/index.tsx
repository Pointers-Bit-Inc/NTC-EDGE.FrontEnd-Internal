import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const styles = StyleSheet.create({
  viewContainer: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1
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

const Dropdown = ({ value = '' }) => {
  const [selectedValue, setSelectedValue] = useState(value);

  return (
    <RNPickerSelect
      style={{ ...styles }}
      value={selectedValue}
      onValueChange={setSelectedValue}
      items={[
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]}
    />
  );
};

export default Dropdown;
