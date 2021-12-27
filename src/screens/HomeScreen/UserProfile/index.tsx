import React from 'react';
import UserProfile from "@pages/user-profile";
const UserProfileScreen = ({navigation}: any) =>{

    return <UserProfile toggleDrawer={() => navigation.toggleDrawer()} />
}

export default UserProfileScreen