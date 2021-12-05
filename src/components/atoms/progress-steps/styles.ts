import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  flatlist: {
    alignItems: 'center',
  },
  progress: {
    width: width * .07,
    height: 5,
    marginRight: 5,
  },
});