import {StyleSheet,Dimensions,Platform} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { text } from '@styles/color';
import {fontValue} from "@pages/activities/fontValue";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    overlay: {
        width: '100%',
        height: '100%',
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
    },
    placeholder: {
        width: '90%',
        fontSize: fontValue(12),
    },
    labelText: {
        marginTop: RFValue(5),
    },
    valueText: {
        ...Platform.select({
            native:{
                marginTop: RFValue(-2),
                marginBottom: RFValue(2),
            },
            web: {
                marginTop: RFValue(-2),
            }
        })

    },
    ellipsisContainer: {
        ...Platform.select({
            native: {
                width: width / 6,
                height: width / 3,
            },
            web: {
                width: (width * 0.60978835978) / 6,
                height: (width * 0.60978835978) / 3,
            }
        }),
        alignSelf: 'center',
        justifyContent: 'center',
    },
    emptyListContainer: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    emptyListText: {
        color: text?.default
    },
});
