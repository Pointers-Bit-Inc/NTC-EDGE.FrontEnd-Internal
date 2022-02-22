import { StyleSheet, Platform, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { input, outline } from './color';
import { Bold, Regular } from './font';

const { text, background } = input;

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    marginBottom: RFValue(20),
  },
  container: {
    backgroundColor: background?.default,
    borderColor: background?.default,
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(15),
    height: RFValue(50),
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownOuterContainer: {
    paddingHorizontal: 0,
    paddingVertical: 5,
    height: undefined,
    justifyContent: undefined,
  },
  dropdownInnerContainer: {
    paddingHorizontal: RFValue(15),
  },
  dropdownListContainer: {
    marginTop: Platform.OS === 'android' ? -(width * .04) : 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: outline.default,
    paddingVertical: 10,
  },
  labelContainer: {

    flexDirection: 'row',
  },
  headerLabelText: {
    color: text?.defaultColor,
    fontSize: RFValue(16),
    fontFamily: Bold,

  },
  labelText: {
    color: text?.defaultColor,
    fontSize: RFValue(12),
  },
  requiredText: {
    color: text?.errorColor,
  },
  validationText: {
    fontSize: RFValue(12),
    marginTop: 5,
  },
  placeholderText: {
    color: text?.defaultColor,
    fontFamily: Regular,
    fontSize: RFValue(14),
  },
  inputText: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: text?.mainColor,
    fontFamily: Regular,
    fontWeight: 'normal',
  },
  iconStyle: {
    height: RFValue(20),
    width: RFValue(20),
  },
  outlineStyle: {
    borderRadius: 4,
    //paddingHorizontal: 8,
    paddingVertical: 1,
    borderColor: outline.default,
  },
  text: {
    
    color: text.defaultColor,
    fontWeight: '400',
  },

});