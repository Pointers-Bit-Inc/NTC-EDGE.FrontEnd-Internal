import {Dimensions, StyleSheet} from "react-native";
import {outline} from "@styles/color";
const {width, height} = Dimensions.get('window');
export const styles = StyleSheet.create({
   header:{
      backgroundColor: "#fff",

       flexDirection: "row",
       paddingBottom: 5,
       paddingHorizontal: 20,
       paddingTop: 36,
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
      paddingTop: 45,
        paddingBottom: 11,
       paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 24,

    },
    group: {
        height: 45,
        flex: 1
    },
    rect2: {
        borderWidth: 2,
        borderColor: "#041B6E",
        borderRadius: 12,

    },
    group3: {
        top: 0,
        left: 0,
        position: "absolute",
        right: 0,
        bottom: 0
    },
    textInput: {
        top: 0,
        left: 0,

        paddingHorizontal: 15,
        paddingVertical: 12,
        color: "#121212",
        fontSize: 14,
        right: 0,
        textAlign: "left"
    },
    icon2: {
        
        alignSelf: "flex-end",
       top: "35%",
        right: "5%",
        color: "rgba(128,128,128,1)",
        fontSize: 25,
    },
    textInputStack: {


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
        fontWeight: "600",
        fontSize: 18,
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
        flexDirection: "row",
    },
    icon3: {
        marginRight: 10,
        color: "rgba(128,128,128,1)",
        fontSize: 25
    },
    loremIpsum: {
        color: "#121212"
    },
    icon4: {
    }
});