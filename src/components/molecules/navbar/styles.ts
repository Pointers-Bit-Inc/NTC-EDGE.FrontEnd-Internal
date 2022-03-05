import { StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { primaryColor, text } from '@styles/color';
import { Bold } from '@styles/font';
import {fontValue} from "@pages/activities/script";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: primaryColor,
    borderBottomWidth: 1,
    borderBottomColor: primaryColor,
  },
  shadowContainer: {
    overflow: 'hidden',
    paddingBottom: 15,
    zIndex: 1,
  },
  shadow: {
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },
  },
  titleContainer: {
    maxWidth: width * .70,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    fontSize: fontValue(18),
    fontFamily: Bold,
  },
  lightTitle: {
    color: text.default,
  }
});