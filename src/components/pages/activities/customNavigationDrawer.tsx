import React,{useEffect} from 'react';
import {StyleSheet,Text,View,} from 'react-native';

import {DrawerContentScrollView,DrawerItem,} from '@react-navigation/drawer';
import ActivitySidebar from "@assets/svg/activitySidebar";
import {Regular} from "@styles/font";
import {CommonActions,DrawerActions} from "@react-navigation/native";
import ChatIcon from "@assets/svg/chattabbar";
import MeetIcon from "@assets/svg/meettabbar";
import {
    ACTIVITIES,
    CHAT, CONFIGURATION,
    DASHBOARD, EMPLOYEES,
    GROUP,
    MEET,
    REPORT,
    ROLEANDPERMISSION, SCANQR,
    SEARCH, SETTINGS, USERS
} from "../../../reducers/activity/initialstate";
import {fontValue} from "@pages/activities/fontValue";
import {useComponentLayout} from "../../../hooks/useComponentLayout";
import {useDispatch} from "react-redux";
import {setDrawerLayout} from "../../../reducers/layout/actions";
import DashboardIcon from "@assets/svg/DashboardIcon";
import ReportIcon from "@assets/svg/ReportsIcon";
import RoleAndPermissionIcon from "@assets/svg/roleandpermission";
import GroupIcon from "@assets/svg/group";
import EmployeeIcon from "@assets/svg/employeeIcon";
import UserIcon from "@assets/svg/userIcon";
import SettingIcon from "@assets/svg/SettingIcon";
import ScanQrIcon from "@assets/svg/scanqrtabbar";

const CustomSidebarMenu=(props:any)=>{
    const dispatch=useDispatch();
    const {state}=props;
    const {routes,index}=state; //Not sure about the name of index property. Do check it out by logging the 'state' variable.
    const focusedRoute=routes[index];
    const [activitySizeComponent,onActivityLayoutComponent]=useComponentLayout();
    useEffect(()=>{
        dispatch(setDrawerLayout(activitySizeComponent))
    },[activitySizeComponent?.width]);
    return (
        <View onLayout={onActivityLayoutComponent} style={{flex: 1}}>
            <DrawerContentScrollView >
                {state.routes.map((route,i)=>{
                    const focused=i===state.index;
                    const focusedDescriptor=props.descriptors[focusedRoute.key];
                    const focusedOptions=focusedDescriptor.options;

                    const {}=focusedOptions;
                    const {
                        title,
                        drawerLabel,
                    }=props.descriptors[route.key].options;
                    const onPress=()=>{

                        //if(((route.name == CHAT && !isMobile)  || (route.name == MEET && !isMobile) || (route.name == SCANQR && !isMobile)  ) ) return

                        const event=props.navigation.emit({
                            type:'drawerItemPress',
                            target:route.key,
                            canPreventDefault:true,
                        });

                        if(!event.defaultPrevented){
                            props.navigation.dispatch({
                                ...(
                                    focused
                                    ? DrawerActions.closeDrawer()
                                    : CommonActions.navigate({name:route.name,merge:true})),
                                target:state.key,
                            });
                        }
                    };

                    let tabIcon:any=null;

                    switch(route.name){
                        case ACTIVITIES:
                            tabIcon=<ActivitySidebar focused={focused} fill={focused ? "#113196" : "#6E7191"} height={25} width={24}/>;
                            break;
                        case CHAT:
                            tabIcon=<ChatIcon focused={focused} fill={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        case MEET:
                            tabIcon=<MeetIcon fill={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        case DASHBOARD:
                            tabIcon=<DashboardIcon focused={focused} fill={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        case REPORT:
                            tabIcon=<ReportIcon focused={focused} fill={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        case ROLEANDPERMISSION:
                            tabIcon=<RoleAndPermissionIcon focused={focused} fill={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        case GROUP:
                            tabIcon=<GroupIcon focused={focused} fill={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        case EMPLOYEES:
                            tabIcon=<EmployeeIcon focused={focused} fill={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        case SCANQR:
                            tabIcon= <ScanQrIcon notification={false} width={fontValue(22)} height={fontValue(22)}
                                                 fill={focused ? "#113196" : "#6E7191"}/>
                            break;
                        case USERS:
                            tabIcon=<UserIcon focused={focused} fill={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        case CONFIGURATION:
                            tabIcon=<SettingIcon focused={focused} color={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        case SETTINGS:
                            tabIcon=<SettingIcon focused={focused} fill={focused ? "#113196" : "#6E7191"}/>;
                            break;
                        default:
                            tabIcon=null;
                    }

                    return route.name!=SEARCH&&<View>
                        <DrawerItem key={route.key} label={""} activeBackgroundColor={"transparent"} focused={focused}
                                    icon={()=>(
                                        <View style={{width:"100%"}}>
                                            <View
                                                style={[styles.itemContainer,{borderLeftColor:focused ? "#113196" : "transparent",}]}>
                                                <View style={{
                                                    alignItems:"center",
                                                    justifyContent:"center",
                                                }}>

                                                    {tabIcon}

                                                    <Text
                                                        style={[styles.label,{color:focused ? "#113196" : "#6E7191"}]}>{drawerLabel!==undefined
                                                                                                                        ? drawerLabel
                                                                                                                        : title!==undefined
                                                                                                                          ? title
                                                                                                                          : route.name}</Text>
                                                </View>

                                            </View>

                                        </View>

                                    )} style={styles.item} onPress={onPress}/>
                    </View>

                })}

            </DrawerContentScrollView>
        </View>

    );
};

const styles=StyleSheet.create({
    icon2:{
        color:"rgba(207,3,39,1)",
        fontSize:fontValue(18)
    },
    logOut:{
        color:"rgba(207,3,39,1)"
    },
    itemContainer:{
        flexDirection:"column",

        borderLeftWidth:4,

    },
    item:{
        padding:0,
        marginHorizontal:0,
        marginVertical:0,
    },
    icon:{},
    label:{
        textAlign:"center",
        fontSize:14,
        fontFamily:Regular
    }
});


export default CustomSidebarMenu;
