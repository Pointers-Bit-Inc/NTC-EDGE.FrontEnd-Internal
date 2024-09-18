import {Dimensions , Platform , StyleSheet} from "react-native";
import {outline , text} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import {Bold , Regular} from "@styles/font";
const { width, height } = Dimensions.get('screen');


export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
     edgeFooter: {
         justifyContent: "center",
         alignItems: "center",
         flexDirection: "row"
     },
    footerContainer:{
        flexDirection : "row" ,
        paddingVertical : 30 ,
        justifyContent : "center" ,
        alignItems : "center" ,
        backgroundColor : "#fff",
         //flexWrap: "wrap"
    },
    footerContainerIsSmall: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    footerLinks: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerIsSmall: {
        fontSize: 14,
        color: '#555',
    },
    footerLinkIsSmall:{ color: '#fff', fontSize: 18, marginBottom: 20 },
    footer: {
        lineHeight: 24,
        fontSize: 14,
        fontFamily: Regular
    },
    bgImage: {
        backgroundColor: "#fff",

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
            native: {
                flex: 1,
                borderBottomWidth: 0,
                paddingHorizontal: 30,
            },
            default:{

                borderBottomWidth: 0.5,
                paddingHorizontal: 47,

            }
        }),
        borderRadius: 15,
        borderWidth: 0.5,

        borderColor: outline.disabled,
        backgroundColor: '#fff',

        paddingTop: 39,
        paddingBottom: 30
    },
    bottomContainer: {

    },
    loginButton: {
        borderRadius: 10,
       maxHeight: fontValue(56),

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
