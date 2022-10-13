import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {ActivityIndicator, FlatList, Image, Platform, ScrollView, TouchableOpacity, View} from "react-native";
import {isTablet} from "react-native-device-info";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React from "react";
import LeftSideWeb from "@atoms/left-side-web";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";
import {UploadIcon} from "@atoms/icon";
import {defaultColor, text} from "@styles/color";
import lodash from "lodash";
import RenderFeeConfiguration from "@pages/configuration/renderFeeConfiguration";
import Text from "@atoms/text"
import DebounceInput from "@atoms/debounceInput";
import DropdownCard from "@organisms/dropdown-card";
import useConfiguration from "../../../hooks/useConfiguration";
import FormField from "@organisms/forms/form";
import UploadQrCode from "@assets/svg/uploadQrCode";
import {Bold} from "@styles/font";

export default function ConfigurationPage(props: any) {
    const {
        dimensions,
        value,
        setValue,
        loading,
        createRegion,
        fee,
        feeFlatten,
        hasChanges,
        onPress,
        region,
        regionsMemo,
        renderListItem,
        onUpdateCreateRegion,
        inputRef,
        onClose,
        edit,
        setEdit,
        updateApplication,
        applicantFeeForm,
        commissioner,
        commissionerVisible,
        setCommissionerVisible,
        commissionerForm,
        onUpdateForm,
        commissionerOriginalForm
    } = useConfiguration(props);


    return (
        <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
            <LeftSideWeb>
                <View style={styles.header}>
                    <Header title={"Configurations"}>
                        {!lodash.isEmpty(fee?.fees) ? (edit ? <TouchableOpacity onPress={updateApplication}>
                                <Text>Save</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={() => {
                                setEdit(edit => !edit)

                            }}>
                                <Text>Edit</Text>
                            </TouchableOpacity>) : <></>
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

                </View>
                <View style={{flex: 1}}>
                    {loading ?
                        <View style={{padding: 20, justifyContent: "center", alignItems: "center"}}>
                            <ActivityIndicator/>
                        </View> : <></>}
                    <ScrollView nestedScrollEnabled={true}>
                        {!lodash.isEmpty(fee?.fees) ?

                            <DropdownCard
                                style={{margin: 10, borderWidth: 1, borderColor: defaultColor, borderRadius: 10,}}
                                label={<>
                                    <Text style={{fontWeight: 'bold'}} color={"#113196"}
                                          size={16}>Fees</Text>
                                </>}>
                                <RenderFeeConfiguration hasChanges={hasChanges}
                                                        updateApplication={updateApplication}
                                                        updateForm={applicantFeeForm}
                                                        userProfileForm={feeFlatten} search={value} edit={edit}
                                                        service={fee.fees}/>
                            </DropdownCard> : <></>
                        }
                        {!lodash.isEmpty(regionsMemo) ? <DropdownCard
                            style={{margin: 10, borderWidth: 1, borderColor: defaultColor, borderRadius: 10,}} label={<>
                            <Text style={{fontWeight: 'bold'}} color={"#113196"}
                                  size={16}>Other</Text>
                        </>}>
                            <FlatList

                                data={regionsMemo}
                                contentContainerStyle={{padding: 10,}}
                                renderItem={renderListItem}
                                keyExtractor={item => item._id}
                            />
                        </DropdownCard> : <></>}

                        {!lodash.isEmpty(commissioner) ? <DropdownCard onPress={()=>{
                            setCommissionerVisible(true)
                        }} isChevronVisible={false}
                            style={{margin: 10, borderWidth: 1, borderColor: defaultColor, borderRadius: 10,}} label={<>
                            <Text style={{fontWeight: 'bold'}} color={"#113196"}
                                  size={16}>Commissioner</Text>
                        </>}>

                        </DropdownCard> : <></>}


                    </ScrollView>


                </View>
            </LeftSideWeb>
            {
                !(
                    (
                        isMobile && !(
                            Platform?.isPad || isTablet()))) && (!commissionerVisible) && (!createRegion) && lodash.isEmpty(region) && dimensions?.width > 768 &&
                <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                    <NoActivity/>
                    <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                        selected</Text>


                </View>
            }
            {
                (!lodash.isEmpty(region) && Platform.OS == "web") ? <View style={[{flex: 1, backgroundColor: "#fff",}]}>

                    <Header size={24} title={"Region: " + region?.label || ""}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>

                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center"
                    }}>
                        <View style={{padding: 20, justifyContent: 'space-between', alignItems: 'center',}}>
                            <TouchableOpacity onPress={() => onPress('director')}>
                                <View style={styles.border}>
                                    <Image resizeMode={"contain"}
                                           source={region?.configuration ? {
                                               uri: region?.configuration?.director?.signature,
                                           } : require('@assets/avatar.png')}
                                           style={{height: 200, width: 200}}/>
                                </View>

                                <View style={styles.uploadSignature}>
                                    <UploadIcon color={text.info}/>
                                    <Text>Director Signature</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                    {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                    {/*  <View style={{alignItems: "center"}}>
                        <TouchableOpacity onPress={() => onUpdateCreateRegion('patch')} disabled={!updateValid}
                                          style={{
                                              backgroundColor: updateValid ? successColor : disabledColor,
                                              paddingVertical: 10,
                                              paddingHorizontal: 20,
                                              borderRadius: 10
                                          }}>


                        </TouchableOpacity>
                    </View>*/}


                </View> : <></>
            }

            {(commissionerVisible && !isMobile) ?
                <View style={[{flex: 1, backgroundColor: "#fff",}]}>
                    <Header size={24} title={"Commissioner"}>
                        <TouchableOpacity onPress={()=>{
                            setCommissionerVisible(false)
                        }}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>
                    <View style={{flex: 1}}>
                        <FormField
                            formElements={commissionerForm}
                            onChange={onUpdateForm}
                            onSubmit={onPress}

                        />



                    <TouchableOpacity onPress={() => {}}>
                        <View style={styles.uploadSignature}>
                            <View style={{paddingRight: 10}}>

                                    <UploadQrCode color={text.info}/>
                            </View>
                            <Text style={{fontFamily: Bold}}>Commissioner Signature</Text>
                        </View>
                    </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}} style={styles.scheduleButton}>

                            <Text style={[styles.text, {color: "#fff"}]} size={14}>Update Commissioner</Text>

                        </TouchableOpacity>
                    </View>
                </View> : <></>

            }
            {(createRegion && lodash.isEmpty(region) && !isMobile) ?
                <View style={[{flex: 1, backgroundColor: "#fff",}]}>
                    <Header size={24} title={"Create Region"}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>

                    <View style={{
                        bottom: 0,
                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity onPress={() => onUpdateCreateRegion('post')} style={styles.scheduleButton}>

                            <Text style={[styles.text, {color: "#fff"}]} size={14}>Create Region</Text>

                        </TouchableOpacity>
                    </View>
                </View> : <></>

            }
        </View>
    )
}
