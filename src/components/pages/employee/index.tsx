import React, {useEffect, useMemo, useState} from "react";
import DataTable from "@templates/datatable/DataTable";
import {BASE_URL} from "../../../services/config";
import {EMPLOYEES} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setPermissionItem} from "../../../reducers/user/actions";
import axios from "axios";
import {setRoles, setRolesSelect} from "../../../reducers/role/actions";


export default function EmployeePage(props:any){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const sessionToken = useSelector((state:RootStateOrAny) => state.user.sessionToken);
    const permission = useSelector((state:RootStateOrAny) => state.user.role.permission);
    const roles_select = useSelector((state:RootStateOrAny) => state.role.roles_select);
    const permissionName = 'employeePermission'
    useEffect(()=>{
        setLoading(true)
        axios.get(BASE_URL + "/roles/select?page=" + page, {
            headers: {
                Authorization: "Bearer ".concat(sessionToken)
            }
        }).then((response) => {
            dispatch(setRolesSelect(response.data.filter(a => a.value != "user" )))
            setLoading(false);
        }).catch((response) => {

            console.log(response.response)
        })
    }, [roles_select?.length == 0])
    const rolesSelectMemo = useMemo(() =>{
        return roles_select
    }, [roles_select])

    return <DataTable
        navigation={props.navigation}
        name={EMPLOYEES}
        editTitle={'Edit Employee'}
        editButtonTitle={'Edit Employee'}
        addTitle={'Create Employee'}
        filter={rolesSelectMemo}
        permissionView={permission.employeePermission.view}
        permissionCreate={permission.employeePermission.create}
        permissionEdit={permission.employeePermission.edit}
        permissionDelete={permission.employeePermission.delete}
        addButtonTitle={'Add Employee'}
        title={'Employees'}
        catchError={(permission)=>{
            dispatch(setPermissionItem({name: permissionName, permission}))
        }
        }
        url={BASE_URL+'/employees'}/>;
}
