import React from "react";
import DataTable from "@templates/datatable/DataTable";
import {BASE_URL} from "../../../services/config";
import {USERS} from "../../../reducers/activity/initialstate";
export default function UsersPage(props:any){
    return <DataTable navigation={props.navigation}  name={USERS} addTitle={'Create User'}  filter={[
        {
            value: "user",
            label: 'User'
        },
    ]}
                      editTitle={'Edit User'}
                      editButtonTitle={'Edit User'}
                      addButtonTitle={'Add User'} title={'Users'} url={BASE_URL+'/users'} role={'user'}/>;
}
