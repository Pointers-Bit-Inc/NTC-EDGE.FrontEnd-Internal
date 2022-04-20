import {transformText} from "../../../../utils/ntc";
import Row from "@pages/activities/application/Row";
import {FlatList,StyleSheet,Text,View} from "react-native";
import React from "react";
import {input} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import {Regular500} from "@styles/font";
import moment from "moment";

const styles=StyleSheet.create({
    subChildSeparator:{
        height:1,
        backgroundColor:input.background.default,
        marginVertical:10,
    },
    group2:{
        paddingBottom:20,
        width:"100%",
        borderRadius:5,
        alignSelf:"center",

        backgroundColor:"#fff",
        shadowColor:"rgba(0,0,0,1)",
        shadowOffset:{
            height:0,
            width:0
        },
        elevation:2,
        shadowOpacity:0.1,
        shadowRadius:2,
        padding:10
    },
    rect:{
        padding:10,
        paddingVertical:5,
        backgroundColor:"#EFF0F6"
    },
    file:{
        fontSize:fontValue(12),
        fontFamily:Regular500,
        color:"#565961",
    },
    group3:{
        paddingRight:fontValue(10),
        paddingLeft:fontValue(10),
        paddingBottom:fontValue(20)
    },
});
let title='';

function Title(props:{nextValue,index,}){

    if(!(
        (
            title===transformText(props.nextValue))||(
            title===transformText(props.index)))){

        title=transformText(
            props.nextValue||props.index);
        return <View style={styles.rect}>
            <Text style={styles.file}>{title?.toUpperCase()}</Text>
        </View>
    }
    return <></>
}

const RenderServiceMiscellaneous=(props)=>{
    let service={...props?.service}||{};
    const flatten=(obj)=>{
        for(let i=0; i<props.exclude.length; i++){
            delete obj[props.exclude[i]];
        }
       
        var result={};
        (
            function f(e,p){
                switch(typeof e){
                    case "object":
                        p=p?p+"." : "";
                        for(var i in e){
                            if(e[i]?.hasOwnProperty('year')){
                                e[i] = moment(e[i])?.format('LL')
                            }
                            f(e[i],p+i);
                        }

                        break;
                    default:
                        result[p]=e;
                        break;
                }
            })(obj);

        

        return result;
    };
    let _renderParent=(item:any)=>{
        const [keys,value]=item.item;
        var index,prevValue,nextValue;
        var findIndex=keys.split(".").reverse()?.map((key,index)=>{
            return key
        }).findIndex((name)=>{
            return !isNaN(parseInt(name))
        });
        if(findIndex!= -1){
            index=keys?.split(".")?.reverse()?.[findIndex];
            prevValue=keys?.split?.(".")?.reverse()?.[findIndex-1];
            nextValue=keys?.split?.(".")?.reverse()?.[findIndex+1]
        } else{
            prevValue=keys?.split(".")?.[keys.split(".").length-1];
            index=keys?.split(".")?.[keys.split(".").length]
            nextValue=keys?.split?.(".")?.[keys.split(".").length-2]
        }



       

        return <View style={styles.group3}>
            <Title nextValue={nextValue } index={index}/>
            <Row label={prevValue ? `${transformText(prevValue)}:` : ""} applicant={value}/>
        </View>


    };
    return (
        <FlatList
            data={Object.entries(flatten(service))}
            renderItem={_renderParent}
            keyExtractor={(item,index)=>`${index}`}
            scrollEnabled={false}
        />
    )
};

export default RenderServiceMiscellaneous