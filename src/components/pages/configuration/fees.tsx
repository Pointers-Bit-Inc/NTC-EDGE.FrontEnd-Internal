import React from "react";
import {ActivityIndicator, Animated, ScrollView, TouchableOpacity, View} from "react-native";
import Header from "@molecules/header";
import Text from "@atoms/text";
import {styles} from "@pages/activities/styles";
import {Bold} from "@styles/font";
import FormField from "@organisms/forms/form";
import UploadQrCode from "@assets/svg/uploadQrCode";
import {disabledColor, errorColor, infoColor, successColor, text} from "@styles/color";
import useConfiguration from "../../../hooks/useConfiguration";
import {isMobile} from "@pages/activities/isMobile";
import {fontValue} from "@pages/activities/fontValue";
import DebounceInput from "@atoms/debounceInput";
import SearchIcon from "@assets/svg/search";
import RenderFeeConfiguration from "@pages/configuration/renderFeeConfiguration";
import lodash from "lodash";
import CustomAlert from "@pages/activities/alert/alert";
import {APPROVED} from "../../../reducers/activity/initialstate";
const FeesConfigurationScreen = (props) => {
    const {
        value,
        setValue,
        loading,
        fee,
        feeFlatten,
        hasChanges,
        inputRef,
        edit,
        setEdit,
        updateApplication,
        applicantFeeForm,
        setFeeVisible,
        setCustomAlertVisible,
        customAlertVisible,
        customAlertMessage
    } = useConfiguration(props);
   return   <><View style={[{flex: 1, backgroundColor: "#fff",}]}>
       <Header size={24} title={"Fees"}>
           {!lodash.isEmpty(fee?.fees) ? (edit ? <View style={{flexDirection: "row", justifyContent: "space-between",  alignItems: "center"}}>

                       {loading ? <ActivityIndicator/> : <TouchableOpacity onPress={updateApplication}>
                           <Text style={{fontFamily: Bold, color: successColor,  fontSize: fontValue(15)}}>Save</Text>
                       </TouchableOpacity>}

                       <View style={{paddingLeft: 10}}>
                           <TouchableOpacity onPress={()=> {

                               setEdit(false)
                           }}>
                               <Text style={{fontFamily: Bold, color: errorColor,  fontSize: fontValue(15)}}>Cancel</Text>
                           </TouchableOpacity>
                       </View>
                   </View> :
                   <View style={{flexDirection: "row", justifyContent: "space-between",  alignItems: "center"}}>
                       <TouchableOpacity onPress={() => {
                           setEdit(edit => !edit)
                       }}>
                           <Text style={{ color: infoColor, fontFamily: Bold, fontSize: fontValue(15)}}>Edit</Text>
                       </TouchableOpacity>
                       <View style={{paddingLeft: 10}}>
                           <TouchableOpacity onPress={()=>{
                               if (props.navigation.canGoBack() && isMobile) props.navigation.goBack()
                               setFeeVisible(false)
                           }}>
                               <Text style={{  fontFamily: Bold, fontSize: fontValue(15)}}>Close</Text>
                           </TouchableOpacity>
                       </View>
                   </View>
           ) : <></>
           }

       </Header>
       <View style={{marginHorizontal: 26,}}>

           <View style={{
               paddingTop: 14,
               paddingBottom: 12,
               alignItems: "center",
               justifyContent: "space-between",
               flexDirection: "row",
           }}>
               <View style={{flex: 1, paddingRight: 15}}>
                   <DebounceInput value={value}
                                  minLength={3}
                                  inputRef={inputRef}
                                  onChangeText={setValue}
                                  delayTimeout={500}
                                  style={styles.search}/>
                   <View style={styles.searchIcon}>
                       <SearchIcon/>
                   </View>
               </View>


           </View>


       </View>

       <ScrollView style={{padding: 15}}  >
           <RenderFeeConfiguration hasChanges={hasChanges}
                                   updateApplication={updateApplication}
                                   updateForm={applicantFeeForm}
                                   userProfileForm={feeFlatten} search={value} edit={edit}
                                   service={fee.fees}/>


       </ScrollView>
   </View>
       <CustomAlert
           alertContainerStyle={{zIndex: 2}}
           showClose={true}
           type={  APPROVED }
           onDismissed={()=>{
               setCustomAlertVisible(false)
           }}
           onCancelPressed={()=>{
               if (props.navigation.canGoBack() && isMobile) props.navigation.goBack()
               setCustomAlertVisible(false)
           }}
           onConfirmPressed={async () => {
               setCustomAlertVisible(false)
           }}
           show={customAlertVisible} title={""}
           message={customAlertMessage}/>
   </>
}

export default FeesConfigurationScreen
