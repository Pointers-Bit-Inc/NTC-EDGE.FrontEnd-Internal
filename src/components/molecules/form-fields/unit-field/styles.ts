import {StyleSheet,Dimensions,Platform} from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  view: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -5
  },
  dropdownContainer: {
     ...Platform.select({
      native: {
        width: (width - 50)/ 2
     } ,
      web: {
        flex: 0.495,
      }
    }),

    marginBottom: 15,
  },
  dropdownContainer3: {
    ...Platform.select({
      native: {
        width: (width - 50)/ 2
      } ,
      web: {
        flex: 0.495,
      }
    }),
  },
  dropdownContainer2: {
    marginTop: -5,
    marginBottom: 15,
  },
});
