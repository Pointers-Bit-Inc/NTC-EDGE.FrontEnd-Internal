import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import Row from "@pages/activities/application/Row";
import React, {memo, useState} from "react";
import styles from "@styles/applications/basicInfo"
import {generatePassword, transformText} from "../../../utils/ntc";
import _ from "lodash";
import NavBar from "@molecules/navbar";
import ProfileImage from "@components/atoms/image/profile";
import {fontValue} from "@pages/activities/fontValue";
import {RootStateOrAny, useSelector} from "react-redux";
import Text from '@atoms/text'
import {Bold} from "@styles/font";
import * as Clipboard from 'expo-clipboard';
import {infoColor, successColor} from "@styles/color";
import axios from "axios";
import {BASE_URL} from "../../../services/config";
import Alert from "@atoms/alert";
import {InputField} from "@molecules/form-fields";
import {useToast} from "../../../hooks/useToast";
import {ToastType} from "@atoms/toast/ToastProvider";
import CheckIcon from "@assets/svg/check";
const ResetPasswordTab = () => {

    const data = useSelector((state: RootStateOrAny) => {
        return state.application.data
    });
    const [temporaryPassword, setTemporaryPassword] = useState("")
    const [disabled, setDisabled] = useState(false)
    const [alert, setAlert] = useState(false)
    const sessionToken=useSelector((state:RootStateOrAny)=>state.user.sessionToken);
    const config={
        headers:{
            Authorization:"Bearer ".concat(sessionToken)
        }
    };
    const {showToast, hideToast} = useToast();
    const resetPassword = () => {
        if(!data?._id) return
        setAlert(false)
        setDisabled(true)
        data.role = data.role.key
        const _temporaryPassword = generatePassword()
        setTemporaryPassword(_temporaryPassword)
        data.password = _temporaryPassword
        axios.patch(BASE_URL + "/users/" + data?._id,data, config).then((response)=>{
           setAlert(true)
            setDisabled(false)
        })
    }

    const onConfirm = async () => {
        await Clipboard.setString(temporaryPassword)
        showToast(ToastType.Success, 'Copied Text!')
        setAlert(false)
    }



    return <><View style={[styles.elevation]}>

        <View style={[styles.container, {marginVertical: 20}]}>
            <View style={styles.group3}>
                <Text style={{fontFamily: Bold, fontSize: fontValue(18)}}>Reset Password</Text>
                <Text  style={{fontSize: fontValue(12), paddingBottom: fontValue(12)}}>{data?.firstName  && data?.lastName ? data?.firstName+(data?.middleName ? " "+data?.middleName?.charAt()+"." : "")+" "+data?.lastName : data?.applicantName ? data?.applicantName : data?.companyName || "" }</Text>
                <Text  style={{fontSize: fontValue(14), paddingBottom: fontValue(6)}}>{`The user\n'${data?.email}' will be assigned a temporary password that must be changed on the next sign in. To display the temporary password, click 'Reset Password'`}</Text>
                <View style={{ alignItems: "flex-start",  justifyContent: "flex-start"}}>

                    <TouchableOpacity disabled={disabled} onPress={resetPassword}>
                        <View style={{flexDirection: "row", alignItems: "center", borderRadius: 6, justifyContent: "center", backgroundColor: infoColor, padding: fontValue(10), }}>
                            <Text style={{ color: "#fff", fontFamily: Bold, fontSize: fontValue(14)}}>{disabled ? 'Resetting Password...' :'Reset Password'}</Text>
                            {disabled ? <ActivityIndicator color={"#fff"}/> : <></>}
                        </View>


                    </TouchableOpacity>
                </View>

            </View>

        </View>
    </View>
    <Alert  confirmText={"Confirm"}
        cancelText={"Cancel"} onConfirm={onConfirm} visible={alert} message={ <View>
        <View style={{paddingBottom: 10}}>
            <View style={{backgroundColor: 'rgba(50, 168, 82, 0.2)', padding: 10, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <View style={{paddingRight: 10}}>
                    <CheckIcon/>
                </View>
                <View>
                    <Text>
                        Password has been reset
                    </Text>
                </View>
            </View>

        </View>
       <View style={{paddingBottom: 10}}>
            <Text>Provide this temporary password to the user so they can sign in</Text>
        </View>
        <InputField  value={temporaryPassword}  />
    </View>}/>
    </>
}

export default memo(ResetPasswordTab)