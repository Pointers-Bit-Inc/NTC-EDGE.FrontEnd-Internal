import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {primaryColor} from "../../../styles/color";

const Header = (props: any) => {
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
                    tab.map((t: any, key: number) => {

                        return <View key={key} style={{
                            alignSelf: 'flex-start',
                            borderBottomColor: '#2f5bfa',
                            borderBottomWidth: t.isRouteActive ?  5 : 0
                        }}>
                            <Text
                                style={{
                                    fontSize: 10,
                                    lineHeight: 50,
                                    textTransform: "uppercase",
                                    color: `${t.isRouteActive ? '#2f5bfa' : '#000'}`,
                                    fontWeight: `${t.isRouteActive ? "bold" : "normal"}`
                                }}
                            >
                                {t.name} {t.isComplete ? "" : "🔴"}
                            </Text>



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
        alignItems: "flex-start",

    },
    textContainer: {
        marginTop: 20,
        marginLeft: 10
    },
    textWhite: {
        color: '#565961',
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
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        flex: 1
    }
});
export default Header;