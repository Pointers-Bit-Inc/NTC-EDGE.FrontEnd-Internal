import * as React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import SearchLoading from "@assets/svg/searchLoading";

export const styles = StyleSheet.create({
    bottomLoad: {
        alignItems: 'center',
        marginTop: '5%'
    }
})
export default function Loader() {
    return (
        <View style={styles.bottomLoad}>
           <SearchLoading/>
        </View>
    );
}