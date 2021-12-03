import React, {useState} from 'react';
import {Platform, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DateTimeField, InputField} from '@molecules/form-fields';
import Text from '@atoms/text';
import Button from '@atoms/button';
import useTheme from "../../../hooks/useTheme";
import RNPickerSelect from "react-native-picker-select";
import SelectTimePicker from '@react-native-community/datetimepicker';
import {Ionicons} from "@expo/vector-icons";
import InputStyles from "../../../styles/input-style";
import FormField from "@organisms/forms/form";
import {primaryColor} from "../../../styles/color";

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


const NTC101 = ({
                    onSubmit = ({}) => {
                    }, loading = false
                }) => {


    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
            overflow: 'hidden',
            fontSize: 16,
            paddingVertical: 10,
            paddingHorizontal: 5,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
            color: 'gray',// to ensure the text is never behind the icon
        },
        inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderColor: 'purple',
            borderRadius: 10,
            color: 'black', // to ensure the text is never behind the icon
        },
    })
    const styles = StyleSheet.create({

        checkboxBase: {
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderWidth: 2,
            borderColor: primaryColor,
            backgroundColor: 'transparent',
        },

        checkboxChecked: {
            backgroundColor: 'blue',
        },

        appContainer: {
            flex: 1,
            alignItems: 'center',
        },

        appTitle: {
            marginVertical: '16',
            fontWeight: 'bold',
            fontSize: 24,
        },

        checkboxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        checkboxLabel: {
            marginLeft: 8,
            fontWeight: '500',
            fontSize: 12,
        },
    });
    const [sexType, setSexType] = useState([
        {value: 1, label: "Male"}
        ,
        {value: 0, label: "Female"}
        ,
    ]);
    const navigation = useNavigation();
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [is24Hours, set24Hours] = useState(false);
    const [time, setTime] = useState(new Date)
    const [timeShow, setTimeShow] = useState(false)
    const [cities, setCities] = useState([
        {id: 1, city: 'CDO', zipcode: '9000'}
    ])
    const [radio_operation_services, setRadioOperationServices] = useState<RadioOperationServices[]>([
        {id: 1, name: 'RADIOTELEGRAPHY'},
        {id: 2, name: 'RADIOTELEPHONY'},
        {id: 3, name: 'AMATEUR'},
        {id: 4, name: 'RESTRICTED RADIOTELEPHONE OPERATOR CERTIFICATE - AIRCRAFT'}
    ]);
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
    const {text} = useTheme();
    const onTimeChange = (event: any, newTime: any) => {
        const currenttime = newTime || time
        setTimeShow(Platform.OS === 'ios');
        if (Platform.OS === 'windows') {
            setTime(currenttime);
        } else {
            setTime(currenttime)
        }
    };
    const [radio_operation_servicesDefaultValue, setRadio_operation_servicesDefaultValue] = useState(radio_operation_services.length ? radio_operation_services[0].id : 0)
    const [radio_operation_exam_typesDefaultValue, setRadio_operation_exam_typesDefaultValue] = useState(radio_operation_exam_types.filter(radio_operation_exam_type => radio_operation_exam_type.radio_operator_service_id == radio_operation_servicesDefaultValue)
        .map((radio_operation_exam_type) => {
            return {label: radio_operation_exam_type.name, id: radio_operation_exam_type.id}
        })?.[0]?.["id"])
    const [radioOperationServiceSelectedValue, setRadioOperationServiceSelectedValue] = useState(radio_operation_servicesDefaultValue);
    const [radioOperationExamTypeSelectedValue, setRadioOperationExamTypeSelectedValue] = useState(radio_operation_exam_typesDefaultValue);
    const [citySelectedValue, setCitySelectedValue] = useState(cities.length ? cities[0].id : 0)
    const [radioOperationExamTypeItems, setRadioOperationExamTypeItems] = useState(radio_operation_exam_types.filter((radio_operation_exam_type: RadioOperationExamType) => {
        return radioOperationServiceSelectedValue == radio_operation_exam_type.radio_operator_service_id
    }).map((radio_operation_exam_type: RadioOperationExamType) => {
        return {label: radio_operation_exam_type.name, value: radio_operation_exam_type.id, checked: false}
    }))

    const onPressSubmit = () => {
        let error = false
        for (var i = 0; i < applicationFormValue.length; i++) {
            if (applicationFormValue[i]['error']) {
                onChangeApplicantForm(i, true, 'error' )
                break
            }else if(applicationFormValue[i]?.['required']){
                onChangeApplicantForm(i, true, 'error' )
                break
            }
        }

        onSubmit({success: !error})
    }
    const showMode = (currentMode: string) => {

        if (currentMode == 'date') {
            show ? setShow(false) : setShow(true);
        } else {

            Platform.OS !== 'ios' && timeShow ? setTimeShow(false) : setTimeShow(true)
        }

        setMode(currentMode);
    };
    const showTimepicker = () => {

        showMode('time');
    };
    const [formValue, setFormValue] = useState({
        name: {
            value: '',
            isValid: false,
            error: ''
        },
        place: {
            value: '',
            isValid: false,
            error: ''
        },

    });

    const [applicationFormValue, setApplicationFormValue] = useState([
        {label: "APPLICANT'S DETAILS ", type: "text"},
        {
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
            value: 1,
            label: "Sex",
            type: "picker",
            pickerData: sexType,
            placeholder: {label: "Sex"},
        },
        {
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
            label: "Email Address",
            type: "input",
            placeholder: "Email Address",
            value: '',
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
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

        }])
    const onCheckmarkPress = (check: any, index: number) => {
        let newArr = [...radioOperationExamTypeItems];
        newArr[index].checked = !check.checked
        setRadioOperationExamTypeItems(newArr);
    }

    const onChangeText = (key: string, value: string) => {
        switch (key) {

            default:
                return setFormValue({
                    ...formValue,
                    [key]: {
                        value: value
                    }
                });
        }
    };

    const onChangeApplicantForm = (index: number,  text: any, element: string) => {

        let newArr = [...applicationFormValue];
        if(element == 'error'){
            newArr[index]['error'] = text;
        }else{
            newArr[index]['value'] = text;
        }

        setApplicationFormValue(newArr);
    };

    return (
        <ScrollView>

            <Text>Radio Operation Service</Text>
            <RNPickerSelect
                style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                        top: 10,
                        right: 12,
                    },
                }}
                value={radioOperationServiceSelectedValue}
                onValueChange={(itemValue: any, itemIndex: number) => {
                    if (!itemValue) return
                    const radioOperationExam = radio_operation_exam_types.filter(radio_operation_exam_type => radio_operation_exam_type.radio_operator_service_id == itemValue)
                        .map((radio_operation_exam_type) => {
                            return {
                                label: radio_operation_exam_type.name,
                                value: radio_operation_exam_type.id,
                                checked: false
                            }
                        })
                    setRadioOperationServiceSelectedValue(itemValue)
                    setRadioOperationExamTypeSelectedValue(radioOperationExam[0]["value"])
                    setRadioOperationExamTypeItems(radioOperationExam)
                }}
                items={

                    radio_operation_services.map((radio_operation_service: RadioOperationServices) => {
                        return {label: radio_operation_service.name, value: radio_operation_service.id}
                    })
                }
            />


            <Text>Radio Operation Exam Type</Text>
            {radioOperationExamTypeItems.map((pick: any, key: number) => {
                return <>
                    <View style={styles.checkboxContainer}>
                        <Pressable
                            key={key}
                            style={[styles.checkboxBase, pick.checked && styles.checkboxChecked]}
                            onPress={() => onCheckmarkPress(pick, key)}>
                            {pick.checked && <Ionicons name="checkmark" size={18} color="white"/>}

                        </Pressable>
                        <Text style={styles.checkboxLabel}>{pick.label}</Text>
                    </View>
                </>
            })}

            <InputField
                label={'Name'}
                placeholder={"Name"}
                outlineStyle={InputStyles.outlineStyle}
                activeColor={text.primary}
                errorColor={text.error}
                requiredColor={text.error}
                inputStyle={InputStyles.text}
                onSubmitEditing={(event: any) => onChangeText('name', event.nativeEvent.text)}
                onChangeText={(text: string) => onChangeText('name', text)}
                value={formValue?.name?.value}

            />
            <InputField

                label={'Place'}
                placeholder="Place"
                outlineStyle={InputStyles.outlineStyle}
                activeColor={text.primary}
                errorColor={text.error}
                requiredColor={text.error}
                inputStyle={InputStyles.text}
                onSubmitEditing={(event: any) => onChangeText('name', event.nativeEvent.text)}
                onChangeText={(text: string) => onChangeText('place', text)}
                value={formValue?.place?.value}
            />

            <RNPickerSelect
                style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                        top: 10,
                        right: 12,
                    },
                }}
                value={citySelectedValue}
                onValueChange={(itemValue: any, itemIndex: number) => setCitySelectedValue(itemValue)}
                items={
                    cities.map((city: City) => {
                        return {label: city.city, value: city.id}
                    })
                }
            />


            <DateTimeField
                title={'Date of Exam: (mm/dd/yy)'}
                borderColor={'red'}
                placeholder="Date of Exam: (mm/dd/yy)"
            />


            <Text>{time.toString()}</Text>
            {Platform.OS !== 'ios' && <Button onPress={showTimepicker} style={{backgroundColor: '#2B23FF'}}>

                <Text fontSize={16} color={'white'}>
                    Time of Exam
                </Text>
            </Button>}


            {Platform.OS === 'ios' &&
            <><Text weight={'bold'}>Time of Exam</Text><SelectTimePicker
                testID="timePicker"
                mode="time"
                value={time}
                is24Hour={is24Hours}
                display="default"
                onChange={onTimeChange}/></>}

            <FormField formElements={applicationFormValue} onChange={onChangeApplicantForm}/>
        </ScrollView>
    );
};

export default NTC101;
