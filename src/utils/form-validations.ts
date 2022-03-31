const validateEmail = (text:string) => {
  const regex = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
  return regex.test(text);
}

const validatePassword = (text:string) => {
  const characterLength = /^.{8,}$/.test(text);
  const upperAndLowerCase = /[a-z].*[A-Z]|[A-Z].*[a-z]/.test(text);
  const atLeastOneNumber = /.*[0-9].*/.test(text);
  const strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})").test(text);
  const mediumPassword = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})").test(text);
  let passwordStrength = 'Weak';
  if (mediumPassword && !strongPassword) {
    passwordStrength = 'Average'
  } else if (strongPassword) {
    passwordStrength = 'Strong'
  }
    console.log(characterLength,
  upperAndLowerCase,
  atLeastOneNumber,
  strongPassword,
  mediumPassword)
  return {
    characterLength,
    upperAndLowerCase,
    atLeastOneNumber,
    isValid: characterLength && upperAndLowerCase && atLeastOneNumber,
    strength: passwordStrength,
  };
}

const validatePhone = (text:string) => {
  const regex = /((^(\+)(\d){12}$)|(^\d{11}$))/;
  return regex.test(text);
}

const validateText = (text:string) => {
  return !!text.replace(/ /g, '');
}

export {
  validateEmail,
  validatePassword,
  validatePhone,
  validateText,
}