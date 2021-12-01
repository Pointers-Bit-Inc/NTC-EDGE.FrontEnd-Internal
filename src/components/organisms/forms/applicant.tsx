
import {View} from "react-native";
import React from "react";
import FormField from "@organisms/forms/form";

const Applicant = ({ onSubmit = ({}) => {}, loading = false }) => {
    const SexType = [
        { value: 1, label: "Male" }
        ,
        { value: 0, label: "Female" }
        ,
    ];

    const formElements = [
        { label: "APPLICANT'S DETAILS ", type: "text"},
        { label: "Last Name ", type: "input", placeholder:  "Last Name " },
        { label: "First Name", type: "input", placeholder:  "First Name" },
        { label: "Middle Name", type: "input", placeholder:  "Middle Name" },
        { label: "Unit/Rm/House/Bldg No.", type: "input", placeholder:  "Unit/Rm/House/Bldg No." },
        { label: "Barangay", type: "input", placeholder:  "Barangay" },
        { label: "Province", type: "input", placeholder:  "Province" },
        { label: "Contact Number", type: "input", placeholder:  "Contact Number" },
        { label: "School Attended", type: "input", placeholder:  "School Attended" },
        { label: "Course Taken", type: "input", placeholder:  "Course Taken" },
        { label: "Year Graduated", type: "input", placeholder:  "Year Graduated" },
        { label: "Date of Birth (mm/dd/yy)", type: "date", placeholder:  "Date of Birth (mm/dd/yy)" },
        { label: "Sex", type: "picker", pickerData: SexType , placeholder:  "Sex"},
        { label: "Nationality", type: "input", placeholder:  "Nationality" },
        { label: "Street", type: "input", placeholder:  "Street" },
        { label: "City/Municipality", type: "input", placeholder:  "City/Municipality" },
        { label: "Zip Code", type: "input", placeholder:  "Zip Code" },
        { label: "Email Address", type: "input", placeholder:  "Email Address" },
        { label: "Next", type: "button",  style: { backgroundColor: '#2B23FF' },  onPress: onSubmit},
    ];
    return (
        <View >
            <FormField formElements={formElements} />
        </View>
    );
};

export default Applicant
