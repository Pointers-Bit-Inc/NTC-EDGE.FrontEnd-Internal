import * as React from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {DATE_ADDED} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useSelector} from "react-redux";

export const styles = StyleSheet.create({

})
export default function Loader(refreshing, searchTerm, size) {
    const {selectedChangeStatus} = useSelector((state: RootStateOrAny) => state.activity)
    const selectedClone = selectedChangeStatus?.filter((status: string) => {
        return status != DATE_ADDED
    })
     console.log("total:", size)
    return (
        <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
            {refreshing == false && size === 0 && searchTerm.length  ? <Text>No results for "{searchTerm}"</Text> : !refreshing && !size && selectedClone.length  ? <Text>No {selectedClone.toString()} Applications</Text> : <Text></Text>  }
            {refreshing && <ActivityIndicator/>}
        </View>
    );
}