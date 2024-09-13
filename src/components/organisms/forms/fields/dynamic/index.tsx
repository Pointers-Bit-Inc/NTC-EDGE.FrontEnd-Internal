import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import Text from '@atoms/text';
import { DropdownField, InputField, OptionField, TimeField } from '@molecules/form-fields';
import { DateField, UnitField } from '@molecules/form-fields';
import styles from './styles';

interface Props {
  type?: string;
  id?: string;
  parentId?: string;
  index?: number;
  onChangeValue?: any;
  title?: string;
  description?: string;
  [x: string]: any;
};

const DynamicField: FC<Props> = ({
  ...otherProps
}) => {
  let {
    type = '',
    id = '',
    parentId = '',
    subParentId = '',
    subIndex = -1,
    index = -1,
    onChangeValue = () => {},
    validate,
    title = '',
    description = '',
    hasDependent,
    option = false,
    setParentId = '',
    setIndex = -1,
    required,
    keyboardType,
  } = otherProps;
  if (otherProps?.hidden) return <View />;
  switch (type) {
    case 'option': {
      return (
        <>
          {
            !!title &&
            <Text style={styles?.title}>{title}</Text>
          }
          {
            !!description &&
            <Text style={styles?.description}>{description}</Text>
          }
          <OptionField
            {...otherProps}
            onSelect={(value: string) => onChangeValue({parentId, subParentId, subIndex, id, value, type, index, hasDependent, option, setParentId, setIndex, required, keyboardType})}
          />
        </>
      )
    }
    case 'unit': {
      return (
        <>
          {
            !!title &&
            <Text style={styles?.title}>{title}</Text>
          }
          {
            !!description &&
            <Text style={styles?.description}>{description}</Text>
          }
          <UnitField
            {...otherProps}
            onChangeValue={(subId: string, value: string, _validate: any, _errorResponse: string) => {
              onChangeValue({
                parentId,
                subParentId,
                id,
                subId,
                subIndex,
                value,
                type,
                validate: _validate,
                errorResponse: _errorResponse,
                index,
                hasDependent,
                option,
                setParentId,
                setIndex,
                required,
                keyboardType,
              });
            }}
          />
        </>
      )
    }
    case 'date': {
      return (
        <>
          {
            !!title &&
            <Text style={styles?.title}>{title}</Text>
          }
          {
            !!description &&
            <Text style={styles?.description}>{description}</Text>
          }
          <DateField
            {...otherProps}
            onChangeValue={(subId: string, value: string) => {
              onChangeValue({
                parentId,
                subParentId,
                id,
                subId,
                subIndex,
                value,
                type,
                index,
                hasDependent,
                option,
                setParentId,
                setIndex,
                required,
                keyboardType,
              });
            }}
          />
        </>
      )
    }
    case 'time': {
      return (
        <>
          {
            !!title &&
            <Text style={styles?.title}>{title}</Text>
          }
          {
            !!description &&
            <Text style={styles?.description}>{description}</Text>
          }
          <TimeField
            {...otherProps}
            onChange={(value: Date) => {
              onChangeValue({
                parentId,
                subParentId,
                id,
                subIndex,
                value,
                type,
                index,
                hasDependent,
                option,
                setParentId,
                setIndex,
                required,
                keyboardType,
              });
            }}
          />
        </>
      )
    }
    case 'dropdown': {
      return (
        <>
          {
            !!title &&
            <Text style={styles?.title}>{title}</Text>
          }
          {
            !!description &&
            <Text style={styles?.description}>{description}</Text>
          }
          <DropdownField
            {...otherProps}
            onChangeValue={(value: string) => onChangeValue({parentId, subParentId, subIndex, id, value, type, index, hasDependent, option, setParentId, setIndex, required, keyboardType})}
          />
        </>
      )
    }

    default: {
      return (
        <>
          {
            !!title &&
            <Text style={styles?.title}>{title}</Text>
          }
          {
            !!description &&
            <Text style={styles?.description}>{description}</Text>
          }
          <InputField
            {...otherProps}
            onChangeText={(value: string) => {
              onChangeValue({
                parentId,
                subParentId,
                subIndex,
                id,
                value,
                type,
                validate,
                errorResponse: otherProps?.errorResponse,
                index,
                hasDependent,
                option,
                setParentId,
                setIndex,
                required,
                keyboardType,
              });
            }}
          />
        </>
      )
    }
  }  
};

export default React.memo(DynamicField);