import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {FlatList, Platform, ScrollView, TextInput, TouchableOpacity, View} from "react-native";
import {isTablet} from "react-native-device-info";
import Text from "@atoms/text"
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";
import LeftSideWeb from "@atoms/left-side-web";
import { setRole} from "../../../reducers/role/actions";
import lodash from "lodash";
import CheckboxList from "@atoms/checkboxlist";
import {
    activity,
    chat,
    employeeCreate,
    employeeDelete,
    employeeEdit,
    employeeView,
    meet, resetPasswordPermission,
    rolePermissionCreate,
    rolePermissionDelete,
    rolePermissionEdit,
    rolePermissionView,
    userCreate,
    userDelete,
    userEdit,
    userView
} from "../../../reducers/role/initialstate";
import {disabledColor, successColor} from "@styles/color";
import {InputField} from "@molecules/form-fields";
import useRoleAndPermission from "../../../hooks/useRoleAndPermission";



export default function RoleAndPermissionPage(props:any){
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
        onParseAccess
    } = useRoleAndPermission(props.navigation);
    return (
        <View style={{backgroundColor:"#F8F8F8",flex:1,flexDirection:"row"}}>
            <LeftSideWeb>
                <View style={styles.header}>
                    <Header title={"Roles & Permission"}>
                        <TouchableOpacity onPress={()=> {

                            dispatch(setRole([]))
                            if(isMobile){
                                props.navigation.push('CreateRoleAndPermissionScreen')
                            }else{
                                setCreateRole(true)
                            }

                            setAccess([])

                        }}>
                            <Text>Add a New Role</Text>
                        </TouchableOpacity>
                    </Header>
                    <View style={{marginHorizontal:26,}}>

                        <View style={{
                            paddingTop:14,
                            paddingBottom:12,
                            alignItems:"center",
                            justifyContent:"space-between",
                            flexDirection:"row",
                        }}>
                            <View style={{flex:1,paddingRight:15}}>
                                <TextInput value={value} onChangeText={text=>{
                                    setValue(text)
                                }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                                <View style={styles.searchIcon}>
                                    <SearchIcon/>
                                </View>
                            </View>






                        </View>


                    </View>

                </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
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
                        isMobile&& !(
                            Platform?.isPad||isTablet())))&& (!createRole) && lodash.isEmpty(role) && dimensions?.width>768?
                <View style={[{flex:1,justifyContent:"center",alignItems:"center"}]}>

                    <NoActivity/>
                    <Text style={{color:"#A0A3BD",fontSize:fontValue(24)}}>No activity
                        selected</Text>


                </View> : <></>
            }

            {
                !lodash.isEmpty(role) ?  <View style={[{flex:1, backgroundColor: "#fff",}]}>
                    <Header size={24} title={"Role: " + role?.name}/>
                    { role?.description ? <Header size={14} title={"Description:" + role?.description}/> : <></>}
                    <Header size={14} title={"Access:"}/>
                    <ScrollView style={{ borderTopWidth: 1, borderTopColor: disabledColor}}>
                        <View style={{padding: 20}}>

                            <View>

                                <CheckboxList
                                    containerStyle={{flex: 1}}
                                    showCheckAll={false}
                                    value={access}
                                    onChange={(value)=>{

                                        setAccess(value)
                                    }
                                    }
                                    options={[
                                        { label: 'Chat', value: chat },
                                        { label: 'Meet', value: meet },
                                        { label: 'Activity', value: activity},
                                    ]}
                                />
                                <View style={{paddingTop: 10}}>
                                    <Text size={14} style={styles.text}>User</Text>
                                    <CheckboxList
                                        showCheckAll={false}
                                        value={access}
                                        onChange={(value)=>{

                                            setAccess(value)
                                        }
                                        }
                                        options={[
                                            { label: 'Create', value: userCreate },
                                            { label: 'Read', value: userView },
                                            { label: 'Update', value: userEdit },
                                            { label: 'Delete', value: userDelete },
                                        ]}
                                    />
                                </View>
                                <View style={{paddingTop: 10}}>
                                <Text size={14} style={styles.text}>Employee</Text>
                                <CheckboxList
                                    showCheckAll={false}
                                    value={access}
                                    onChange={(value)=>{

                                        setAccess(value)
                                    }
                                    }
                                    options={[
                                        { label: 'Create', value: employeeCreate },
                                        { label: 'Read', value: employeeView },
                                        { label: 'Update', value: employeeEdit },
                                        { label: 'Delete', value: employeeDelete },
                                    ]}
                                />
                                </View>
                                <View style={{paddingTop: 10}}>
                                <Text size={14} style={styles.text}>Role and Permission</Text>
                                <CheckboxList
                                    size={12}
                                    showCheckAll={false}
                                    value={access}
                                    onChange={(value)=>{
                                        setAccess(value)
                                    }
                                    }
                                    options={[
                                        { label: 'Create', value: rolePermissionCreate },
                                        { label: 'Read', value: rolePermissionView },
                                        { label: 'Update', value: rolePermissionEdit },
                                        { label: 'Delete', value: rolePermissionDelete },
                                    ]}
                                />
                                </View>
                            </View>
                            <Text size={14} style={styles.text}>Reset Password</Text>
                            <CheckboxList
                                size={12}
                                showCheckAll={false}
                                value={access}
                                onChange={(value)=>{
                                    setAccess(value)
                                }
                                }
                                options={[
                                    { label: 'Reset Password', value: resetPasswordPermission },
                                ]}
                            />
                        </View>
                    </ScrollView>
                    <View style={{

                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',}}>
                       {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={onParseAccess}>

                            <Text style={[styles.text, {color: "#fff"} ]} size={14}>Update</Text>

                        </TouchableOpacity>
                    </View>



                </View>   : <></>
            }



            {(createRole && lodash.isEmpty(role) && !isMobile) ? <View style={[{flex:1, backgroundColor: "#fff",}]}>
                <Header size={24} title={ "Create Role and Permission"}>
                    <TouchableOpacity onPress={()=>{
                        setCreateRole(false)
                        dispatch(setRole({}))
                    }
                    }>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </Header>
                <View style={{paddingHorizontal: 26}}>
                    <InputField   onChangeText={setCreateRoleInput}
                                  value={createRoleInput} placeholder={"Create a Role"} label={"Create a Role"} />
                </View>

                { role?.description ? <Header size={14} title={"Description:" + role?.description}/> : <></>}
                <Header size={14} title={"Access:"}/>
                <ScrollView style={{ borderTopWidth: 1, borderTopColor: disabledColor}}>
                    <View style={{padding: 20}}>

                        <View>

                            <CheckboxList
                                containerStyle={{flex: 1}}
                                showCheckAll={false}
                                value={access}
                                onChange={(value)=>{

                                    setAccess(value)
                                }
                                }
                                options={[
                                    { label: 'Chat', value: chat },
                                    { label: 'Meet', value: meet },
                                    { label: 'Activity', value: activity},
                                ]}
                            />
                            <View style={{paddingTop: 10}}>
                                <Text size={14} style={styles.text}>User</Text>
                                <CheckboxList
                                    showCheckAll={false}
                                    value={access}
                                    onChange={(value)=>{

                                        setAccess(value)
                                    }
                                    }
                                    options={[
                                        { label: 'Create', value: userCreate },
                                        { label: 'Read', value: userView },
                                        { label: 'Update', value: userEdit },
                                        { label: 'Delete', value: userDelete },
                                    ]}
                                />
                            </View>
                            <View style={{paddingTop: 10}}>
                                <Text size={14} style={styles.text}>Employee</Text>
                                <CheckboxList
                                    showCheckAll={false}
                                    value={access}
                                    onChange={(value)=>{

                                        setAccess(value)
                                    }
                                    }
                                    options={[
                                        { label: 'Create', value: employeeCreate },
                                        { label: 'Read', value: employeeView },
                                        { label: 'Update', value: employeeEdit },
                                        { label: 'Delete', value: employeeDelete },
                                    ]}
                                />
                            </View>
                            <View style={{paddingTop: 10}}>
                                <Text size={14} style={styles.text}>Role and Permission</Text>
                                <CheckboxList
                                    size={12}
                                    showCheckAll={false}
                                    value={access}
                                    onChange={(value)=>{
                                        setAccess(value)
                                    }
                                    }
                                    options={[
                                        { label: 'Create', value: rolePermissionCreate },
                                        { label: 'Read', value: rolePermissionView },
                                        { label: 'Update', value: rolePermissionEdit },
                                        { label: 'Delete', value: rolePermissionDelete },
                                    ]}
                                />
                            </View>
                        </View>
                        <Text size={14} style={styles.text}>Reset Password</Text>
                        <CheckboxList
                            size={12}
                            showCheckAll={false}
                            value={access}
                            onChange={(value)=>{
                                setAccess(value)
                            }
                            }
                            options={[
                                { label: 'Reset Password', value: resetPasswordPermission },
                            ]}
                        />
                    </View>
                </ScrollView>
                <View style={{

                    margin: 10,
                    justifyContent: 'center',
                    alignItems: 'center',}}>
                    {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                    <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={onCreateAccess}>

                        <Text style={[styles.text, {color: "#fff"} ]} size={14}>Create</Text>

                    </TouchableOpacity>
                </View>



            </View>   : <></>

            }


        </View>
    )
}
