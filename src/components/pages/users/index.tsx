import React from "react";
import DataTable from "@templates/datatable/DataTable";
import {BASE_URL} from "../../../services/config";
import {USERS} from "../../../reducers/activity/initialstate";
import {setPermissionItem} from "../../../reducers/user/actions";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";

export default function UsersPage(props: any) {
    const dispatch = useDispatch()
    const permission = useSelector((state:RootStateOrAny) => state.user.role.permission);
    const permissionName = 'userPermission'
    return <DataTable
        navigation={props.navigation}
        name={USERS} addTitle={'Create User'} filter={[{
        value: "user", label: 'User'
    },]}

        editTitle={'Edit User'}
        permissionView={permission.userPermission.view}
        permissionCreate={permission.userPermission.create}
        permissionEdit={permission.userPermission.edit}
        permissionDelete={permission.userPermission.delete}
        catchError={(permission) => {
            dispatch(setPermissionItem({name: permissionName, permission}))
        }}
        editButtonTitle={'Edit User'}
        addButtonTitle={'Add User'} title={'Users'} url={BASE_URL + '/internal/users'} role={'user'}/>;
}
