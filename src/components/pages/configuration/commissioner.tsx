import React from "react";
import {Animated, ScrollView, TouchableOpacity, View} from "react-native";
import Header from "@molecules/header";
import Text from "@atoms/text";
import {styles} from "@pages/activities/styles";
import ScheduleCreateEdit from "@pages/schedule/ScheduleCreateEdit";
import useSchedule from "../../../hooks/useSchedule";
import {Bold} from "@styles/font";
import FormField from "@organisms/forms/form";
import UploadQrCode from "@assets/svg/uploadQrCode";
import {disabledColor, successColor, text} from "@styles/color";
import useConfiguration from "../../../hooks/useConfiguration";
import {isMobile} from "@pages/activities/isMobile";

const CommissionerConfigurationScreen = (props) => {
    const {
        onPress,
        commissioner,
        setCommissionerVisible,
        commissionerForm,
        onUpdateForm,
        onPressSignature,
        onPressCommissioner,
        commissionUpdateValid
    } = useConfiguration(props);
   return  <View style={[{flex: 1, backgroundColor: "#fff",}]}>
        <Header size={24} title={"Commissioner"}>
            <TouchableOpacity onPress={()=>{
                if (props.navigation.canGoBack() && isMobile) props.navigation.goBack()
                setCommissionerVisible(false)
            }}>
                <Text>Close</Text>
            </TouchableOpacity>
        </Header>
        <ScrollView style={{padding: 15}}  >
            <FormField
                formElements={commissionerForm}
                onChange={onUpdateForm}
                onSubmit={onPress}

            />
            <View style={{alignItems: "center"}}>
                <TouchableOpacity onPress={() => onPressSignature( 'signature')}>
                    <View style={styles.uploadSignature}>
                        <View style={{paddingRight: 10}}>

                            <UploadQrCode color={text.info}/>
                        </View>
                        <Text style={{fontFamily: Bold}}>Commissioner Signature</Text>
                    </View>
                </TouchableOpacity>
            </View>



        </ScrollView>
        <View style={{paddingVertical: 15}}>

            <TouchableOpacity disabled={!commissionUpdateValid}  onPress={() => { onPressCommissioner(commissioner.id) }} style={[styles.scheduleButton, {alignItems: "center", backgroundColor: commissionUpdateValid ? successColor : disabledColor}]}>

                <Text style={[styles.text, {color: "#fff"}]} size={14}>Update Commissioner</Text>

            </TouchableOpacity>
        </View>
    </View>
}

export default CommissionerConfigurationScreen
