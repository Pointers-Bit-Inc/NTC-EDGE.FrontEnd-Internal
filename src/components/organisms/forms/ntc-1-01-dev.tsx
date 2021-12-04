import {View} from "react-native";
import React, {useState} from "react";
import FormField from "@organisms/forms/form";

interface RadioOperationServices {
    id: number,
    name: string
}

interface RadioOperationExamType {
    id: number,
    radio_operator_service_id: number,
    code: string,
    name: string,
    note: string
}


interface City {

    id: number,
    city: string,
    zipcode: string | number
}

const NTC101dev = ({
                       onSubmit = ({}) => {

                       }, loading = false
                   }) => {

    const [radio_operation_services, setRadioOperationServices] = useState<RadioOperationServices[]>([
        {id: 1, name: 'RADIOTELEGRAPHY'},
        {id: 2, name: 'RADIOTELEPHONY'},
        {id: 3, name: 'AMATEUR'},
        {id: 4, name: 'RESTRICTED RADIOTELEPHONE OPERATOR CERTIFICATE - AIRCRAFT'}
    ]);
    const [radio_operation_servicesDefaultValue, setRadio_operation_servicesDefaultValue] = useState(radio_operation_services.length ? radio_operation_services[0].id : 0)
    const [radioOperationServiceSelectedValue, setRadioOperationServiceSelectedValue] = useState(radio_operation_servicesDefaultValue);

    const [radio_operation_exam_types, setRadioOperationExamType] = useState<RadioOperationExamType[]>([
        {
            id: 1,
            radio_operator_service_id: 1,
            code: '1RTG',
            name: '1RTG - Elements 1, 2, 5, 6 & Code (25/20 wpm)',
            note: '1RTG - Elements 1, 2, 5, 6 & Code (25/20 wpm)'
        },
        {
            id: 2,
            radio_operator_service_id: 1,
            code: '1RTG',
            name: '1RTG - Code (25/20 wpm), For removal',
            note: '1RTG - Code (25/20 wpm), For removal'
        },
        {
            id: 3,
            radio_operator_service_id: 1,
            code: '1RTG',
            name: '1RTG - Code (25/20 wpm), For 2RTG Holder',
            note: '1RTG - Code (25/20 wpm), For 2RTG Holder'
        },

        {
            id: 4,
            radio_operator_service_id: 1,
            code: '2RTG',
            name: '2RTG - Elements 1, 2, 5, 6 & Code (16 wpm)',
            note: '2RTG - Elements 1, 2, 5, 6 & Code (16 wpm)'
        },

        {
            id: 5,
            radio_operator_service_id: 1,
            code: '2RTG',
            name: '2RTG - Code (16wpm), For upgrade/removal',
            note: '2RTG - Code (16wpm), For upgrade/removal'
        },

        {
            id: 6,
            radio_operator_service_id: 1,
            code: '3RTG',
            name: '3RTG - Elements 1, 2, 5 & Code (16 wpm)',
            note: '3RTG - Elements 1, 2, 5 & Code (16 wpm)'
        },
        {
            id: 7,
            radio_operator_service_id: 1,
            code: '3RTG',
            name: '3RTG - Code (16wpm), For removal',
            note: '3RTG - Code (16wpm), For removal'
        },

        {
            id: 8,
            radio_operator_service_id: 2,
            code: '1PHN',
            name: '1PHN - Elements 1, 2, 3 & 4',
            note: '1PHN - Elements 1, 2, 3 & 4'
        },

        {
            id: 9,
            radio_operator_service_id: 2,
            code: '2PHN',
            name: '2PHN - Elements 1, 2 & 3',
            note: '2PHN - Elements 1, 2 & 3'
        },
        {
            id: 10,
            radio_operator_service_id: 2,
            code: '3PHN',
            name: '3PHN - Elements 1 & 2',
            note: '3PHN - Elements 1 & 2'
        },

        {
            id: 11,
            radio_operator_service_id: 3,
            code: 'Class A',
            name: 'Class A - Elements 8, 9, 10 & Code (5 wpm)',
            note: 'Class A - Elements 8, 9, 10 & Code (5 wpm)'
        },
        {
            id: 12,
            radio_operator_service_id: 3,
            code: 'Class A',
            name: 'Class A - Code Only',
            note: 'Class A - Code Only'
        },
        {
            id: 13,
            radio_operator_service_id: 3,
            code: 'Class B',
            name: 'Class B - Elements 5, 6 & 7',
            note: 'Class B - Elements 5, 6 & 7'
        },
        {
            id: 13,
            radio_operator_service_id: 3,
            code: 'Class B',
            name: 'Class B - Element 2 (for Registered ECE only)',
            note: 'Class B - Element 2 (for Registered ECE only)'
        },

        {
            id: 13,
            radio_operator_service_id: 3,
            code: 'Class C',
            name: 'Class C - Elements 2, 3 & 4',
            note: 'Class C - Elements 2, 3 & 4'
        },
        {
            id: 14,
            radio_operator_service_id: 3,
            code: 'Class D',
            name: 'Class D - Element 2',
            note: 'Class D - Element 2'
        },

        {
            id: 15,
            radio_operator_service_id: 4,
            code: 'RROC',
            name: 'RROC - Aircraft - Element 1',
            note: 'RROC - Aircraft - Element 1',
        },
    ]);
    const [radio_operation_exam_typesDefaultValue, setRadio_operation_exam_typesDefaultValue] = useState(radio_operation_exam_types.filter(radio_operation_exam_type => radio_operation_exam_type.radio_operator_service_id == radio_operation_servicesDefaultValue)
        .map((radio_operation_exam_type) => {
            return {label: radio_operation_exam_type.name, id: radio_operation_exam_type.id}
        })?.[0]?.["id"])
    const [radioOperationExamTypeSelectedValue, setRadioOperationExamTypeSelectedValue] = useState(radio_operation_exam_typesDefaultValue);
    const [radioOperationExamTypeItems, setRadioOperationExamTypeItems] = useState(radio_operation_exam_types.filter((radio_operation_exam_type : RadioOperationExamType ) => {
        return radioOperationServiceSelectedValue == radio_operation_exam_type.radio_operator_service_id &&  {label:radio_operation_exam_type.name,  value: radio_operation_exam_type.id}
    }).map((radio_operation_exam_type: RadioOperationExamType) => {
        return   { label: radio_operation_exam_type.name , value: radio_operation_exam_type.id, checked: false }
    }))

    const [radioOperationServiceItem, setRadioOperationServiceItem] = useState(radio_operation_services.map((radio_operation_service: RadioOperationServices) => {
        return {label: radio_operation_service.name, value: radio_operation_service.id}
    }))
    const [checked, onChange] = useState(false);

    function onCheckmarkPress() {
        alert()
        onChange(!checked);
    }
    const [formValue, setFormValue] = useState([
        {
            value: radioOperationServiceSelectedValue,
            label: "Radio Operation Service",
            type: "picker",
            pickerData: radioOperationServiceItem ,
            placeholder: {label: "Radio Operation Service"},
        },
        {
            value: radioOperationExamTypeSelectedValue,
            label: "Radio Operation Exam Type",
            type: "checkboxes",
            pickerData: radioOperationExamTypeItems,
            checkmarkPress: onCheckmarkPress
        },
    ]);
    const onChangeText = (index: number, text: any) => {

        let newArr = [...formValue];
        switch (newArr[index].label) {
            case "Radio Operation Service":
                if(text){
                    let filter_radio_operation_exam_types = radio_operation_exam_types.filter((radio_operation_exam_type : RadioOperationExamType ) => {
                        return text == radio_operation_exam_type.radio_operator_service_id
                    }).map((radio_operation_exam_type: RadioOperationExamType) => {
                        return   { label: radio_operation_exam_type?.name , value: radio_operation_exam_type?.id }
                    })

                    newArr[index+1].value = filter_radio_operation_exam_types?.[0]?.["value"];
                    newArr[index+1].pickerData = filter_radio_operation_exam_types;
                }



                break;
        }
        newArr[index].value = text
        setFormValue(newArr);

        console.log(index)

    };


    return (
        <View>
            <FormField formElements={formValue} onChange={onChangeText}/>

        </View>
    );
};

export default NTC101dev
