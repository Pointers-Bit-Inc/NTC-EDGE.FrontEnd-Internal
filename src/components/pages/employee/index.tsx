import React from "react";
import DataTable from "@templates/datatable/DataTable";
import {BASE_URL} from "../../../services/config";


export default function EmployeePage(props:any){
    return <DataTable addTitle={'Create Employee'} filter={[
        {
            value: "admin",
            text: 'Administrator'
        },
        {
            value: "evaluator",
            text: 'Evaluator'
        },
        {
            value: "director",
            text: 'Director'
        },{
            value: "accountant",
            text: 'Accountant'
        },{
            value: "cashier",
            text: 'Cashier'
        },
    ]} addButtonTitle={'Add Employee'} title={'Employees'} url={BASE_URL+'/employees'}/>;
}