import React from "react";
import {Animated, ScrollView, TouchableOpacity, View} from "react-native";
import Header from "@molecules/header";
import {setRole} from "../../../reducers/role/actions";
import Text from "@atoms/text";
import {InputField} from "@molecules/form-fields";
import {disabledColor, successColor} from "@styles/color";
import {styles} from "@pages/activities/styles";
import useRoleAndPermission from "../../../hooks/useRoleAndPermission";
import {isMobile} from "@pages/activities/isMobile";
import RoleChecklist from "@pages/role-and-permission/RoleCheckList";

const CreateRoleAndPermissionScreen = (props) => {
    const {
        dispatch,
        role,
        access,
        setAccess,
        setCreateRole,
        createRoleInput,
        setCreateRoleInput,
        onCreateAccess,
        background,
        success,
        alertConfirm,
        alertCancel,
        display,
        animation
    } = useRoleAndPermission(props.navigation);
    return <View style={[{flex: 1, backgroundColor: "#fff",}]}>
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
                    <View style={styles.modalHeader}/>
                    <Text style={styles.headerText}>Successfully Updated!</Text>
                    <Text style={styles.regularText}>

                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancel]}
                            onPress={() => {
                                Animated.spring(animation, {
                                    toValue: 0,
                                    useNativeDriver: false,
                                }).start();
                                alertCancel()
                            }}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
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
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </Animated.View>
        <Header size={24} title={"Create Role and Permission"}>
            <TouchableOpacity onPress={() => {
                if (props.navigation.canGoBack() && isMobile) props.navigation.goBack()
                dispatch(setRole({}))
            }
            }>
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
            <TouchableOpacity
                style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}}
                onPress={onCreateAccess}>

                <Text style={[styles.text, {color: "#fff"}]} size={14}>Create</Text>

            </TouchableOpacity>
        </View>


    </View>
}

export default CreateRoleAndPermissionScreen
