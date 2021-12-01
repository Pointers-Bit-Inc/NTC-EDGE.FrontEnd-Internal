import React, {useState} from 'react';
import {View, Picker, SafeAreaView, TextInput, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  InputField,
  DateTimeField,
  DropdownField
} from '@molecules/form-fields';
import Text from '@atoms/text';
import Button from '@atoms/button';
import useTheme from "../../../hooks/useTheme";
import RNPickerSelect from "react-native-picker-select";
import SelectTimePicker from '@react-native-community/datetimepicker';
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


interface User {
    id: number,
    first_name: string,
    last_name: string,
}

interface City {

    id: number,
    city: string,
    zipcode: string | number
}


const NTC101 = ({ onSubmit = ({}) => {}, loading = false }) => {
    const styles = StyleSheet.create({
        container: {
            width: '100%'
        },
        button: {},

    });

  const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [is24Hours, set24Hours] = useState(false);
    const [time, setTime] = useState(new Date)
    const [timeShow, setTimeShow] = useState(false)
    const [users, setUsers] = useState([

        {id: 1, first_name: 'first', last_name: 'last'}
    ])
    const [cities, setCities] = useState([
        {id: 1, city: 'CDO', zipcode: '9000'}
    ])
    const [radio_operation_services , setRadioOperationServices ] = useState<RadioOperationServices[]>([
        {id: 1, name: 'RADIOTELEGRAPHY'},
        {id: 2, name: 'RADIOTELEPHONY'},
        {id: 3, name: 'AMATEUR'},
        {id: 4, name: 'RESTRICTED RADIOTELEPHONE OPERATOR CERTIFICATE - AIRCRAFT'}
    ]);
    const [radio_operation_exam_types , setRadioOperationExamType  ] = useState<RadioOperationExamType[]>([
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
    const { text, outline, button, roundness, thickness } = useTheme();
    const [userSelectedValue, setUserSelectedValue] = useState(0);
    const onTimeChange = (event: any, newTime: any) => {
        const currenttime = newTime || time
        setTimeShow(Platform.OS === 'ios');
        if (Platform.OS === 'windows') {
            setTime(currenttime);
        }else{
            setTime(currenttime)
        }
    };
    const [radio_operation_servicesDefaultValue, setRadio_operation_servicesDefaultValue] = useState(radio_operation_services.length ? radio_operation_services[0].id  : 0)
    const [radio_operation_exam_typesDefaultValue, setRadio_operation_exam_typesDefaultValue] = useState(radio_operation_exam_types.filter(radio_operation_exam_type => radio_operation_exam_type.radio_operator_service_id == radio_operation_servicesDefaultValue  )
        .map((radio_operation_exam_type) => {
            return {label: radio_operation_exam_type.name, id: radio_operation_exam_type.id}
        })[0]["id"])
    const [radioOperationServiceSelectedValue, setRadioOperationServiceSelectedValue] = useState(radio_operation_servicesDefaultValue );
    const [radioOperationExamTypeSelectedValue, setRadioOperationExamTypeSelectedValue] = useState(radio_operation_exam_typesDefaultValue);
    const [citySelectedValue, setCitySelectedValue] = useState(cities.length ? cities[0].id : 0)
    const radioOperationExamTypeItems = radio_operation_exam_types.filter((radio_operation_exam_type : RadioOperationExamType ) => {
        return radioOperationServiceSelectedValue == radio_operation_exam_type.radio_operator_service_id &&  {label:radio_operation_exam_type.name,  value: radio_operation_exam_type.id}
    }).map((radio_operation_exam_type: RadioOperationExamType) => {
        return   { label: radio_operation_exam_type.name , value: radio_operation_exam_type.id }
    })
    const showMode = (currentMode:string) => {

        if(currentMode == 'date'){
            show ? setShow(false) : setShow(true);
        }else{

            Platform.OS !== 'ios' && timeShow? setTimeShow(false) : setTimeShow(true)
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


    return (
        <View style={styles.container}>
            <Text>APPLICANT'S</Text>
            <RNPickerSelect
                value={userSelectedValue}
                onValueChange={(itemValue: any, itemIndex: number) => setUserSelectedValue(itemValue)}
                items={
                    users.map((user : User, index: number ) => {
                        return  { label: user.first_name + " " + user.last_name , value: user.id }
                    })

                   }
            />
            <Text>Radio Operation Service</Text>
            <RNPickerSelect
                value={radioOperationServiceSelectedValue}
                onValueChange={(itemValue: any, itemIndex: number) => {

                    setRadioOperationServiceSelectedValue(itemValue)
                    setRadioOperationExamTypeSelectedValue(radio_operation_exam_types.filter(radio_operation_exam_type => radio_operation_exam_type.radio_operator_service_id == itemValue  )
                        .map((radio_operation_exam_type) => {
                            return {label: radio_operation_exam_type.name, id: radio_operation_exam_type.id}
                        })[0]["id"])
                }}
                items={

                    radio_operation_services.map((radio_operation_service: RadioOperationServices) => {
                            return { label:radio_operation_service.name,  value: radio_operation_service.id}
                })
                }
            />


            <Text>Radio Operation Exam Type</Text>
            <RNPickerSelect
                value={radioOperationExamTypeSelectedValue}
                onValueChange={(itemValue: any, itemIndex: number) => setRadioOperationExamTypeSelectedValue(itemValue)}
                items={
                    radioOperationExamTypeItems
                }
            />

            <InputField
                style={{ color: text.default }}
                outlineStyle={{
                    borderColor: outline.default,
                    borderRadius: roundness,
                    borderWidth: thickness
                }}
                label={'Name'}
                placeholder="Name"
                required={true}
                activeColor={text.primary}
                errorColor={text.error}
                onChangeText={(text: string) => onChangeText('name', text)}
                value={formValue?.name?.value}
            />
            <InputField
                style={{ color: text.default }}
                outlineStyle={{
                    borderColor: outline.default,
                    borderRadius: roundness,
                    borderWidth: thickness
                }}
                label={'Place'}
                placeholder="Place"
                required={true}
                activeColor={text.primary}
                errorColor={text.error}
                onChangeText={(text: string) => onChangeText('place', text)}
                value={formValue?.place ?.value}
            />
            <Text weight={'bold'}>City</Text>
            <RNPickerSelect

                value={citySelectedValue}
                onValueChange={(itemValue: any, itemIndex: number) => setCitySelectedValue(itemValue)}
                items={
                    cities.map((city: City) => {
                        return  { label: city.city,  value: city.id }
                    })
                }
            />



                <DateTimeField
                    title={'Date of Exam: (mm/dd/yy)'}
                    borderColor={'red'}
                    placeholder="Date of Exam: (mm/dd/yy)"
                />



            {Platform.OS !== 'ios' && <Button onPress={showTimepicker} style={{ backgroundColor: '#2B23FF'}} >

                    <Text fontSize={16} color={'white'}>
                        Time of Exam
                    </Text>
                </Button>}


            {Platform.OS !== 'ios' ? timeShow: !timeShow &&
            <><Text weight={'bold'}>Time of Exam</Text><SelectTimePicker
                testID="timePicker"
                mode="time"
                value={time}
                is24Hour={is24Hours}
                display="default"
                onChange={onTimeChange}/></> }

            <Button onPress={onSubmit} style={{ backgroundColor: '#2B23FF' }}>
                <Text fontSize={16} color={'white'}>
                    Previous
                </Text>
            </Button>
        </View>
    );
};

export default NTC101;
