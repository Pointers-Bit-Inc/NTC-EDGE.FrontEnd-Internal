import React, {memo, useRef, useState} from "react";
import {Animated, Text, TouchableWithoutFeedback, View} from "react-native";
import {styles} from "@pages/activities/styles";
import ChevronDownIcon from "@assets/svg/chevron-down";
import Collapsible from "react-native-collapsible";
import {formatDate, readableToHuman} from "@pages/activities/script";
import moment from "moment";
import {useAlert} from "../../../hooks/useAlert";
import ChevronUpIcon from "@assets/svg/chevron-up";
import {fontValue} from "@pages/activities/fontValue";

const ApplicationList=(props:{onPress:()=>void,item:any,numbers:{parentIndex:number,child:number[]}[],index:number,element:(activity:any,i:number)=>JSX.Element})=>{
    const chevronValue=useRef(new Animated.Value(0)).current;
    const [isOpen,setIsOpen]=useState(true);
    const {springValue,_springHide}=useAlert(true,()=>{
    });
    const chevronAnimate=()=>{
        Animated.timing(
            chevronValue,
            {
                useNativeDriver:true,
                toValue:isOpen ? 1 : 0,
                duration:200,
            }
        ).start((o)=>{
            if(o?.finished){
                setIsOpen(open=>!open)
            }
        });
    };



    return <View style={[styles.group26,]}>
        <TouchableWithoutFeedback onPress={()=>{
            props.onPress();
            chevronAnimate()
        }

        }>
            <View style={styles.group25}>

                <View style={styles.rect34}>

                    <View>

                        <View style={styles.date}>
                            <Text
                                style={styles.dateText}>{`${readableToHuman(props.item.date)} • ${moment(props.item.date).format('MMM DD, yyyy')}`} </Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                        <View style={{flex:0.1,alignItems:"center"}}>

                            <TouchableWithoutFeedback onPress={()=>setIsOpen(open=>!open)}>
                                <View>

                                    {isOpen ?
                                     <ChevronUpIcon width={fontValue(24)} height={fontValue(24)} color={"#000"}/> :
                                     <ChevronDownIcon width={fontValue(24)} height={fontValue(24)} color={"#000"}/>}


                                </View>
                            </TouchableWithoutFeedback>

                        </View>
                        {/*<View style={{alignItems: "center"}}>
                            <TouchableOpacity>
                                <DotVertical  width={fontValue(4)} height={fontValue(18)}  />
                            </TouchableOpacity>

                        </View>*/}


                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>

        <Collapsible collapsed={!isOpen}>
            {props.item.activity.sort(function(a, b) {
                var c = new Date(a.updatedAt);
                var d = new Date(b.updatedAt);
                return d.getTime()-c.getTime();
            }).map(props.element)}
            <View style={{height:30,backgroundColor:"white"}}/>
        </Collapsible>

    </View>;
};


export default memo(ApplicationList);
