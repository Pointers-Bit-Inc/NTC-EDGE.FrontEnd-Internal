import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@atoms/text';
import Dropdown from '@atoms/dropdown';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10
  }
});

const DropDowneField = ({
  title = '',
  value = '',
  placeholder = '',
  style
}: any) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={{ marginBottom: 5 }} weight={'bold'} fontSize={16}>
        {title}
      </Text>
      <Dropdown />
    </View>
  );
};

export default DropDowneField;
