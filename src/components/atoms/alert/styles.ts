import { outline, text } from '@styles/color';
import { Bold, Regular } from '@styles/font';
import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default StyleSheet.create({
  alertContainerStyle: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentContainerStyle: {
    borderRadius: 15,
    padding: 0,
  },
  contentStyle: {
    paddingVertical: 20,
  },
  titleStyle: {
    fontFamily: Bold,
    color: '#000',
    fontSize: RFValue(18),
  },
  messageStyle: {
    fontFamily: Regular,
    paddingHorizontal: 15,
    textAlign: 'center',
    color: '#000',
    fontSize: RFValue(15),
  },
  actionContainerStyle: {
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: outline.default,
    paddingVertical: 10,
  },
  confirmButtonStyle: {
    backgroundColor: undefined,
  },
  cancelButtonStyle: {
    backgroundColor: undefined,
  },
  confirmButtonTextStyle: {
    fontFamily: Bold,
    color: text.primary,
    fontSize: RFValue(15),
  },
  cancelButtonTextStyle: {
    fontFamily: Bold,
    color: text.default,
    fontSize: RFValue(15),
  }
});