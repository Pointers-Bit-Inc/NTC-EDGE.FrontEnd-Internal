import * as React from 'react';
import {ActivityIndicator, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {DATE_ADDED} from "../../../reducers/activity/initialstate";
import {RootStateOrAny,useSelector} from "react-redux";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import {Regular} from "@styles/font";
import absoluteFill = StyleSheet.absoluteFill;

export const styles=StyleSheet.create({
    noContent:{
        fontFamily:Regular,
        textAlign:"center",alignSelf:"center",color:"#A0A3BD",fontSize:fontValue(24)
    }
});
export default function Loader(refreshing,searchTerm,size){
    const selectedChangeStatus=useSelector((state:RootStateOrAny)=>state.activity?.selectedChangeStatus);
    const selectedClone=selectedChangeStatus?.filter((status:string)=>{
        return status!=DATE_ADDED
    });
    const dimension = useWindowDimensions()
    return (
        <View  style={{justifyContent: "center", alignItems: "center", height: "100%", width: "100%"  }}>
            {refreshing  ? <View/> : selectedClone.length && !( size || size?.length) ? <><NoActivity></NoActivity><Text
                    style={styles.noContent}>No Content "{selectedClone.toString()}"</Text></>

                : size || size?.length ? <></> : <><NoActivity></NoActivity><Text style={styles.noContent}>No Content</Text></>}
        </View>

    );
}