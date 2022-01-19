import * as React from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {DATE_ADDED} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useSelector} from "react-redux";

export const styles = StyleSheet.create({

})
export default function Loader(refreshing, searchTerm) {
    const {selectedChangeStatus} = useSelector((state: RootStateOrAny) => state.activity)
    const selectedClone = selectedChangeStatus?.filter((status: string) => {
        return status != DATE_ADDED
    })
    return (
        <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
            {!refreshing && searchTerm.length ? <Text>No results for [{searchTerm}]</Text> : !refreshing ? <Text>No {selectedClone.toString()} Applications</Text> : <Text></Text>  }
            {refreshing && <ActivityIndicator/>}
        </View>
    );
}