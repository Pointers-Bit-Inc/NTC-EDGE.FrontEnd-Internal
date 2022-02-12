import { StyleSheet } from "react-native";
import {text , outline, input} from './color';
import {RFValue} from "react-native-responsive-fontsize";
import {Bold , Regular} from "@styles/font";
const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: RFValue(20),
  },
  container: {
    backgroundColor: input.background?.default,
    borderColor: input.background?.default,
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
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: outline.default,
  },
  labelContainer: {
    flexDirection: 'row',
    padding: 0,
  },
  headerLabelText: {
    color: text?.default,
    fontSize: RFValue(16),
    fontFamily: Bold,
  },
  labelText: {

    color: text?.default,
    fontSize: RFValue(12),
  },
  requiredText: {
    color: text?.error,
  },
  validationText: {
    fontSize: RFValue(12),
    marginTop: 5,
  },
  placeholderText: {
    color: text?.default,
    fontFamily: Regular,
    fontSize: RFValue(14),
  },
  inputText: {
    paddingHorizontal: 0,
    paddingVertical: 0,

    fontFamily: Regular
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
    color: text.default,
    fontWeight: '400',
  },
})

export default styles;