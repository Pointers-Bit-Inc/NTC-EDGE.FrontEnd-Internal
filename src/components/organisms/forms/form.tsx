import React,{Fragment,useRef,useState} from 'react';
import {Image,Platform,StyleSheet,TouchableOpacity,View} from 'react-native';
import {DropdownField,InputField} from "@molecules/form-fields";
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from "@atoms/button";
import Text from "@atoms/text";
import {Ionicons} from "@expo/vector-icons";
import {input,outline,text} from "@styles/color";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import inputStyles from "@styles/input-style";
import CalendarPicker from 'react-native-calendar-picker';
import DateField from "@pages/activities/application/datefield";
import moment from "moment";
import {Regular500} from "@styles/font";
import {uniqueId} from "lodash";
const FormField=({
                     color,
                     formElements,
                     onChange,
                     onSubmit,
                     handleEvent,
                     ...otherProps
                 }:any)=>{
    // const inputColor = color ? color : "#486c86";

    const renderElements=(id:number,element:any, /*color: any,*/ styleProps:any)=>{
        const {type,pickerData,...otherProps}=element;
        const buttonElement=()=>{

            return <Button onPress={()=>onSubmit(id,type)}    {...styleProps} {...otherProps}>
                <Text fontSize={16} color={'white'}>
                    {otherProps.label}
                </Text>
            </Button>
        };
        switch(type){
            case 'image':
                return <View style={element.containerStyle}>
                    <Image
                        {...styleProps}

                        {...otherProps}
                        source={{uri:element?.tempBlob ||  element?.value }}
                        resizeMode={"cover"}
                    />
                </View>
            case "text":
                return <Text  {...styleProps} {...otherProps} >{otherProps.label}</Text>;
            case "input":
                return !element.hidden ? <InputField   {...styleProps} {...otherProps}
                                   onEndEditing={(e:any)=>{
                                       onChange(id,e.nativeEvent.text,'input')
                                   }
                                   }
                                   onChangeText={(text:string)=>{
                                       onChange(id,text,'input',element?.stateName)
                                   }}
                                   onKeyPress={(event ) => {


                                           if(event?.nativeEvent?.key == "Tab" && Platform?.OS === "web"){
                                               event?.preventDefault();
                                               mapRef?.[mapRef?.findIndex(e=>e?.id==id)+1]?.ref?.current?.focus();
                                           }
                                   }}
                                   returnKeyType={mapRef?.[mapRef.length-1]?.id==mapRef?.[mapRef.findIndex(e=>e?.id==id)]?.id ? "done" : "next"}
                                   ref={mapRef?.[mapRef.findIndex(e=>e?.id==id)].ref}
                                   onSubmitEditing={(event:any)=>{
                                       mapRef?.[mapRef.findIndex(e=>e?.id==id)+1]?.ref?.current?.focus();
                                       onChange(id,event.nativeEvent.text,'input',element?.stateName);
                                       handleEvent ? handleEvent(layoutRef?.find((layout)=>layout?.["id"]==id)?.layout) : null
                                   }}/> : <></>;
            case "select":
                return <View style={{paddingBottom: 22}}>
                    <CustomDropdown
                        required={element?.required}

                                    value={element?.value}
                                    label={element?.label || "Select Item"}
                                    data={ element.data }
                                    onSelect={ ({ value }) => {
                                        if (value) onChange(id, value,'select', element?.stateName)
                                    } }/>
                    {
                        element?.hasValidation && (!!element?.error || !!element?.description) ? (
                            <View>
                                <Text
                                    style={[
                                        inputStyles?.validationText,
                                        !!element?.error && { color: input.text?.errorColor },
                                    ]}
                                >
                                    {element?.description}
                                </Text>
                            </View>
                        ) : null
                    }
                </View>;

            case 'password':
                return !element.hidden ? <InputField  {...styleProps} {...otherProps}
                                    onEndEditing={(e:any)=>{
                                        onChange(id,e.nativeEvent.text,'password')
                                    }
                                    }

                                    onChangeText={(text:string)=>onChange(id,text,'password')}
                                    onSubmitEditing={(event:any)=>onChange(id,event.nativeEvent.text,'password')}/> : <></>;
            case "date":

                return (
                    <View>
                        <View style={{padding: 10}}>
                            <Text style={{fontSize: 12,fontFamily: Regular500}}>{element.label}</Text>
                        </View>

                        <DateField label={"Date:"}

                                   edit={true}
                                   updateForm={(stateName, value) =>  onChange(id, value )}
                                   stateName={"schedule.dateStart"}
                                   applicant={element?.value}
                                   display={moment(element?.value).isValid() ? moment(element?.value).format('ddd DD MMMM YYYY') :element?.value}/>

                    </View>
                );
            case "radiobutton":
                return (
                    <View style={radioButton.typeContainer}>
                        <Text color={text.default} size={14}>Gender</Text>
                        {
                            pickerData.map((item:any, index)=>(
                                <TouchableOpacity
                                    key={index}
                                    onPress={()=>onChange(id,item.value)}
                                >
                                    <View style={radioButton.buttonContainer}>
                                        <View
                                            style={[radioButton.circle,item.value===otherProps.value&&radioButton.circleActive]}/>
                                        <Text color={text.default} size={14}>{item.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>);

            case "button":
                return buttonElement();
            case "image-picker":
                return buttonElement();
            case "picker":

                return <DropdownField
                    style={{
                        ...pickerSelectStyles,
                        iconContainer:{
                            top:10,
                            right:12,
                        },
                    }}
                    Icon={()=>{
                        return <Ionicons name="chevron-down-outline" size={24} color="gray"/>;
                    }}

                    label={otherProps.label}
                    placeholder={{
                        label:otherProps.label,
                        value:null,
                        color:'black',
                    }}
                    itemKey={'value'}
                    {...styleProps} {...otherProps}
                    onChangeValue={(value:string)=>onChange(id,value)}
                    items={
                        pickerData.map((pick:any,key:number)=>{
                            return {label:pick.label,value:pick.value,key:key}
                        })
                    }/>

        }
    };

    const mapRef:any=[];
    const [layoutRef,setLayoutRef]=useState([]);
    for(let index=0; index<formElements.length; index++){
        if(formElements?.[index]?.type==="input"){
            mapRef?.push({id:formElements?.[index]?.id,ref:useRef()})
        }
    }
    return (
        <>

            {formElements.map((element:any,key:number)=>{

                return element.type!='submit'&&element.type?(
                        <View onLayout={(event)=>{
                            const layout=event.nativeEvent.layout;

                            setLayoutRef([...layoutRef,{layout,id:element.id}])

                        }}>
                            {renderElements(
                                element.id,
                                element,
                                // inputColor,
                                otherProps,
                            )}
                        </View>
                ) : null;
            })}
        </>
    );
};
const pickerSelectStyles=StyleSheet.create({
    inputIOS:{
        paddingVertical:12,
        paddingHorizontal:10,
        borderWidth:1,
        borderColor:'gray',
        borderRadius:4,
        color:'black',
        paddingRight:30, // to ensure the text is never behind the icon
    },
    inputAndroid:{
        paddingHorizontal:10,
        paddingVertical:8,
        borderWidth:0.5,
        borderColor:'gray',
        borderRadius:8,
        color:'black',
        paddingRight:30, // to ensure the text is never behind the icon
    },
});

const radioButton=StyleSheet.create({
    buttonContainer:{
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:15,
    },
    typeContainer:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:20,
        paddingHorizontal:5,
    },
    circle:{
        height:15,
        width:15,
        borderColor:outline.default,
        borderWidth:1.2,
        borderRadius:15,
        marginRight:5,
    },
    circleActive:{
        borderColor:outline.primary,
        borderWidth:5,
    }
});


export default FormField;
