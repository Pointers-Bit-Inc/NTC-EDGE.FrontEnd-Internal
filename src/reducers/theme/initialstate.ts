const { Record } = require('immutable');

const InitialState = Record({
  background: {
    primary: '#FFFFFF',
    secondary: '#000000'
  },
  text: {
    primary: '#2B23FF',
    secondary: '#FFFFFF',
    default: '#000000',
    error: '#EB0000',
  },
  button: {
    primary: '#2B23FF',
    secondary: '#FFFFFF',
    default: '#000000',
    error: '#EB0000',
  },
  outline: {
    primary: '#2B23FF',
    secondary: '#FFFFFF',
    default: '#000000',
    error: '#EB0000',
  },
  roundness: 10,
  thickness: 1,
});

export default InitialState;
