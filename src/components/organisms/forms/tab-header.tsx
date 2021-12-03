import React from "react";

import { View, Text, StyleSheet } from "react-native";

const Header = (props:any) => {
    return (
        <View style={styles.containerHeader}>
            <View style={styles.textContainer}>
                <Text style={styles.textWhite}>Applicant's Details</Text>
            </View>
            <View style={styles.tabContainer}>
                <View>
                    <Text>Basic Info</Text>
                </View>
                <View>
                    <Text>Address</Text>
                </View>
                <View>
                    <Text>Additional Details</Text>
                </View>
                <View>
                    <Text>Contact</Text>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    containerHeader: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    textContainer: {
        marginTop: 10
    },
    textWhite: {
        color: "black",
    },
    tabContainer: {
        backgroundColor: "white",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        height: "20%",
        alignItems: "center",
        marginTop: 10,
        flex: 1
    }
});
export default Header;