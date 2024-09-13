import {StyleSheet,Dimensions,Platform} from 'react-native';
import { text, input, button, primaryColor, lightPrimaryColor } from '@styles/color';
import { Bold } from '@styles/font';
import {RNValue as RFValue} from "@/src/utils/formatting";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    ...Platform.select({
     web:{
        width: "100%",

     }
    }),
    backgroundColor: '#fff',
  },
  reviewContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  reviewContainer2: {
    padding: 15,
    marginHorizontal: 5,
    marginVertical: 15,
  },
  tableContainer: {
    paddingVertical: 15,
  },
  tableHeadView: {
    backgroundColor: input.background.default,
    padding: 5,
    marginBottom: 5,
  },
  secondaryTableHeadView: {
    backgroundColor: input?.background?.lightDefault
  },
  headerText: {
    color: text.default,
  },
  boldText: {
    fontFamily: Bold,
  },
  subChildSeparator: {
    height: 1,
    backgroundColor: input.background.default,
    marginVertical: 10,
  },
  serviceText: {
    marginHorizontal: 5,
    marginTop: 5,
    textAlign: 'justify',
  },
  statusText: {
    marginLeft: 7,
    textTransform: 'uppercase',
  },

  row: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: 3,
  },
  rowRight: {
    flexShrink: 1,
  },
  leftText: {
    width: width / 2.5,
  },
  rightTextView: {
    flexShrink: 1,
  },
  descriptionText: {
    marginLeft: 15,
    fontSize: RFValue(13),
  },

  uploadFlatlist: {
    paddingHorizontal: 5,
    marginTop: 5,
  },
  uploadSeparatorMain: {
    height: 20,
    width: 10,
  },
  uploadSeparator: {
    height: 20,
    width: 10,
  },
  fileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileText: {
    width: '50%',
  },
  filePreview: {
    ...Platform.select({
       native: {
         height: width / 4,
         width: width / 4,
       },
      web: {
        height: (width * 0.60978835978) / 4,
        width: (width * 0.60978835978) / 4,
      }
    })

  },

  remarksContainer: {
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 25,
  },
  remarksTitle: {
    fontSize: RFValue(14),
    fontFamily: Bold,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    marginTop: -10,
    marginLeft: 15,
  },
  remarksContent: {
    fontSize: RFValue(15),
    textAlign: 'justify',
    margin: 15,
  },

  bottomView: {
    ...Platform.select({
      web:{
        height: width * 0.01
      },
      native: {
        height: width / 3,
      }
    })

  },
  bottomViewPageOnly: {
    ...Platform.select({
      web:{
         height: width * 0.01
      },
      native: {
        height: width / 1.5
      }
    })
  },

  webViewContainer: {
    backgroundColor: primaryColor,
    flex: 1,
  },
  webViewTab: {
    backgroundColor: button.primary,
    alignItems: 'center',
    padding: 15,
  },
  webViewTabText: {
    color: '#fff',
    fontFamily: Bold,
    fontSize: RFValue(16),
  },

  gggChildContainer: {
    marginHorizontal: 5
  },

  optionView: {
    marginVertical: 10
  },

  noteView: {
    backgroundColor: lightPrimaryColor,
    padding: 15,
    borderRadius: 10,
    marginVertical: 15
  },
  noteText: {
    textAlign: 'justify',
    color: text?.primary,
    fontFamily: Bold
  },
  bottomContainer: {
    ...Platform.select({
      native: {
        position: 'absolute',
        bottom: 0,
      },
    }),
    width: "100%",
    backgroundColor: '#fff',
    padding: 20,
  },

});
