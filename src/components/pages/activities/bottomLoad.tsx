import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import ThreeDotsLoader from "@pages/activities/loading";

export const styles = StyleSheet.create({
    bottomLoad: {
        alignItems: 'center',
       marginVertical: 10
    }
})
export default function Loader() {
    return (
        <View style={styles.bottomLoad}>
            <ThreeDotsLoader/>
        </View>
    );
}