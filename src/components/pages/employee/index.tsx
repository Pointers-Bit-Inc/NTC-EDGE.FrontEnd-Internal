import React from "react";
import DataTable from "@templates/datatable/DataTable";
import {BASE_URL} from "../../../services/config";
import {EMPLOYEES} from "../../../reducers/activity/initialstate";


export default function EmployeePage(props:any){
    return <DataTable
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
        addButtonTitle={'Add Employee'}
        title={'Employees'}
        url={BASE_URL+'/employees'}/>;
}