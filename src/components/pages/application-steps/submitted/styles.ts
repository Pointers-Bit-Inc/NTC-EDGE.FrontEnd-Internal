import { StyleSheet, Dimensions } from 'react-native';
import { primaryColor, defaultColor } from '@styles/color';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * .15,
    alignItems: 'center',
  },
  image: {
    height: 100,
    width: 100,
  },
  messageOne: {
    fontSize: 20,
    color: primaryColor,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 30,
  },
  messageTwo: {
    fontSize: 16,
    color: defaultColor,
    textAlign: 'center',
    marginTop: 30,
  },
});