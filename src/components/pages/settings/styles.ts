import { button, text } from '@styles/color';
import { Bold } from '@styles/font';
import { StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    height: width / 4,
    width: width / 4,
    borderRadius: width / 4,
  },
  nameText: {
    fontFamily: Bold,
    fontSize: RFValue(20),
    marginTop: 10,
  },
  emailText: {
    color: text.default,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: button.info,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textButton: {
    color: '#fff',
  },
  leftTextButton: {
    marginRight: 5,
  },

  textSettings: {
    fontSize: RFValue(16),
    marginLeft: 15,
  },

  separator: {
    height: 20,
  },
  separator2: {
    height: 30,
  },
});