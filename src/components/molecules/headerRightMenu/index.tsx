import {Menu,MenuOption,MenuOptions,MenuTrigger} from "react-native-popup-menu";
import ProfileImage from "@atoms/image/profile";
import {Text,View} from "react-native";
import * as React from "react";

function ProfileMenu(props:{onClose:()=>void,onSelect:(value)=>void,user:any}){
    return <Menu onClose={props.onClose} onSelect={props.onSelect}>

        <MenuTrigger>

            <ProfileImage
                style={{
                    borderRadius:26,
                }}
                size={28}
                image={props.user?.profilePicture?.small}
                name={`${props.user?.firstName} ${props.user?.lastName}`}
            />


        </MenuTrigger>

        <MenuOptions optionsContainerStyle={{
            marginTop:30,
            shadowColor:"rgba(0,0,0,1)",
            paddingVertical:10,
            borderRadius:8,
            shadowOffset:{
                width:0,
                height:0
            },
            elevation:45,
            shadowOpacity:0.1,
            shadowRadius:15,
        }}>
            <MenuOption value={"editProfile"}>
                <View>
                    <Text>{"Edit Profile"}</Text>
                </View>
            </MenuOption>
            <MenuOption value={"logout"}>
                <View>
                    <Text>{"Logout"}</Text>
                </View>
            </MenuOption>
        </MenuOptions>

    </Menu>;
}

export default  ProfileMenu