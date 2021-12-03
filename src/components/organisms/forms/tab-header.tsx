import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import {primaryColor} from "../../../styles/color";

const Header = (props:any)=> {
    const {
       tab
    } = props;

    return (
        <View style={styles.containerHeader}>
            <View style={styles.textContainer}>
                <Text style={styles.textWhite}>Attendant's Detail</Text>
            </View>
            <View style={styles.tabContainer}>

                {
                    tab.map((t:any) =>{
                        return <View>
                            <Text
                                style={{

                                    fontSize: 10,
                                    textTransform: "uppercase",
                                    color: `${t.tintColor}`,
                                    fontWeight: `${t.isRouteActive ? "bold" : "normal"}`
                                }}
                            >
                                {t.name}
                            </Text>
                            <View style={{
                                height: 1,
                                marginBottom: -30,
                                borderWidth: 1,
                                borderColor: primaryColor,
                                borderStyle: 'solid'
                            }}></View>
                        </View>
                    })

                }

            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    containerHeader: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems:"flex-start",

    },
    textContainer: {
        marginTop: 20,
        marginLeft: 10
    },
    textWhite: {
        color: 'black',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        flex: 1
    }
});
export default Header;