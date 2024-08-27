import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';

const DropDown = ({
  items = [],
  value = {},
  onChangeValue = () => {},
  placeholder = 'Choose an item..',
  ...otherProps
}) => {
  return (
    <Dropdown
      value={value}
      data={items}
      labelField='label'
      valueField='value'
      placeholder={placeholder}
      onChange={onChangeValue}
      {...otherProps}
    />
  );
};

export default DropDown;