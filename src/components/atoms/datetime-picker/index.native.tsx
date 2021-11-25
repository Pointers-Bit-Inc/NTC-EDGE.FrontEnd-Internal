import React, { useState, useRef } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1
  }
});

const DateTimePicker = ({ value, placeholder }: any) => {
  const textInputRef = useRef(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datetime, setDateTime] = useState(value);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    textInputRef.current.blur();
  };

  const handleConfirm = (date: any) => {
    setDateTime(String(date));
    hideDatePicker();
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        ref={textInputRef}
        value={datetime}
        placeholder={placeholder}
        underlineColorAndroid={'transparent'}
        onPressIn={showDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DateTimePicker;
