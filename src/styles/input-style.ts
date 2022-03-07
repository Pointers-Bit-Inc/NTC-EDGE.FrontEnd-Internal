import { StyleSheet, Platform, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { input, outline } from './color';
import { Bold, Regular } from './font';
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";

const { text, background } = input;

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    marginBottom: fontValue(20),
  },
  container: {
    backgroundColor: background?.default,
    borderColor: background?.default,
    borderWidth: fontValue(2),
    borderRadius: fontValue(10),
    paddingHorizontal: fontValue(15),
    height: fontValue(50),
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownContainer: {
    paddingHorizontal: fontValue(15),
  },
  dropdownListContainer: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: outline.default,
    alignSelf: 'center',
    padding: 10,
    width: width - 30,
    maxHeight: width * .60,
  },
  dropdownElementContainer: {
    padding: 10,
    borderRadius: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    padding: 0,
  },
  headerLabelText: {
    color: text?.defaultColor,
    fontSize: fontValue(16),
    fontFamily: Bold,
  },
  labelText: {
    color: text?.defaultColor,
    fontSize: fontValue(12),
  },
  requiredText: {
    color: text?.errorColor,
  },
  validationText: {
    fontSize: fontValue(12),
    marginTop: 5,
  },
  placeholderText: {
    color: text?.defaultColor,
    fontFamily: Regular,
    fontSize: fontValue(14),
  },
  inputText: {
    paddingHorizontal: 0,
    ...Platform.select({
      ios: {
        paddingVertical:  0,
      },
      android:{
        paddingVertical: -100,
      },
      default: {
        paddingVertical:  0,
      }
    }),
    marginVertical: -(3),
    color: text?.mainColor,
    fontFamily: Regular,
    fontWeight: 'normal',
    marginTop: -3
  },
  iconStyle: {
    height: fontValue(20),
    width: fontValue(20),
  }
});