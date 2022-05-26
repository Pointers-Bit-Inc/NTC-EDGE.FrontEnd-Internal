import React from "react";
import DataTable from "@templates/datatable/DataTable";
import {BASE_URL} from "../../../services/config";


export default function EmployeePage(props:any){
    return <DataTable title={'Employees'} url={BASE_URL+'/employees'}/>;
}