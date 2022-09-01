import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {FlatList, Platform, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {isTablet} from "react-native-device-info";
import Text from "@atoms/text"
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";
import LeftSideWeb from "@atoms/left-side-web";
import {BASE_URL} from "../../../services/config";
import axios from "axios";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setRole, setRoles} from "../../../reducers/role/actions";
import {Bold} from "@styles/font";
import lodash from "lodash";
import CheckboxList from "@atoms/checkboxlist";
import {
    activity,
    chat,
    employeeCreate,
    employeeDelete,
    employeeEdit,
    employeeView,
    meet,
    rolePermissionCreate,
    rolePermissionDelete,
    rolePermissionEdit,
    rolePermissionView,
    userCreate,
    userDelete,
    userEdit,
    userView
} from "../../../reducers/role/initialstate";
import {ToastType} from "@atoms/toast/ToastProvider";
import {useToast} from "../../../hooks/useToast";
import {disabledColor, successColor} from "@styles/color";
import {setSessionToken} from "../../../reducers/user/actions";

export default function RoleAndPermissionPage(props:any){
    const dimensions=useWindowDimensions();
    const [value,setValue]=useState();
    const sessionToken = useSelector((state: RootStateOrAny) => state.user?.sessionToken);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const roles = useSelector((state: RootStateOrAny) => state.role.roles);
    const role = useSelector((state: RootStateOrAny) => state.role.role);
    const fetchRoles = () => {
        setLoading(true);
        axios.get(BASE_URL + "/roles?page=" + page, {
            headers: {
                Authorization: "Bearer ".concat(sessionToken)
            }
        }).then((response) => {
            dispatch(setRoles(response.data))
            setLoading(false);
        }).catch((response) => {

            console.log(response.message)
        })
    }
    const rolesMemo = useMemo(() => {
        return roles
    }, [roles])

    useEffect(() => {
        return fetchRoles()
    }, [roles.length == 0])

    const onItemPress =useCallback((item) =>  {
        return  dispatch(setRole(item))
    }, [])

    const renderItem = ({ item }) => (
        <View style={{padding: 10}}>
            <TouchableOpacity onPress={()=> onItemPress(item)}>
                <View style={[styles.shadow, {borderRadius: 10, backgroundColor: "#fff", padding: 10}]}>
                    <Text style={{fontFamily: Bold}}>{item.name}</Text>
                </View>
            </TouchableOpacity>

        </View>

    );
    useEffect(()=>{
        parseAccess()
    }, [role?.id])
    const {showToast} = useToast();
    const [access, setAccess] = useState([

    ])
    let permission = {
        "chatPermission": false,
        "activityPermission": false,
        "meetPermission": false,
        "userPermission": {
            "view": false,
            "edit": false,
            "delete": false,
            "create": false
        },
        "employeePermission": {
            "view": false,
            "edit": false,
            "delete": false,
            "create": false
        },
        "rolePermission": {
            "view": false,
            "edit": false,
            "delete": false,
            "create": false
        }
    }




    const parseAccess = () => {
        if(lodash.isEmpty(role)) return
        let _permission = {...role?.permission}

        let p = []

        if( _permission.chatPermission){

            p.push(chat)
        }
        if( _permission.meetPermission ){
            p.push(meet)
        }
        if( _permission.activityPermission){
            p.push(activity)
        }
        if(_permission.userPermission.create){
            p.push(userCreate)
        }
        if( _permission.userPermission.delete ){
            p.push(userDelete)
        }
        if( _permission.userPermission.edit){
            p.push(userEdit)
        }
        if( _permission.userPermission.view){
            p.push(userView)
        }

        if(_permission.employeePermission.create){
            p.push(employeeCreate)
        }
        if( _permission.employeePermission.delete ){
            p.push(employeeDelete)
        }
        if( _permission.employeePermission.edit){
            p.push(employeeEdit)
        }
        if( _permission.employeePermission.view){
            p.push(employeeView)
        }
        if(_permission.rolePermission.create){
           p.push(rolePermissionCreate)
        }
        if( _permission.rolePermission.delete ){
            p.push(rolePermissionDelete)
        }
        if( _permission.rolePermission.edit){
            p.push(rolePermissionEdit)
        }
        if( _permission.rolePermission.view){
            p.push(rolePermissionView)
        }
        setAccess(p)

    }


    const config={
        headers:{
            Authorization:"Bearer ".concat(sessionToken)
        }
    };





    const onParseAccess = () =>{
        let _access = [...access]
      let _permission = {...permission}

        if(_access.indexOf(chat) !== -1){
            _permission.chatPermission = true
        }
        if(_access.indexOf(meet) !== -1){
            _permission.meetPermission = true
        }
        if(_access.indexOf(activity) !== -1){
            _permission.activityPermission = true
        }
        if(_access.indexOf(userCreate) !== -1){
            _permission.userPermission.create = true
        }
        if(_access.indexOf(userDelete) !== -1){
            _permission.userPermission.delete = true
        }
        if(_access.indexOf(userEdit) !== -1){
            _permission.userPermission.edit = true
        }
        if(_access.indexOf(userView) !== -1){
            _permission.userPermission.view = true
        }

        if(_access.indexOf(employeeCreate) !== -1){
            _permission.employeePermission.create = true
        }
        if(_access.indexOf(employeeDelete) !== -1){
            _permission.employeePermission.delete = true
        }
        if(_access.indexOf(employeeEdit) !== -1){
            _permission.employeePermission.edit = true
        }
        if(_access.indexOf(employeeView) !== -1){
            _permission.employeePermission.view = true
        }


        if(_access.indexOf(rolePermissionCreate) !== -1){
            _permission.rolePermission.create = true
        }
        if(_access.indexOf(rolePermissionDelete) !== -1){
            _permission.rolePermission.delete = true
        }
        if(_access.indexOf(rolePermissionEdit) !== -1){
            _permission.rolePermission.edit = true
        }
        if(_access.indexOf(rolePermissionView) !== -1){
            _permission.rolePermission.view = true
        }

        axios.patch(BASE_URL + `/roles/${role.id}/permission`, _permission, config ).then((res) => {
            console.log(sessionToken)
            dispatch(setSessionToken(res.data.sessionToken))
            showToast(ToastType.Success,"Success!")
        }).catch((error) => {
            setLoading(false)
            let _err = '';
            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string" || typeof error == "string") ) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data || error)
            }
        })



    }


    function newToken () {
        console.log(sessionToken)
    }


    return (
        <View style={{backgroundColor:"#F8F8F8",flex:1,flexDirection:"row"}}>
            <LeftSideWeb>
                <View style={styles.header}>
                    <Header title={"Roles & Permission"}/>
                    <View style={{marginHorizontal:26,}}>

                        <View style={{
                            paddingTop:14,
                            paddingBottom:12,
                            alignItems:"center",
                            justifyContent:"space-between",
                            flexDirection:"row",
                            flex:1
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
                            Platform?.isPad||isTablet())))&&  lodash.isEmpty(role) && dimensions?.width>768?
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
                            <View>
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
                    </ScrollView>
                    <View style={{

                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',}}>
                        {/*<TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={onParseAccess}>

                            <Text style={[styles.text, {color: "#fff"} ]} size={14}>update</Text>

                        </TouchableOpacity>
                    </View>



                </View>   : <></>
            }


        </View>
    )
}