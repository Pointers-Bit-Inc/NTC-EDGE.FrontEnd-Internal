import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {Animated, FlatList, Platform, ScrollView, TextInput, TouchableOpacity, View} from "react-native";
import {isTablet} from "react-native-device-info";
import Text from "@atoms/text"
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React from "react";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";
import LeftSideWeb from "@atoms/left-side-web";
import {setRole} from "../../../reducers/role/actions";
import lodash from "lodash";
import {disabledColor, successColor} from "@styles/color";
import {InputField} from "@molecules/form-fields";
import useRoleAndPermission from "../../../hooks/useRoleAndPermission";
import RoleChecklist from "@pages/role-and-permission/RoleCheckList";
import ApplicationApproved from "@assets/svg/application-approved";
import useMemoizedFn from "../../../hooks/useMemoizedFn";
import listEmpty from "@pages/activities/listEmpty";


export default function RoleAndPermissionPage(props: any) {
    const {
        dimensions,
        value,
        setValue,
        dispatch,
        role,
        rolesMemo,
        renderItem,
        access,
        setAccess,
        createRole,
        setCreateRole,
        createRoleInput,
        setCreateRoleInput,
        onCreateAccess,
        onParseAccess,
        updateValid,
        animation,
        onClose,
        background,
        success,
        display,
        alertConfirm,
        alertCancel,
        listEmptyComponent
    } = useRoleAndPermission(props.navigation);


    return (
        <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>

            <LeftSideWeb>
                <View style={styles.header}>
                    <Header title={"Roles & Permission"}>
                        <TouchableOpacity onPress={() => {

                            dispatch(setRole([]))
                            if (isMobile) {
                                props.navigation.push('CreateRoleAndPermissionScreen')
                            } else {
                                setCreateRole(true)
                            }

                            setAccess([])

                        }}>
                            <Text style={{fontSize: fontValue(12)}}>Add a New Role</Text>
                        </TouchableOpacity>
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
                                <TextInput value={value} onChangeText={text => {
                                    setValue(text)
                                }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                                <View style={styles.searchIcon}>
                                    <SearchIcon/>
                                </View>
                            </View>


                        </View>


                    </View>

                </View>
                <View style={{flex: 1}}>
                    <FlatList
                        ListEmptyComponent={listEmptyComponent}
                        data={rolesMemo}
                        contentContainerStyle={{padding: 10,}}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                    />

                </View>
            </LeftSideWeb>


            {
                !(
                    (
                        isMobile && !(
                            Platform?.isPad || isTablet()))) && (!createRole) && lodash.isEmpty(role) && dimensions?.width > 768 ?
                    <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                        <NoActivity/>
                        <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                            selected</Text>


                    </View> : <></>
            }

            {
                !lodash.isEmpty(role) && Platform.OS == "web" ? <View style={[{flex: 1, backgroundColor: "#fff",}]}>
                    <Animated.View
                        pointerEvents="box-none"
                        style={[
                            styles.background,
                            {
                                backgroundColor: background,
                            },
                        ]}>
                        <Animated.View
                            style={[
                                styles.background,
                                {
                                    transform: [{scale: display}, {translateY: success}],
                                },
                            ]}>
                            <View style={styles.wrap}>
                                <Text style={styles.regularText}>
                                    <ApplicationApproved  height={fontValue(80)} width={fontValue(80)}/>
                                </Text>
                                <View style={styles.modalHeader}/>
                                <Text style={styles.headerText}>Successfully Updated!</Text>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: "center"
                                    }}>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => {
                                            Animated.spring(animation, {
                                                toValue: 2,
                                                useNativeDriver: false,
                                            }).start(() => {
                                                animation.setValue(0);
                                            });
                                            alertConfirm()
                                        }}>
                                        <Text style={styles.buttonText}>Ok</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    </Animated.View>
                    <Header size={24} title={"Role: " + role?.name}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>
                    {role?.description ? <Header size={14} title={"Description:" + role?.description}/> : <></>}
                    <Header size={14} title={"Access:"}/>

                    <ScrollView style={{borderTopWidth: 1, borderTopColor: disabledColor}}>

                        <RoleChecklist value={access} onChange={(value) => {
                            setAccess(value)
                        }}/>
                    </ScrollView>
                    <View style={{

                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity disabled={!updateValid} style={{
                            backgroundColor: updateValid ? successColor : disabledColor,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 10
                        }} onPress={onParseAccess}>

                            <Text style={[styles.text, {color: "#fff"}]} size={14}>Update</Text>

                        </TouchableOpacity>
                    </View>


                </View> : <></>
            }


            {(createRole && lodash.isEmpty(role) && !isMobile) ? <View style={[{flex: 1, backgroundColor: "#fff",}]}>
                <Header size={24} title={"Create Role and Permission"}>
                    <TouchableOpacity onPress={onClose}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </Header>
                <View style={{paddingHorizontal: 26}}>
                    <InputField onChangeText={setCreateRoleInput}
                                value={createRoleInput} placeholder={"Create a Role"} label={"Create a Role"}/>
                </View>

                {role?.description ? <Header size={14} title={"Description:" + role?.description}/> : <></>}
                <Header size={14} title={"Access:"}/>
                <ScrollView style={{borderTopWidth: 1, borderTopColor: disabledColor}}>
                    <View style={{padding: 20}}>

                        <RoleChecklist value={access} onChange={(value) => {
                            setAccess(value)
                        }}/>

                    </View>
                </ScrollView>
                <View style={{

                    margin: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                    <TouchableOpacity style={{
                        backgroundColor: successColor,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 10
                    }} onPress={onCreateAccess}>

                        <Text style={[styles.text, {color: "#fff"}]} size={14}>Create</Text>

                    </TouchableOpacity>
                </View>


            </View> : <></>

            }


        </View>
    )
}
