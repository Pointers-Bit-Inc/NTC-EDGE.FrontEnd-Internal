import React, { FC } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import Text from '@atoms/text';
import DynamicField from '@organisms/forms/fields/dynamic';
import inputStyle from '@styles/input-style';
import styles from './styles';

interface Props {
  label?: string;
  value?: any;
  onChangeValue?: any;
  parentType?: string;
  // isDateOfBirth?: boolean;
  // required?: boolean;
  [x: string]: any;
};

const UnitField: FC<Props> = ({
  label = '',
  value,
  onChangeValue = () => {},
  parentType = '',
  // isDateOfBirth,
  // required,
  ...otherProps
}) => {
  const { width } = useWindowDimensions();
  let isParentList = parentType === 'list';
  let left = value?.[0];
  let right = value?.[1];

  return (
    <View>
      <Text style={inputStyle.headerLabelText}>
        {label}
      </Text>
      <View style={styles.view}>
        <View style={[
          styles.dropdownContainer,
          {...Platform.select( { web: {width: (width * 0.40) / 2}})},
          !!isParentList && styles?.dropdownContainer3
        ]}>
          <DynamicField
            parentId={otherProps?.parentId}
            index={otherProps?.index}
            {...left}
            onChangeValue={(value: string) => onChangeValue(left?.id, value, left?.validate, left?.errorResponse)}
            parentType={otherProps?.type}
          />
        </View>
        <View style={[styles.dropdownContainer, {...Platform.select( { web: {width: (width * 0.40) / 2}})}]}>
          <DynamicField
            parentId={otherProps?.parentId}
            index={otherProps?.index}
            {...right}
            onChangeValue={(value: string) => onChangeValue(right?.id, value, right?.validate, right?.errorResponse)}
            parentType={otherProps?.type}
          />
        </View>
      </View>
    </View>
  )
};

export default UnitField;