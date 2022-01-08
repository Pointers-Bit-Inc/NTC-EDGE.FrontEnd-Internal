import React from 'react';
import {
    View,
    StyleSheet,
    Text, TouchableOpacity,
} from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import LogoutIcon from "@assets/svg/logout";
import MoreDrawerIcon from "@assets/svg/moreActivityDrawer";

const CustomSidebarMenu = (props:any) => {
    const toggleDrawer = () => {
        props.navigation.toggleDrawer();
    };


    return (
        <>
            <View>
                <TouchableOpacity onPress={toggleDrawer}>
                    <MoreDrawerIcon style={styles.icon}></MoreDrawerIcon>
                </TouchableOpacity>


            </View>
            <DrawerContentScrollView >
                <DrawerItemList     {...props} />
                <TouchableOpacity onPress={props.onLogout}>
                    <View style={styles.itemContainer}>
                        <View >
                            <LogoutIcon />
                        </View>


                        <Text style={styles.logOut}>Log out</Text>
                    </View>
                </TouchableOpacity>

            </DrawerContentScrollView>
        </>

    );
};

const styles = StyleSheet.create({
    icon2: {
        color: "rgba(207,3,39,1)",
        fontSize: 18
    },
    logOut: {
        color: "rgba(207,3,39,1)"
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 100,
        height: 18,
        marginLeft: 28,
        marginTop: 20
    },
    icon: {
        color: "rgba(0,0,0,1)",
        fontSize: 22,
        height: 25,
        marginTop: 54,
        marginLeft: 28
    }
});


export default CustomSidebarMenu;