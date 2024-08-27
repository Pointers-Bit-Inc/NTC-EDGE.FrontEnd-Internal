import React, { FC } from 'react';
import { View } from 'react-native';
import Text from '@atoms/text';
import Dropdown from '@atoms/dropdown';
import styles from '@styles/input-style';
import { input } from '@styles/color';

interface Props {
  value?: string;
  label?: string;
  items?: any;
  placeholder?: any;
  onChangeValue?: any;
  secureTextEntry?: boolean;
  required?: boolean;
  hasValidation?: boolean;
  description?: string;
  error?: string;
  [x: string]: any;
}

const DropDownField: FC<Props> = ({
  value = {},
  label = '',
  items = [],
  placeholder = 'Choose an item...',
  onChangeValue = () => {},
  secureTextEntry = false,
  required = false,
  hasValidation = false,
  description,
  error,
  ...otherProps
}) => {
  const { text, background } = input;

  return (
    <View style={styles.mainContainer}>
      <View style={[
        styles.container,
        styles.dropdownOuterContainer,
        !!error && {
          backgroundColor: background?.error,
          borderColor: text?.errorColor,
        }
      ]}>
        <Dropdown
          style={styles.dropdownInnerContainer}
          containerStyle={[
            styles.dropdownListContainer,
            items?.length < 3 && {flex: 0.15},
          ]}
          placeholderStyle={[
            styles.placeholderText,
            !!error && { color: text?.errorColor }
          ]}
          activeColor={input.background.default}
          iconColor={error ? text.errorColor : text.defaultColor}
          iconStyle={styles.iconStyle}
          selectedTextStyle={styles.inputText}
          value={value}
          placeholder={placeholder}
          items={items}
          onChangeValue={onChangeValue}
        />
      </View>
      {
        hasValidation && (!!error || !!description) && (
          <View>
            <Text
              style={[
                styles?.validationText,
                !!error && { color: text?.errorColor }
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

export default DropDownField;
