import React from "react";
import Header from "@molecules/header";
import {Animated, ScrollView, TouchableOpacity, View} from "react-native";
import {disabledColor, successColor} from "@styles/color";
import Text from "@atoms/text";
import {styles} from "@pages/activities/styles";
import useRoleAndPermission from "../../../hooks/useRoleAndPermission";
import {setRole} from "../../../reducers/role/actions";
import {isMobile} from "@pages/activities/isMobile";
import RoleChecklist from "@pages/role-and-permission/RoleCheckList";

const EditRoleAndPermissionScreen = (props) => {
    const {
        dispatch,
        role,
        access,
        setAccess,
        onParseAccess,
        updateValid,
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
        <Header size={24} title={"Role: " + role?.name}>
            <TouchableOpacity onPress={() => {
                if (props.navigation.canGoBack() && isMobile) props.navigation.goBack()
                dispatch(setRole({}))
            }
            }>
                <Text>Close</Text>
            </TouchableOpacity>
        </Header>
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
            <TouchableOpacity disabled={!updateValid} style={{
                backgroundColor: updateValid ? successColor : disabledColor,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10
            }} onPress={onParseAccess}>

                <Text style={[styles.text, {color: "#fff"}]} size={14}>Update</Text>

            </TouchableOpacity>
        </View>


    </View>
}


export default EditRoleAndPermissionScreen
