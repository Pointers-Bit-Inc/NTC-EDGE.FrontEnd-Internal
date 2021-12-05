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
import useKeyboard from 'src/hooks/useKeyboard';
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
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    backgroundColor: 'white',
  },
  button: {
    borderRadius: 5,
    paddingVertical: 12,
  },
  keyboardAvoiding: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: 15,
  },
  blankSpace: {
    height: 150,
  }
});

const RegistrationSignUp = ({ route, navigation }:any) => {
  const isKeyboardVisible = useKeyboard();
  const {
    username,
    email,
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
    permitType: 'Please select a user type',
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
    if (!formValue.permitType.isValid) {
      return onChangeText('permitType', formValue.permitType.value);
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
      return navigation.navigate(
        'RegistrationSuccess',
        {
          username,
          email,
          password,
          userType: formValue.userType.value,
          permitType: formValue.permitType.value,
          firstname: formValue.firstname.value,
          middlename: formValue.middlename.value,
          lastname: formValue.lastname.value,
          phone: formValue.phone.value,
          address: formValue.address.value,
        }
      );
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
        keyboardVerticalOffset={75}
        style={styles.container}
      >
      <ScrollView
        style={{ paddingHorizontal: 20 }}
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
        <View style={styles.blankSpace} />
      </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <View style={[styles.footer, isKeyboardVisible && styles.shadow]}>
          <Button
            style={[
              styles.button,
              {
                backgroundColor: isValid ?
                  button.primary :
                  button.default
              }
            ]}
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
