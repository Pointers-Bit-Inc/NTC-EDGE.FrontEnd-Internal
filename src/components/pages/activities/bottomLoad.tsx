import * as React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import SearchLoading from "@assets/svg/searchLoading";
import ThreeDotsLoader from "@pages/activities/loading";

export const styles = StyleSheet.create({
    bottomLoad: {
        alignItems: 'center',
        marginTop: '5%'
    }
})
export default function Loader() {
    return (
        <View style={styles.bottomLoad}>
            <ThreeDotsLoader/>
        </View>
    );
}