import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { validateText, validatePhone } from 'src/utils/form-validations';
import { ArrowLeftIcon } from '@atoms/icon';
import RegistrationDetailsForm from '@organisms/forms/registration-details';
import Text from '@atoms/text';
import Button from '@components/atoms/button';
import { button } from 'src/styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    marginBottom: 10,
    fontWeight: '500',
    color: '#37405B',
    marginTop: 25,
  },
  footer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 20,
    bottom: 45,
  },
  button: {
    marginTop: 35,
    borderRadius: 5,
    paddingVertical: 12,
  }
});

const RegistrationSignUp = ({ route, navigation }:any) => {
  const {
    username,
    email,
    phone,
    password,
  } = route.params;
  const [formValue, setFormValue] = useState({
    userType: {
      value: 'Individual',
      isValid: false,
      error: '',
    },
    permitType: {
      value: '',
      isValid: false,
      error: '',
    },
    firstname: {
      value: '',
      isValid: false,
      error: '',
    },
    middlename: {
      value: '',
      isValid: false,
      error: '',
    },
    lastname: {
      value: '',
      isValid: false,
      error: '',
    },
    phone: {
      value: '',
      isValid: false,
      error: '',
    },
    address: {
      value: '',
      isValid: false,
      error: '',
    },
    agreed: {
      value: false,
    }
  });

  const errorResponse = {
    userType: 'Please select a user type',
    permitType: 'Please select a permit type',
    firstname: 'Enter First name',
    middlename: 'Enter Middle name',
    lastname: 'Enter Last name',
    phone: 'Please enter a valid phone number',
    address: 'Enter Address',
  };

  const onChangeText = (key: string, value: any) => {
    switch (key) {
      case 'userType': {
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: !!value,
            error: !value ? errorResponse['userType'] : ''
          }
        });
      }
      case 'permitType': {
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: !!value,
            error: !value ? errorResponse['permitType'] : ''
          }
        });
      }
      case 'firstname': {
        const test = validateText(value);
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: test,
            error: !test ? errorResponse['firstname'] : ''
          }
        });
      }
      case 'middlename': {
        const test = validateText(value);
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: test,
            error: !test ? errorResponse['middlename'] : ''
          }
        });
      }
      case 'lastname': {
        const test = validateText(value);
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: test,
            error: !test ? errorResponse['lastname'] : ''
          }
        });
      }
      case 'phone': {
        const checked = validatePhone(value);
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: checked,
            error: !checked ? errorResponse['phone'] : ''
          }
        });
      }
      case 'address': {
        const test = validateText(value);
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: test,
            error: !test ? errorResponse['address'] : ''
          }
        });
      }
      case 'agreed': {
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
          }
        });
      }
      default:
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: !!value,
            error: '',
          }
        });
    }
  };

  const onCheckValidation = () => {
    if (!formValue.userType.isValid) {
      return onChangeText('userType', formValue.userType.value);
    } else if (!formValue.permitType.isValid) {
      return onChangeText('userType', formValue.permitType.value);
    } else if (!formValue.firstname.isValid) {
      return onChangeText('firstname', formValue.firstname.value);
    } else if (!formValue.middlename.isValid) {
      return onChangeText('middlename', formValue.middlename.value);
    } else if (!formValue.lastname.isValid) {
      return onChangeText('lastname', formValue.lastname.value);
    } else if (!formValue.phone.isValid) {
      return onChangeText('phone', formValue.phone.value);
    } else if (!formValue.address.isValid) {
      return onChangeText('address', formValue.address.value);
    } else if (!formValue.agreed.value) {
      return onChangeText('agreed', formValue.agreed.value);
    } else {
      return navigation.navigate('RegistrationSuccess');
    }
  }

  const isValid =
    formValue.firstname.isValid &&
    formValue.middlename.isValid &&
    formValue.lastname.isValid &&
    formValue.phone.isValid &&
    formValue.address.isValid &&
    formValue.agreed.value;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
      <ScrollView
        style={{ paddingHorizontal: 20, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 35 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon color={'#37405B'} size={26} />
          </TouchableOpacity>
          <Text size={24} weight={'500'} style={styles.title}>
            Sign up
          </Text>
        </View>
        <RegistrationDetailsForm onChangeValue={onChangeText} form={formValue} />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          style={[styles.button, { backgroundColor: isValid ? button.primary : button.default }]}
          onPress={onCheckValidation}
        >
          <Text color="white" size={18}>Sign up</Text>
        </Button>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistrationSignUp;
