import React, {Component, useEffect} from "react";
import {StyleSheet, View, TextInput, Text, TouchableOpacity} from "react-native";
import {EvilIcons, Ionicons, MaterialIcons} from "@expo/vector-icons";

function Search(props:any) {
    return (
        <View style={styles.container}>
            <View style={styles.rect}>
                <View style={styles.iconRow}>
                    <TouchableOpacity onPress={props.onDismissed}>
                        <Ionicons name="md-arrow-back" style={styles.icon}></Ionicons>
                    </TouchableOpacity>

                    <View style={styles.group}>
                        <View style={styles.textInputStack}>
                            <TextInput
                                value={props.searchTerm}
                                placeholder="Search"
                                style={styles.textInput}
                                onChange={(event) => props.onSearchTerm(event.nativeEvent.text)}
                            ></TextInput>
                            <TouchableOpacity onPress={props.onDismissed}>
                                <EvilIcons
                                    name="close-o"
                                    style={styles.icon2}
                                ></EvilIcons>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

                {props.searchTerm.length == 0 && <Text style={styles.recentSearches}>Recent searches</Text>}
                {props.searchTerm.length == 0 && <View style={styles.group3}>
                    <View style={styles.group2}>
                        <View style={styles.icon3Row}>
                            <MaterialIcons
                                name="history"
                                style={styles.icon3}
                            ></MaterialIcons>
                            <Text style={styles.name}>NAME</Text>
                        </View>
                    </View>
                    <Ionicons name="md-close" style={styles.icon4}></Ionicons>
                </View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rect: {
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(229,229,229,1)",
        flex: 1
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 32,
        height: 35,
        width: 21
    },
    group: {
        width: 314,
        height: 34,
        marginLeft: 7
    },
    textInput: {
        top: 0,
        left: 0,
        position: "absolute",
        color: "#121212",
        width: 314,
        height: 34,
        borderRadius: 3,
        backgroundColor: "rgba(239,240,247,1)"
    },
    icon2: {
        color: "rgba(0,0,0,1)",
        fontSize: 25,
        position: "absolute",
        top: 7,
        left: 281,
        height: 21,
        width: 24
    },
    textInputStack: {
        width: 314,
        height: 34
    },
    iconRow: {
        height: 35,
        flexDirection: "row",
        marginTop: 58,
        marginLeft: 20,
        marginRight: 13
    },
    recentSearches: {
        color: "#121212",
        fontSize: 20,
        marginTop: 24,
        marginLeft: 20
    },
    group3: {
        width: 341,
        height: 33,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        marginLeft: 17
    },
    group2: {
        width: 101,
        height: 33,
        flexDirection: "row"
    },
    icon3: {
        color: "rgba(128,128,128,1)",
        fontSize: 33
    },
    name: {
        color: "#121212",
        fontSize: 16,
        marginLeft: 8,
        marginTop: 7
    },
    icon3Row: {
        height: 33,
        flexDirection: "row",
        flex: 1,
        marginRight: 15
    },
    icon4: {
        color: "rgba(128,128,128,1)",
        fontSize: 27
    }
});

export default Search;
