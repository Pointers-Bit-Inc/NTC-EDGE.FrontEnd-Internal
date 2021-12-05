import { StyleSheet } from 'react-native';
import { primaryColor, disabledColor, defaultColor } from '@styles/color';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  titleStyle: {
    color: primaryColor,
    fontWeight: 'bold',
  },
  iconStyle: {
    color: defaultColor,
  },
  progressContainer: {
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    shadowOffset: { width: 0, height: -3 },
  },
  buttonEnabled: {
    backgroundColor: primaryColor,
    borderRadius: 10,
	},
	buttonDisabled: {
    backgroundColor: disabledColor,
    borderRadius: 10,
	},
	buttonTxt: {
		color: '#fff',
	},
});