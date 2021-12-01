
import {View} from "react-native";
import React from "react";
import FormField from "@organisms/forms/form";

const Applicant = () => {
    const SexType = [
        { value: 1, label: "Male" }
        ,
        { value: 0, label: "Female" }
        ,
    ];

    const formElements = [
        { label: "Last Name ", type: "text", placeholder:  "Last Name " },
        { label: "First Name", type: "text", placeholder:  "First Name" },
        { label: "Middle Name", type: "text", placeholder:  "Middle Name" },
        { label: "Unit/Rm/House/Bldg No.", type: "text", placeholder:  "Unit/Rm/House/Bldg No." },
        { label: "Barangay", type: "text", placeholder:  "Barangay" },
        { label: "Province", type: "text", placeholder:  "Province" },
        { label: "Contact Number", type: "text", placeholder:  "Contact Number" },
        { label: "School Attended", type: "text", placeholder:  "School Attended" },
        { label: "Course Taken", type: "text", placeholder:  "Course Taken" },
        { label: "Year Graduated", type: "text", placeholder:  "Year Graduated" },
        { label: "Date of Birth (mm/dd/yy)", type: "date", placeholder:  "Date of Birth (mm/dd/yy)" },
        { label: "Sex", type: "picker", pickerData: SexType , placeholder:  "Sex"},
        { label: "Nationality", type: "text", placeholder:  "Nationality" },
        { label: "Street", type: "text", placeholder:  "Street" },
        { label: "City/Municipality", type: "text", placeholder:  "City/Municipality" },
        { label: "Zip Code", type: "text", placeholder:  "Zip Code" },
        { label: "Email Address", type: "text", placeholder:  "Email Address" },
    ];
    return (
        <View >
            <FormField formElements={formElements} />
        </View>
    );
};

export default Applicant
