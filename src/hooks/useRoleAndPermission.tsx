import {TouchableOpacity, useWindowDimensions, View} from "react-native";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {BASE_URL} from "../services/config";
import {setAddRole, setDeleteRole, setRole, setRoles} from "../reducers/role/actions";
import {ToastType} from "@atoms/toast/ToastProvider";
import {styles} from "@pages/activities/styles";
import Text from "@atoms/text";
import {Bold} from "@styles/font";
import {useToast} from "./useToast";
import {
    activity,
    chat,
    employeeCreate,
    employeeDelete,
    employeeEdit,
    employeeView,
    meet,
    qrCodePermission,
    resetPasswordPermission,
    rolePermissionCreate,
    rolePermissionDelete,
    rolePermissionEdit,
    rolePermissionView,
    userCreate,
    userDelete,
    userEdit,
    userView
} from "../reducers/role/initialstate";
import {setSessionToken} from "../reducers/user/actions";
import lodash from "lodash";
import {isMobile} from "@pages/activities/isMobile";
import {fontValue} from "@pages/activities/fontValue";
const useRoleAndPermission =(navigation) => {
    const dimensions = useWindowDimensions();
    const [value, setValue] = useState();
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

            console.log(response.response)
        })
    }
    const rolesMemo = useMemo(() => {
        return roles
    }, [roles])

    useEffect(() => {
        return fetchRoles()
    }, [roles.length == 0])

    const onItemPress = useCallback((item) => {
        dispatch(setRole(item))
        if(isMobile){
            navigation.push("EditRoleAndPermissionScreen")
        }

    }, [])
    const config = useMemo(() => {
        return {
            headers: {
                Authorization: "Bearer ".concat(sessionToken)
            }
        };
    }, [sessionToken])
    const onDelete = (id) => {
        axios.delete(BASE_URL + "/roles/" + id, config).then(() => {
            showToast(ToastType.Success, "Success! ")
            dispatch(setDeleteRole(id))
        }).catch((error) => {
            setLoading(false)
            let _err = '';

            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string" || typeof error == "string")) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data || error)
            } else {
                showToast(ToastType.Error, error?.message || 'Something went wrong.');
            }


        })
    }
    const renderItem = ({item}) => (
        <View style={{padding: 10}}>
            <TouchableOpacity onPress={() => onItemPress(item)}>
                <View style={[styles.shadow, {borderRadius: 10, backgroundColor: "#fff", padding: 10}]}>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <View>
                            <Text style={{fontSize: fontValue(14), fontFamily: Bold}}>{item.name}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => onDelete(item.id)}>
                                <Text style={{fontSize: fontValue(10)}}>Delete</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        </View>

    );
    useEffect(() => {
        setAccess([])
        setOriginalAccess([])
        parseAccess()
    }, [role?.id])



    const {showToast} = useToast();
    const [access, setAccess] = useState([])

    let permission = {
        "chatPermission": false,
        "activityPermission": false,
        "meetPermission": false,
        "resetPasswordPermission": false,
        "qrCodePermission": false,
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
    const [originalAccess, setOriginalAccess] = useState([])


    const parseAccess = () => {
        if (lodash.isEmpty(role)) return
        let _permission = {...role?.permission}

        let p = []

        if (_permission.chatPermission) {

            p.push(chat)
        }
        if (_permission.meetPermission) {
            p.push(meet)
        }
        if (_permission.activityPermission) {
            p.push(activity)
        }
        if (_permission.userPermission.create) {
            p.push(userCreate)
        }
        if (_permission.userPermission.delete) {
            p.push(userDelete)
        }
        if (_permission.userPermission.edit) {
            p.push(userEdit)
        }
        if (_permission.userPermission.view) {
            p.push(userView)
        }

        if (_permission.employeePermission.create) {
            p.push(employeeCreate)
        }
        if (_permission.employeePermission.delete) {
            p.push(employeeDelete)
        }
        if (_permission.employeePermission.edit) {
            p.push(employeeEdit)
        }
        if (_permission.employeePermission.view) {
            p.push(employeeView)
        }
        if (_permission.rolePermission.create) {
            p.push(rolePermissionCreate)
        }
        if (_permission.rolePermission.delete) {
            p.push(rolePermissionDelete)
        }
        if (_permission.rolePermission.edit) {
            p.push(rolePermissionEdit)
        }
        if (_permission.rolePermission.view) {
            p.push(rolePermissionView)
        }
        if (_permission.resetPasswordPermission) {
            p.push(resetPasswordPermission)
        }

        if (_permission.qrCodePermission) {
            p.push(qrCodePermission)
        }
        setOriginalAccess(p)
        setAccess(p)

    }

    const [createRole, setCreateRole] = useState(false)

    function parsePermission(_access: any[], _permission: { chatPermission: boolean;qrCodePermission: boolean; resetPasswordPermission: boolean; rolePermission: { view: boolean; edit: boolean; create: boolean; delete: boolean }; userPermission: { view: boolean; edit: boolean; create: boolean; delete: boolean }; activityPermission: boolean; meetPermission: boolean; employeePermission: { view: boolean; edit: boolean; create: boolean; delete: boolean } }) {
        if (_access.indexOf(chat) !== -1) {
            _permission.chatPermission = true
        }
        if (_access.indexOf(meet) !== -1) {
            _permission.meetPermission = true
        }
        if (_access.indexOf(activity) !== -1) {
            _permission.activityPermission = true
        }
        if (_access.indexOf(userCreate) !== -1) {
            _permission.userPermission.create = true
        }
        if (_access.indexOf(userDelete) !== -1) {
            _permission.userPermission.delete = true
        }
        if (_access.indexOf(userEdit) !== -1) {
            _permission.userPermission.edit = true
        }
        if (_access.indexOf(userView) !== -1) {
            _permission.userPermission.view = true
        }

        if (_access.indexOf(employeeCreate) !== -1) {
            _permission.employeePermission.create = true
        }
        if (_access.indexOf(employeeDelete) !== -1) {
            _permission.employeePermission.delete = true
        }
        if (_access.indexOf(employeeEdit) !== -1) {
            _permission.employeePermission.edit = true
        }
        if (_access.indexOf(employeeView) !== -1) {
            _permission.employeePermission.view = true
        }


        if (_access.indexOf(rolePermissionCreate) !== -1) {
            _permission.rolePermission.create = true
        }
        if (_access.indexOf(rolePermissionDelete) !== -1) {
            _permission.rolePermission.delete = true
        }
        if (_access.indexOf(rolePermissionEdit) !== -1) {
            _permission.rolePermission.edit = true
        }
        if (_access.indexOf(rolePermissionView) !== -1) {
            _permission.rolePermission.view = true
        }
        if (_access.indexOf(resetPasswordPermission) !== -1) {
            _permission.resetPasswordPermission = true
        }

        if (_access.indexOf(qrCodePermission) !== -1) {
            _permission.qrCodePermission = true
        }


        return _permission

    }

    const [createRoleInput, setCreateRoleInput] = useState("")
    const onCreateAccess = () => {
        let _access = [...access]
        let _permission = {...permission}
        let _parsePermission = parsePermission(_access, _permission);
        axios.post(BASE_URL + "/roles", {permission: _parsePermission, name: createRoleInput}, config).then((res) => {
            setCreateRoleInput("")

            setCreateRole(false)
            setAccess([])
            showToast(ToastType.Success, "Success! ")
            dispatch(setAddRole(res.data))
        }).catch((error) => {
            setLoading(false)
            let _err = '';

            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string" || typeof error == "string")) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data || error)
            } else {
                showToast(ToastType.Error, error?.message || 'Something went wrong.');
            }


        })


    }

    const onParseAccess = () => {
        let _access = [...access]
        let _permission = {...permission}
        let _parsePermission = parsePermission(_access, _permission);

        axios.patch(BASE_URL + `/roles/${role.id}/permission`, _parsePermission, config).then((res) => {

            dispatch(setSessionToken(res.data.sessionToken))
            showToast(ToastType.Success, "Success!")
        }).catch((error) => {
            setLoading(false)
            let _err = '';

            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string" || typeof error == "string")) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data || error)
            } else {
                showToast(ToastType.Error, error?.message || 'Something went wrong.');
            }


        })


    }
    const updateValid = useMemo(()=>{
        let _bool = false
        for (let i = 0; i < originalAccess.length; i++) {
            for (let j = 0; j < access.length; j++) {
                if(originalAccess[i] == access[j]){
                    _bool = false
                }else{
                    _bool = true
                }
            }

        }
console.log(_bool)
        return _bool
    }, [access, originalAccess])

    return {
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
        updateValid
    };
}


export default useRoleAndPermission
