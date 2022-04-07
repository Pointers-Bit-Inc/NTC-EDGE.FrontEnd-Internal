import React , {useEffect} from 'react';
import {StyleSheet , Text , View ,} from 'react-native';

import {DrawerContentScrollView , DrawerItem ,} from '@react-navigation/drawer';
import {RFValue} from "react-native-responsive-fontsize";
import ActivitySidebar from "@assets/svg/activitySidebar";
import {Regular} from "@styles/font";
import {CommonActions , DrawerActions} from "@react-navigation/native";
import ChatIcon from "@assets/svg/chattabbar";
import MeetIcon from "@assets/svg/meettabbar";
import {ACTIVITIES , CHAT , MEET , SCANQR , SEARCH} from "../../../reducers/activity/initialstate";
import {fontValue} from "@pages/activities/fontValue";
import {disabledColor} from "@styles/color";
import {isMobile} from "@pages/activities/isMobile";

const CustomSidebarMenu = (props: any) => {

    const { state } = props;
    const { routes , index } = state; //Not sure about the name of index property. Do check it out by logging the 'state' variable.
    const focusedRoute = routes[index];

    return (
        <>
            <DrawerContentScrollView>
                { state.routes.map((route , i) => {
                    const focused = i === state.index;
                    const focusedDescriptor = props.descriptors[focusedRoute.key];
                    const focusedOptions = focusedDescriptor.options;

                    const {
                    } = focusedOptions;
                    const {
                        title,
                        drawerLabel,
                    } = props.descriptors[route.key].options;
                    const onPress = () => {

                        //if(((route.name == CHAT && !isMobile)  || (route.name == MEET && !isMobile) || (route.name == SCANQR && !isMobile)  ) ) return

                        const event = props.navigation.emit({
                            type: 'drawerItemPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!event.defaultPrevented) {
                            props.navigation.dispatch({
                                ...(focused
                                    ? DrawerActions.closeDrawer()
                                    : CommonActions.navigate({ name: route.name, merge: true })),
                                target: state.key,
                            });
                        }
                    };




                    return route.name != SEARCH && <View>
                        <DrawerItem key={route.key} label={""} activeBackgroundColor={"transparent"} focused={focused} label={ '' } icon={ () => (
                            <View style={{ width: "100%"}}>
                                <View style={ [styles.itemContainer , { borderLeftColor : focused ? "#113196" : "transparent" , }] }>
                                    <View style={{alignItems : "center" ,
                                        justifyContent : "center" ,}} >

                                        {route.name == ACTIVITIES ?
                                            <ActivitySidebar fill={focused? "#113196" : "#6E7191"}  height={ 25 } width={ 24 }/>
                                        : route.name == CHAT  ?  <ChatIcon focused={focused} fill={focused ? "#113196" : "#6E7191"} /> : route.name = MEET ? <MeetIcon fill={focused ? "#113196" : "#6E7191"}/> : <></> }

                                        <Text style={ [styles.label, {color: focused ? "#113196" : "#6E7191"  }] }>{  drawerLabel !== undefined
                                                                        ? drawerLabel
                                                                        : title !== undefined
                                                                          ? title
                                                                          : route.name }</Text>
                                    </View>

                                </View>

                            </View>

                        ) } style={ styles.item }   onPress={onPress}/>
                    </View>

                })}

            </DrawerContentScrollView>
        </>

    );
};

const styles = StyleSheet.create({
    icon2 : {
        color : "rgba(207,3,39,1)" ,
        fontSize : fontValue(18)
    } ,
    logOut : {
        color : "rgba(207,3,39,1)"
    } ,
    itemContainer : {
        flexDirection : "column" ,

        borderLeftWidth : 4 ,

    } ,
    item : {
        padding : 0 ,
        marginHorizontal : 0 ,
        marginVertical : 0 ,
    } ,
    icon : {} ,
    label : {
        textAlign: "center",
        fontSize : 14 ,
        fontFamily : Regular
    }
});


export default CustomSidebarMenu;