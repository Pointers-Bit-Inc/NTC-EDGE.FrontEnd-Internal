import React from "react";
import DataTable from "@templates/datatable/DataTable";
import {BASE_URL} from "../../../services/config";
import {EMPLOYEES} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setPermissionItem} from "../../../reducers/user/actions";


export default function EmployeePage(props:any){
    const dispatch = useDispatch()
    const permission = useSelector((state:RootStateOrAny) => state.user.role.permission);
    const permissionName = 'employeePermission'
    return <DataTable
        navigation={props.navigation}
        name={EMPLOYEES}
        editTitle={'Edit Employee'}
        editButtonTitle={'Edit Employee'}
        addTitle={'Create Employee'}
        filter={[
            {
                value:"admin",
                label:'Administrator'
            },
            {
                value:"evaluator",
                label:'Evaluator'
            },
            {
                value:"director",
                label:'Director'
            },{
                value:"accountant",
                label:'Accountant'
            },{
                value:"cashier",
                label:'Cashier'
            },
        ]}
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
