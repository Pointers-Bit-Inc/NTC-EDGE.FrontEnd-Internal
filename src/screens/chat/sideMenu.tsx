import React from "react";
import {SafeAreaView,Text,View,StyleSheet,TouchableOpacity} from "react-native";
import CloseIcon from "@assets/svg/close";
import {Bold} from "@styles/font";

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        top: 65,
        backgroundColor: "#fff"
    },
    
    container: {
        margin: 12,
        flex: 1
    },
    header:{
        justifyContent: "space-around",
        flexDirection: "row",
        borderBottomWidth: 2,
        borderBottomColor: "#efefef",
        paddingVertical: 25
    },
    headerText: {
        fontSize: 14,
        color: "#1F2022",
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: Bold
    }
});

export default class SideMenu extends React.Component {
    state = {
        toggle_option_one: false
    };


    render() {
        return (
            <SafeAreaView style={styles.safeAreaView}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={()=> this.props.close()}>
                        <CloseIcon/>
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Meeting Participant</Text>
                    <View/>
                </View>

            </SafeAreaView>
        );
    }
}

