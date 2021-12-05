import { StyleSheet, Dimensions } from 'react-native';
import { disabledColor } from '@styles/color';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  statusBar: {
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: disabledColor,
  },
  titleContainer: {
    maxWidth: width * .70,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
});