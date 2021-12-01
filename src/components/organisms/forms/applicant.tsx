
import {View} from "react-native";
import React from "react";
import FormField from "@organisms/forms/form";

const Applicant = () => {
    const pickerData = [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" }
    ];

    const formElements = [
        { label: "Full Name", type: "text", placeholder: "John Doe" },
        { label: "Type", type: "picker", pickerData: pickerData },
        { label: "Address", type: "textarea" }
    ];
    return (
        <View >
            <FormField formElements={formElements} />
        </View>
    );
};

export default Applicant
