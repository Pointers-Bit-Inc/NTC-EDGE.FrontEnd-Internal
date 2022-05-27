import React from "react";
import DataTable from "@templates/datatable/DataTable";
import {BASE_URL} from "../../../services/config";
export default function UsersPage(props:any){
    return <DataTable addTitle={'Create User'}  filter={[
        {
            value: "user",
            label: 'User'
        },
    ]} addButtonTitle={'Add User'} title={'Users'} url={BASE_URL+'/users'} role={'user'}/>;
}