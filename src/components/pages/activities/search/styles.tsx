import {Dimensions, StyleSheet} from "react-native";
import {outline} from "@styles/color";
import {Bold , Regular} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";
const {width, height} = Dimensions.get('window');
export const styles = StyleSheet.create({
   header:{
      backgroundColor: "#fff",

       flexDirection: "row",
       paddingBottom: 5,
       paddingHorizontal: fontValue(20),
       paddingTop: fontValue(20),
       alignItems: "center"
   },
    rect4: {

        flex: 1,
        //backgroundColor: "#E6E6E6",
    },
    container: {
        flex: 1,

    },
    group9: {
        alignItems: "center",

        flex: 1,
    },
    group4: {
        alignSelf: "stretch"
    },
    rect: {

        backgroundColor: "#fff",
        borderBottomColor: outline.default,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    group2: {
      paddingTop: fontValue(40),
        paddingBottom:fontValue(20),
       paddingHorizontal: fontValue(20),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: fontValue(14),

    },
    group: {
        height: fontValue(50),
        flex: 1
    },
    rect2: {

        


    },
    group3: {
    },
    textInput: {
       flex: 1,
        borderWidth: 2,
        borderRadius: 12,
        borderColor: "#041B6E",
        paddingHorizontal: 15,
        paddingVertical: 12,
        color: "#121212",
        fontSize: fontValue(14),
        textAlign: "left"
    },
    icon2: {
        alignSelf: "flex-end",
         position: "absolute",
        color: "rgba(128,128,128,1)",
        fontSize: fontValue(25),
    },
    textInputStack: {
         flexDirection: "row"
    },
    rect2Stack: {
        flex: 1  ,
    },
        group8: {
        paddingBottom: 10,
        width: "100%",

        flex: 1,
    },
    rect3: {

        flex: 1
    },
   
    recentSearches: {
        fontFamily: Bold,
        fontSize: fontValue(18),
        lineHeight: fontValue(28),
        color: "#000",

    },
    group6: {

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
       paddingLeft: fontValue(20),
       paddingRight: fontValue(20),
       paddingTop: fontValue(20),
    },
    group5: {
       alignItems: "center",
        flexDirection: "row",
    },
    icon3: {
        marginRight: fontValue(10),
        color: "rgba(128,128,128,1)",
        fontSize: fontValue(25)
    },
    loremIpsum: {
       fontSize: fontValue(18),
        fontFamily: Regular,
        color: "#121212"
    },
    icon4: {
    }
});