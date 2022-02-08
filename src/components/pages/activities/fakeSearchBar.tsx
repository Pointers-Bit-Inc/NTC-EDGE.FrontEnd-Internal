import {Text, TouchableOpacity, View} from "react-native";
import {styles} from "@pages/activities/styles";
import SearchIcon from "@assets/svg/search";
import React from "react";

 export const FakeSearchBar = (props: { onPress: () => void, searchVisible: boolean }) => {
    return <View style={styles.searcg}>
        <View style={[styles.rect26, {height: undefined, paddingHorizontal: 20, paddingVertical: 10}]}>
            <TouchableOpacity onPress={props.onPress}>
                {!props.searchVisible &&
                <View style={[styles.rect7, {marginTop: 0, width: "100%", marginLeft: 0}]}>
                    <View style={styles.iconRow}>

                        <SearchIcon style={styles.icon}></SearchIcon>

                        <View

                            style={styles.textInput}

                        >
                            <Text style={{color: "rgba(128,128,128,1)",}}>Search</Text>
                        </View>

                    </View>
                </View>
                }
            </TouchableOpacity>
        </View>
    </View>;
}