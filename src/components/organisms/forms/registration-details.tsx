import React, { FC, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { CheckIcon } from '@atoms/icon';
import {
  InputField,
  DropdownField,
} from '@molecules/form-fields';
import InputStyles from 'src/styles/input-style';
import { text, outline } from 'src/styles/color';
import Text from '@atoms/text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginLeft: 10
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  passwordValidationContainer: {
    paddingVertical: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  strengthBar: {
    height: 4,
    borderRadius: 4,
    marginTop: 10,
    flex: 1,
  },
  horizontal: {
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unchecked: {
    height: 18,
    width: 18,
    backgroundColor: '#DBDFE5',
    borderRadius: 3,
  },
  circle: {
    height: 15,
    width: 15,
    borderColor: outline.default,
    borderWidth: 1.2,
    borderRadius: 15,
    marginRight: 5,
  },
  circleActive: {
    borderColor: outline.primary,
    borderWidth: 5,
  }
})

const companyType = [
  {
    label: 'Radio Station',
    value: 'Radio Station',
  },
  {
    label: 'Aeronautical Station',
    value: 'Aeronautical Station',
  },
  {
    label: 'Aircraft Station',
    value: 'Aircraft Station',
  },
  {
    label: 'Ship Station',
    value: 'Ship Station',
  },
  {
    label: 'Coastal Station',
    value: 'Coastal Station',
  },
  {
    label: 'Public Coastal Station',
    value: 'Public Coastal Station',
  },
  {
    label: 'Public Telecommunications Entities (PTEs)',
    value: 'Public Telecommunications Entities (PTEs)',
  },
  {
    label: 'Government and Private Radio Stations',
    value: 'Government and Private Radio Stations',
  },
  {
    label: 'Individuals and Private and Government Entities',
    value: 'Individuals and Private and Government Entities',
  },
  {
    label: 'Mobile Phone Service Center',
    value: 'Mobile Phone Service Center',
  },
];

const individualType = [
  {
    label: 'Radio Operator',
    value: 'Radio Operator',
  },
  {
    label: 'Dealer of Radio Communication Equipment',
    value: 'Dealer of Radio Communication Equipment',
  },
  {
    label: 'Retailer/Reseller of Radio Communication Equipment',
    value: 'Retailer/Reseller of Radio Communication Equipment',
  },
  {
    label: 'Service Center of Radio Communication Equipment',
    value: 'Service Center of Radio Communication Equipment',
  },
  {
    label: 'Mobile Phone Dealer',
    value: 'Mobile Phone Dealer',
  },
  {
    label: 'Mobile Phone Retailer/Reseller',
    value: 'Mobile Phone Retailer/Reseller',
  },
  {
    label: 'Accredited Radio Dealers/Manufacturers',
    value: 'Accredited Radio Dealers/Manufacturers',
  },
  {
    label: 'Cable TV Operators and Private and Government Entities',
    value: 'Cable TV Operators and Private and Government Entities',
  },
  {
    label: 'Value Added Service (VAS) Provider',
    value: 'Value Added Service (VAS) Provider',
  }
];

const userType = [
  {
    label: 'Individual',
    value: 'Individual',
  },
  {
    label: 'Company',
    value: 'Company',
  }
];
interface Props {
  form?: any;
  onChangeValue?: any;
}

const RegistrationForm: FC<Props> = ({ form = {}, onChangeValue = () => {} }) => {
  const handlePress = useCallback(() => {
    Linking.openURL('https://ntc.gov.ph/');
  }, []);

  const renderAgreedChecker = (checked:boolean) => {
    if (checked) {
      return (
        <View
          style={[
            styles.unchecked,
            {
              backgroundColor: text.primary,
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}
        >
          <CheckIcon
            type="check"
            color="white"
            size={14}
          />
        </View>
      );
    }
    return (
      <View style={styles.unchecked} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.typeContainer}>
        <Text color={text.default} size={14}>User</Text>
        {
          userType.map(item => (
            <TouchableOpacity
              key={item.value}
              onPress={() => onChangeValue('userType', item.value)}
            >
              <View style={styles.buttonContainer}>
                <View style={[styles.circle, item.value === form.userType.value && styles.circleActive]} />
                <Text color={text.default} size={14}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))
        }
      </View>
      <DropdownField
        outlineStyle={InputStyles.outlineStyle}
        items={
          form.userType.value ?
            form.userType.value === 'Company' ?
              companyType
              : individualType
            : []
        }
        label={'User'}
        required={true}
        hasValidation={true}
        requiredColor={text.error}
        activeColor={text.primary}
        errorColor={text.error}
        placeholder={{
          label: 'User',
          value: null,
          color: 'black',
        }}
        error={form?.permitType?.error}
        value={form?.permitType?.value}
        onChangeValue={(value: string) => onChangeValue('permitType', value)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'First name'}
        placeholder="First name"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        error={form?.firstName?.error}
        requiredColor={text.error}
        value={form?.firstName?.value}
        onChangeText={(value: string) => onChangeValue('firstname', value)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Middle name'}
        placeholder="Middle name"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        error={form?.middleName:?.error}
        value={form?.middleName:?.value}
        onChangeText={(value: string) => onChangeValue('middleName:', value)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Last name'}
        placeholder="Last name"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        error={form?.lastName?.error}
        value={form?.lastName?.value}
        onChangeText={(value: string) => onChangeValue('lastname', value)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Phone'}
        placeholder="Phone number"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        error={form?.phone?.error}
        value={form?.phone?.value}
        keyboardType={'phone-pad'}
        onChangeText={(value: string) => onChangeValue('phone', value)}
        onSubmitEditing={(event:any) => onChangeValue('phone', event.nativeEvent.text)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Address'}
        placeholder="Address"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        error={form?.address?.error}
        value={form?.address?.value}
        onChangeText={(value: string) => onChangeValue('address', value)}
      />
      <View style={styles.horizontal}>
        <TouchableOpacity onPress={() => onChangeValue('agreed', !form?.agreed?.value)}>
          {renderAgreedChecker(form?.agreed?.value)}
        </TouchableOpacity>
        <Text
          style={[InputStyles.text, styles.label]}
          size={12}
        >
          {'By clicking Sign up, you agree to our'}
          <Text
            onPress={handlePress}
            style={[
              InputStyles.text,
              {
                color: text.primary
              }
            ]}
            size={12}
          >
            {' Terms, Data Policy '}
          </Text>
          {'and'}
          <Text
            onPress={handlePress}
            style={[
              InputStyles.text,
              {
                color: text.primary
              }
            ]}
            size={12}
          >
            {' Cookies Policy.'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default RegistrationForm;
