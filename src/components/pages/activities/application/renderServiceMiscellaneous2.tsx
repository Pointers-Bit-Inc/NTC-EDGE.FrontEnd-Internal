import {transformText} from "../../../../utils/ntc";
import Row from "@pages/activities/application/Row";
import {FlatList,StyleSheet,Text,View} from "react-native";
import React from "react";
import {input} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import {Regular500} from "@styles/font";
import moment from "moment";
import _ from "lodash";
import hairlineWidth=StyleSheet.hairlineWidth;

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
        marginTop:10,
        padding:10,
        paddingVertical:5,
        backgroundColor:"#EFF0F6",

    },
    file:{
        fontSize:fontValue(12),
        fontFamily:Regular500,
        color:"#565961",
    },
    group3:{
        paddingRight:fontValue(10),
        paddingLeft:fontValue(10),
        paddingVertical:fontValue(20)
    },
});
let title='';
let no=null;

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

function Separator({index}){
    if(no!=index&&index!=undefined){
        no=index;
        return no!=0 ? <View style={{marginTop:10,borderTopWidth: 1,borderColor:"#EFF0F6"}}/> : <></>;
    }
    return <></>

}

const RenderServiceMiscellaneous=(props)=>{
    let service={...props.service}||{};
    const flatten=(obj)=>{
        var result={};
         (
            async function f(e,p=undefined){
                switch(typeof e){
                    case "object":
                        if(!!Object.values(e).join("")){
                            p=p ? p+"." : "";
                            _.forIn(e, async function(value,i){
                                if(e[i]?.hasOwnProperty('year')){
                                    e[i]=moment(e[i])?.format('LL')
                                }
                                await f(e[i],p+i);
                            });
                        }
                        break;
                    default:
                        let date = new RegExp(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)
                        result[p]= date.test(e) == true && Date.parse(e)>0 ? moment(e)?.format('LL') : e ;
                        break;
                }
            })(obj);
         
        return result;
    };
    let _renderParent=(item:any)=>{
        const [keys,value]=item.item;
        var index,prevValue,nextValue,findIndex;
        findIndex=keys.split(".").reverse()?.map((key,index)=>{
            return key
        }).findIndex((name)=>{
            return !isNaN(parseInt(name))
        });

        if(findIndex!= -1){
            index=keys?.split?.(".")?.reverse()?.[findIndex];
            prevValue=keys?.split?.(".")?.reverse()?.[findIndex-1];
            nextValue=keys?.split?.(".")?.reverse()?.[findIndex+1];
        } else{
            prevValue=keys?.split?.(".")?.[keys.split(".")?.length-1];
            index=keys?.split?.(".")?.[keys.split(".")?.length];
            nextValue=keys?.split?.(".")?.[keys.split(".")?.length-2]||keys?.split?.(".")?.[0];
        }
        return (<View>
            <Title nextValue={nextValue} index={index}/>
            <Separator index={index}/>
            <Row label={prevValue ? `${transformText(prevValue)}:` : ""} applicant={value}/>
        </View>)


    };

    

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.group3}
            data={Object.entries(flatten(_.omit(service,props.exclude)))}
            renderItem={_renderParent}
            keyExtractor={(item,index)=>`${index}`}
            scrollEnabled={false}
        />
    )
};

export default RenderServiceMiscellaneous