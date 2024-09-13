import * as React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {DATE_ADDED} from "../../../reducers/activity/initialstate";
import {RootStateOrAny,useSelector} from "react-redux";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import {Regular} from "@styles/font";
import absoluteFill = StyleSheet.absoluteFill;
import Skeleton from "@atoms/skeleton";
import {useMemo} from "react";

export const styles=StyleSheet.create({
    noContent:{
        fontFamily:Regular,
        textAlign:"center",alignSelf:"center",color:"#A0A3BD",fontSize:fontValue(24)
    }
});

function Placeholder(props: { renderItem: () => JSX.Element, keyExtractor: (item) => any }) {
    const RNPlaceholder = useMemo(()=>{
        return <View style={{justifyContent: "flex-end", width: "100%"}}><FlatList
            data={[1,2,3,4,5,6]}
            renderItem={props.renderItem}
            keyExtractor={props.keyExtractor}
        /></View>
    }, [])
    return <>{
        RNPlaceholder
    }</>;
}

const Loader = (refreshing,searchTerm,size) => {
    const selectedChangeStatus=useSelector((state:RootStateOrAny)=>state.activity?.selectedChangeStatus);
    const selectedClone=selectedChangeStatus?.filter((status:string)=>{
        return status!=DATE_ADDED
    });
    const NoActivityMemo = () => {
        return <><NoActivity/><Text style={styles.noContent}>No Content</Text></>;
    }

    return (

        <View  style={[{justifyContent: "center", alignItems: "center",   width: "100%"  }]}>

            {refreshing ? <Placeholder renderItem={() => <Skeleton/>} keyExtractor={item => item}/>  : selectedClone.length && !( size || size?.length) ? <><NoActivity></NoActivity><Text
                    style={styles.noContent}>No Content "{selectedClone.toString()}"</Text></>

                : (size || size?.length) ? <></> : <NoActivityMemo/>}
        </View>

    );
}
export default Loader
