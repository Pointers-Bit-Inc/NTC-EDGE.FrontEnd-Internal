import {Dimensions, StyleSheet} from "react-native";
const {width} = Dimensions.get('window');
export const styles = StyleSheet.create({
    rect4: {

        flex: 1,
        height: 4,
        backgroundColor: "#E6E6E6",
    },
    container: {
        zIndex: 1,
        position: "absolute",
        flex: 1,
        justifyContent: "center"
    },
    group9: {
        justifyContent: "flex-start",
        alignItems: "center",

        flex: 1,
        alignSelf: "center"
    },
    group4: {
        height: 115,
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
        width: "88%",
        height: 40,
        backgroundColor: "rgba(239,240,246,1)",
        borderRadius: 10,
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
        position: "absolute",
        color: "#121212",
        fontSize: 14,
        height: 40,
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
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "center"
    },
    rect3: {
        backgroundColor: "rgba(255,255,255,1)",
        flex: 1
    },
    group7: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 13,
    },
    recentSearches: {
        fontWeight: "500",
        lineHeight: 28,
        color: "#000",
        textAlign: "left",
        width: "90%",
        margin: 5
    },
    group6: {
        width: "96%",
        height: 30,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        margin: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 18
    },
    group5: {
        width: width/1.44,
        height: 25,
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