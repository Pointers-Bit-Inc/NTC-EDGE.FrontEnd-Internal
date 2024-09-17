import React,{FC,useEffect,useRef} from 'react';
import {InteractionManager,Platform,StyleSheet,TouchableOpacity,View} from 'react-native';
import {CheckIcon} from '@atoms/icon';
import {DropdownField, InputField, PasswordField,} from '@molecules/form-fields';
import InputStyles from '@/src/styles/input-style';
import {text} from '@/src/styles/color';
import Text from '@atoms/text';
import {Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import DropDown from "@atoms/dropdown";

const styles=StyleSheet.create({
    container:{
        flex:1,
        ...Platform.select({
            native:{},
            default:{
                minWidth:330,
            }
        })
    },
    label:{
        marginLeft:10
    },
    passwordValidationContainer:{
        paddingVertical:5,
        marginBottom:10,
        marginTop:5,
    },
    strengthBar:{
        height:4,
        borderRadius:4,
        marginTop:10,
        flex:1,
    },
    horizontal:{
        flexDirection:'row',
        alignItems:'center',
    },
    unchecked:{
        height:18,
        width:18,
        backgroundColor:'#DBDFE5',
        borderRadius:3,
    }
});

interface Props{
    isBiometricSupported?: boolean;
    onBiometrics?:any;
    form?:any;
    onChangeValue?:any;
}

const LoginForm:FC<Props>=({isBiometricSupported=false,onBiometrics=()=>{},form={},onChangeValue=()=>{}})=>{
    const inputRef:any=useRef(null);
    const passwordRef:any=useRef(null);
    const keepMeLoggedInChecker=(checked:boolean)=>{
        if(checked){
            return (
                <View
                    style={[
                        styles.unchecked,
                        {
                            backgroundColor:text.primary,
                            justifyContent:'center',
                            alignItems:'center'
                        }
                    ]}
                >
                    <CheckIcon
                        type="check"
                        color="white"
                        size={14}
                    />
                </View>
            );
        }
        return (
            <View style={styles.unchecked}/>
        );
    };
    useEffect(()=>{
        if(Platform.OS=="android"){
            InteractionManager.runAfterInteractions(()=>{
                passwordRef.current?.focus();
                passwordRef.current?.blur();
                inputRef.current?.focus();
            });
        }

    },[]);


    return (
        <View style={[styles.container]}>
            <View>
                <DropdownField

                    items={
                        [
                            {label: "Region 10",value: "ntc-region10",key:"10"},
                            {label: "Region 7",value: "ntc-region7",key:"7"},
                        ]
                    }
                    value={form?.CreatedAt?.value?.label ?? ""}
                    onChangeValue={(value:string)=>{
                        onChangeValue('CreatedAt',value)
                    }}
                    placeholder='Region'
                />
            </View>
            <InputField
                testID={"email-input"}
                onKeyPress={(event)=>{
                    if(Platform?.OS==="web"&&event?.nativeEvent?.key=="Tab"){
                        event?.preventDefault();
                        passwordRef?.current?.focus()
                    }
                }}
                ref={inputRef}
                label={'Phone no./Email address'}
                placeholder="Phone no./Email address"
                required={true}
                hasValidation={true}
                inputStyle={InputStyles.text}
                outlineStyle={InputStyles.outlineStyle}
                activeColor={text.primary}
                errorColor={text.error}
                requiredColor={text.error}
                error={form?.email?.error}
                value={form?.email?.value}
                //keyboardType={'email-address'}
                onChangeText={(value:string)=>onChangeValue('email',value)}
                onSubmitEditing={(event:any)=>{
                    onChangeValue('email',event.nativeEvent.text);
                    passwordRef.current.focus()
                }}
            />
            <PasswordField
                testID={"password-input"}
                ref={passwordRef}
                inputStyle={InputStyles.text}
                label={'Password'}
                placeholder="Password"
                textContentType="oneTimeCode"
                required={true}
                hasValidation={true}
                outlineStyle={InputStyles.outlineStyle}
                activeColor={text.primary}
                errorColor={text.error}
                requiredColor={text.error}
                secureTextEntry={!form?.showPassword?.value}
                error={form?.password?.error}
                value={form?.password?.value}
                showPassword={()=>onChangeValue('showPassword')}
                onChangeText={(value:string)=>onChangeValue('password',value)}
                onSubmitEditing={(event:any)=>{
                    let cred:any = {
                        email:form?.email?.value,
                        password:form?.password?.value
                    };
                    if (form?.email?.isPhone) {
                        cred = {
                            phone: form?.email?.value,
                            password: form?.password?.value ,
                        }
                    }
                    onChangeValue('login',cred);
                }}
            />
            {isBiometricSupported&&<View style={[styles.horizontal,{justifyContent:'flex-start', marginBottom: 15}]}>
                <TouchableOpacity onPress={onBiometrics}>
                    <Text
                        style={[InputStyles.text,{fontSize:fontValue(12),fontFamily:Regular500,color:text.primary}]}
                        size={12}
                    >
                        Login with biometrics
                    </Text>
                </TouchableOpacity>
            </View>}
            {isMobile&&<View style={[styles.horizontal,{justifyContent:'flex-start'}]}>
                <TouchableOpacity onPress={()=>onChangeValue('forgotPassword')}>
                    <Text
                        style={[InputStyles.text,{fontSize:fontValue(12),fontFamily:Regular500,color:text.primary}]}
                        size={12}
                    >
                        Forgot your password?
                    </Text>
                </TouchableOpacity>
            </View>}
            {/* <View style={[styles.horizontal, { marginTop: 15 }]}>
        <TouchableOpacity onPress={() => onChangeValue('keepLoggedIn', !form?.keepLoggedIn?.value)}>
          {keepMeLoggedInChecker(form?.keepLoggedIn?.value)}
        </TouchableOpacity>
        <Text
          style={[InputStyles.text, styles.label]}
          size={12}
        >
          Keep me logged in
        </Text>
      </View>*/}
        </View>
    );
};

export default LoginForm;
