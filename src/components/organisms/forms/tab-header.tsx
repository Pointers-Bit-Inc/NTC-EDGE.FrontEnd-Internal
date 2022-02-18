import React from 'react';
import {Platform, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {primaryColor, text} from "../../../styles/color";
import RNPickerSelect from "react-native-picker-select";
import {Ionicons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";

const Header = (props: any) => {
    const {
        tab,
        onChangeNavigation
    } = props;

    return (

            <View style={styles.tabContainer}>

                {
                    tab.map((t: any, key: number) => {

                        return <TouchableOpacity
                            key={key}
                            onPress={() => onChangeNavigation(t)}
                        >
                            <View  style={{
                                alignSelf: 'flex-start',
                                borderBottomColor: '#2f5bfa',
                                borderBottomWidth: t.isRouteActive ?  5 : 0
                            }}>
                                <Text
                                    style={{
                                        fontSize: RFValue(10),
                                        lineHeight: 50,
                                        textTransform: "uppercase",
                                        color: `${t.isRouteActive ? '#2f5bfa' : '#808196'}`,
                                        fontWeight: `${t.isRouteActive ? "bold" : "normal"}`
                                    }}
                                >
                                    {t.name} {t.isComplete ? "" : "🔴"}
                                </Text>



                            </View>
                        </TouchableOpacity>
                    })

                }

            </View>
    );
};

const styles = StyleSheet.create({


    tabContainer: {
        backgroundColor: "white",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        height: "10%",
        alignItems: "center",
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        flex: 1
    }
});
export default Header;