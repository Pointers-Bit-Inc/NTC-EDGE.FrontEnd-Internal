import {Dimensions, StyleSheet} from "react-native";
import {outline} from "@styles/color";
import {Bold , Regular} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
const {width, height} = Dimensions.get('window');
export const styles = StyleSheet.create({
   header:{
      backgroundColor: "#fff",

       flexDirection: "row",
       paddingBottom: 5,
       paddingHorizontal: 20,
       paddingTop: 20,
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
      paddingTop: 40,
        paddingBottom: 20,
       paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: RFValue(14),

    },
    group: {
        height: 50,
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
        fontSize: RFValue(14),
        textAlign: "left"
    },
    icon2: {
        alignSelf: "flex-end",
         position: "absolute",
        color: "rgba(128,128,128,1)",
        fontSize: RFValue(25),
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
        fontSize: RFValue(18),
        lineHeight: 28,
        color: "#000",

    },
    group6: {

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
       paddingLeft: 20,
       paddingRight: 20,
       paddingTop: 20,
    },
    group5: {
       alignItems: "center",
        flexDirection: "row",
    },
    icon3: {
        marginRight: 10,
        color: "rgba(128,128,128,1)",
        fontSize: RFValue(25)
    },
    loremIpsum: {
       fontSize: RFValue(18),
        fontFamily: Regular,
        color: "#121212"
    },
    icon4: {
    }
});