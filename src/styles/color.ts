
const primaryColor = '#031A6E';
const lightPrimaryColor = '#d3daf7';
const secondaryColor = '#FFFFFF';
const defaultColor = '#565962';
const lightDefaultColor = '#EFF0F6';
const successColor = '#2C9669';
const lightSuccessColor = '#EAF9DF';
const errorColor = '#CA024F';
const lightErrorColor = '#FFECFC';
const warningColor = '#FFAE42';
const disabledColor = '#D1D1D1';
const infoColor = '#2F5BFA';
const lightInfoColor = '#DBEAFE';
const outline = {
  primary: '#031A6E',
  secondary: '#FFFFFF',
  default: '#C4C4C4',
  success: '#2C9669',
  error: '#CE1026',
  disabled: '#D1D1D1',
}

const text = {
  primary: '#031A6E',
  secondary: '#FFFFFF',
  default: '#3A404A',
  success: '#2C9669',
  error: '#CE1026',
  disabled: '#D1D1D1',
  info: '#2F5BFA',
};

const button = {
  primary: '#031A6E',
  secondary: '#FFFFFF',
  default: '#C4C4C4',
  success: '#2C9669',
  error: '#CE1026',
  info: '#2F5BFA',
  disabled: '#D1D1D1',
};

const bubble = {
  primary: '#031A6E',
  secondary: '#E5E5E5',
};

const input = {
  text: {
    mainColor: '#15142A',
    defaultColor: '#808197',
    activeColor: text.primary,
    requiredColor: text.error,
    errorColor: text.error,
    successColor: text.success,
  },
  background: {
    default: lightDefaultColor,
    required: lightErrorColor,
    error: lightErrorColor,
    success: lightSuccessColor,
  },
};
export {
  input,
  infoColor,
  lightPrimaryColor,
  primaryColor,
  secondaryColor,
  defaultColor,
  successColor,
  errorColor,
  warningColor,
  disabledColor,
  outline,
  text,
  button,
  bubble,
}