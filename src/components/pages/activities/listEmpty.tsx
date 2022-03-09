import * as React from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {DATE_ADDED} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useSelector} from "react-redux";
import NoActivity from "@assets/svg/noActivity";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";
import {Regular} from "@styles/font";

export const styles = StyleSheet.create({
   noContent:{
       fontFamily: Regular,
       textAlign: "center", alignSelf: "center", color: "#A0A3BD", fontSize: fontValue(24)
   }
})
export default function Loader(refreshing, searchTerm, size) {
    const {selectedChangeStatus} = useSelector((state: RootStateOrAny) => state.activity)
    const selectedClone = selectedChangeStatus?.filter((status: string) => {
        return status != DATE_ADDED
    })
    return (
        <View style={{flex: 1,  justifyContent: 'center',alignItems: 'center'}}>
            
            {refreshing ? <ActivityIndicator/> :  selectedClone.length  ?
                                                            <>
                                                                <NoActivity> </NoActivity>
                                                                <Text style={styles.noContent}>No Content "{selectedClone.toString()}"</Text>
                                                            </>

                                                 : <><NoActivity ></NoActivity><Text style={styles.noContent}>No Content</Text></>}
        </View>
    );
}