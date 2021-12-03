import {View} from "react-native";
import React, {useState} from "react";
import FormField from "@organisms/forms/form";
import InputStyles from 'src/styles/input-style';
import {text} from "../../../styles/color";

const Applicant = ({
                       onSubmit = ({}) => {

                       }, loading = false
                   }) => {


    const [sexType, setSexType] = useState([
        {value: 1, label: "Male"},
        {value: 0, label: "Female"},
    ]);
    const onPressSubmit = () => {
        console.log(1)
        let error = false
        for (var i = 0; i < formValue.length; i++) {
            if(formValue[i]['error'] ) {
                console.log(1)
                error = true
                break
            }else if(formValue[i]?.['required'] &&  formValue[i]?.['value']){
                console.log(2)
                error = true
                break
            }
        }

        console.log(3)
        onSubmit({success: !error})
    }
    const [formValue, setFormValue] = useState([
        {label: "APPLICANT'S DETAILS ", type: "text"},
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Last Name ",
            type: "input",
            placeholder: "Last Name",
            value: '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "First Name",
            type: "input",
            placeholder: "First Name",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Middle Name",
            type: "input",
            placeholder: "Middle Name",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Unit/Rm/House/Bldg No.",
            type: "input",
            placeholder: "Unit/Rm/House/Bldg No.",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Barangay",
            type: "input",
            placeholder: "Barangay",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Province",
            type: "input",
            placeholder: "Province",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Contact Number",
            type: "input",
            placeholder: "Contact Number",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "School Attended",
            type: "input",
            placeholder: "School Attended",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Course Taken",
            type: "input",
            placeholder: "Course Taken",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Year Graduated",
            type: "input",
            placeholder: "Year Graduated",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Date of Birth (mm/dd/yy)",
            type: "date",
            placeholder: "Date of Birth (mm/dd/yy)",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {

            value: 1,
            label: "Sex",
            type: "picker",
            pickerData: sexType,
            placeholder: "Sex",
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Nationality",
            type: "input",
            placeholder: "Nationality",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Street",
            type: "input",
            placeholder: "Street",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "City/Municipality",
            type: "input",
            placeholder: "City/Municipality",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Zip Code",
            type: "input",
            placeholder: "Zip Code",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Email Address",
            type: "input",
            placeholder: "Email Address",
            value: '',
            inputStyle: InputStyles.text,
            error: false
        },
        {
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Next",
            type: "button",
            style: {backgroundColor: '#2B23FF'},
            onPress: onPressSubmit

        }
    ]);
    const onChangeText = (index: number, text: string | number) => {

        let newArr = [...formValue];
        newArr[index].value = text;
        setFormValue(newArr);
    };


    return (
        <View>
            <FormField formElements={formValue} onChange={onChangeText}/>
        </View>
    );
};

export default Applicant
