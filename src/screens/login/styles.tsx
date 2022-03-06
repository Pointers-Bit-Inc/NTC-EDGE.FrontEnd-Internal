import {Dimensions , Platform , StyleSheet} from "react-native";
import {outline , text} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import {Bold} from "@styles/font";
const { width, height } = Dimensions.get('screen');


export const styles = StyleSheet.create({

    fixed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    bgImage: {
        backgroundColor: "#fff",
        height ,
        width,
    },
    formTitleText: {
        ...Platform.select({
            
            native: {
                fontSize: fontValue(20),
                color: text.primary,
                textAlign: 'center',
                marginBottom: 30
            },
            default:{
                fontSize: fontValue(24),
                color: text.primary,
                textAlign: 'left',
                marginBottom: 35,
                marginLeft: 8
            }
        }),
        fontFamily: Bold,

    },
    image: {
        height: width * .15,
        width: width * .60,
        marginTop: height * .10,
        marginVertical: height * .08,
        alignSelf: 'center',
    },
    formContainer: {
       
        ...Platform.select({
            ios: {
                flex: 1,
                borderBottomWidth: 0,
            },
            android: {
                flex: 1,
                borderBottomWidth: 0,
            },
            default:{
                borderBottomWidth: 0.5,
            }
        }),
        borderRadius: 15,
        borderWidth: 0.5,

        borderColor: outline.disabled,
        backgroundColor: '#fff',
        paddingHorizontal: 47,
        paddingTop: 39,
        paddingBottom: 30
    },
    bottomContainer: {
        
    },
    loginButton: {
        borderRadius: 10,

        paddingVertical: fontValue(15),
        justifyContent: 'center',
    },
    boldText: {
        fontFamily: Bold,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    }
});