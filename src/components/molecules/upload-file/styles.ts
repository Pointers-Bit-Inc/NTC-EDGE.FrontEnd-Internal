import {StyleSheet,Dimensions,Platform} from 'react-native';
import { input, outline, text } from '@styles/color';
import { Bold } from '@styles/font';
import {RNValue as RFValue, RNValue} from "@utils/formatting";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: outline.default
  },
  uploadContainer: {
    backgroundColor: input.background.default,
    borderRadius: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  uploadedContainer: {
    justifyContent: 'center',
    marginTop: 5,
  },
  uploadText: {
    color: text.info,
    marginLeft: 5,
  },
  uploadedText: {
    color: text.success,
    ...Platform.select({
      native: {
        marginTop: 5,
      },
      web: {
        marginVertical: 5
      }
    }),

  },
  disabledText: {
    color: text.disabled,
  },
  fileContainer: {
    ...Platform.select({
      native: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      web: {
        padding: 10,
      },
    }),



    marginTop: 10,
  },
  fileIconTextContainer: {

    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    marginRight: 10,
  },
  fileTextContainer50: {
    width: '50%',
  },
  fileText: {
    fontFamily: Bold,
  },
  fileXContainer: {
    width: '10%',
    alignItems: 'flex-end',
  },
  filePreview: {
    ...Platform.select({
        native: {
          height: width / 4,
          width: width / 4,
        },
      web: {

        height: (width * 0.11044973545),
        width: (width * 0.11044973545),
      }
    })

  },
  xPreviewContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'flex-end',
    borderRadius: 30,
    padding: 3,
    margin: 3,
  },
  progressText: {
    color: text.default,
    marginLeft: 5,
  },
  progressBar: {
    marginTop: 10,
    ...Platform.select({
       web: {
         position: "absolute",
         width: "100%",
       }
    })

  },
  separator: {
    height: 10,
  },
  selectionRow: {
    ...Platform.select({
      web: {

      },
      native: {
        flexDirection: 'row',
      }
    }),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  selectionSeparator: {
    height: 1,
    backgroundColor: input?.background?.default,
    margin: 15
  },
  selectionText: {
    fontSize: RFValue(16),
  },
  selectionIcon: {
    color: text?.default,
    marginRight: 10
  },
  descriptionText: {
    fontSize: RNValue(12),
    color: text?.disabled,
    marginTop: 3,
  }
});