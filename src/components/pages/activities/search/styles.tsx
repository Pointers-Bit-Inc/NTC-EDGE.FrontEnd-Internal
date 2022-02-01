import {Dimensions, StyleSheet} from "react-native";
const {width, height} = Dimensions.get('window');
export const styles = StyleSheet.create({
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
        height: 115,
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(229,229,229,1)"
    },
    group2: {
        width: width,
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 56,
        marginLeft: 15
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 24,

    },
    group: {
        height: 40,
        flex: 1
    },
    rect2: {
        borderWidth: 2,
        borderColor: "#041B6E",
        borderRadius: 12,
        width: "90%",
        padding: 20,

    },
    group3: {
        top: 0,
        left: 0,
        position: "absolute",
        right: 0,
        bottom: 0
    },
    textInput: {
         marginLeft: 10,
        top: 0,
        left: 0,
        position: "absolute",
        color: "#121212",
        fontSize: 14,
        height: 44,
        right: 0,
        textAlign: "left"
    },
    icon2: {

        alignSelf: "flex-end",
        top: "40%",
        right: "15%",
        color: "rgba(128,128,128,1)",
        fontSize: 25,
    },
    textInputStack: {
        borderColor: "black",
        height: 40,
        marginLeft: 5
    },
    rect2Stack: {
        flex: 1  ,
    },
        group8: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,1)",
        flex: 1,
    },
    rect3: {

        flex: 1
    },
   
    recentSearches: {
        fontWeight: "500",
        lineHeight: 28,
        color: "#000",
        paddingBottom: 15,
         paddingLeft: 20,
        paddingTop: 36
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