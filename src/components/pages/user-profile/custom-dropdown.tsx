import React from "react";
import {StyleSheet, Text, View} from "react-native";
import CheckItemIcon from "@assets/svg/checkitem";
import InputField from "@molecules/form-fields/input-field";
import InputStyles from "@styles/input-style";
import {text} from "@styles/color";

function CustomDropdown(props: any) {
    return (
        <>
            <InputField
                label={"Address"}
            type={"input"}
                outlineStyle={InputStyles.outlineStyle}
            activeColor={text.primary}
            errorColor={text.error}
            requiredColor={text.error}
            />
            <View style={styles.container}>
                <View style={styles.group3}>
                    <View style={styles.rect}>
                        {props.items && props.items.map((item:any, index:number) =>{
                           return <View style={styles.group2}>
                                <View style={styles.rect2}>
                                    <View style={styles.group}>
                                        <View style={styles.checkmark}>
                                            <CheckItemIcon></CheckItemIcon>
                                        </View>
                                        <Text style={styles.role}>{item?.name}</Text>
                                    </View>
                                </View>
                            </View>
                        }) }


                    </View>
                </View>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        zIndex: 1,
        flex: 1,
        position: "absolute"
    },
    group3: {
        marginTop: "18%",

    },
    rect: {
        width: 345,
        height: "100%",
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(25,59,103,0.05)",
        borderRadius: 4,
        shadowColor: "rgba(28,55,90,1)",
        shadowOffset: {
            width: 0,
            height: 2
        },
        elevation: 30,
        shadowOpacity: 0.16,
        shadowRadius: 10
    },
    group2: {
        width: 334,
        marginTop: 4,
        marginLeft: 6
    },
    rect2: {
        width: 334,
        height: 43,
        backgroundColor: "rgba(22,118,243,0.1)",
        borderRadius: 4
    },
    group: {
        width: 109,
        height: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        marginLeft: 9
    },
    checkmark: {
        width: 20,
        height: 20,
        alignSelf: "center"
    },
    role: {
        color: "rgba(24,39,58,1)",
        alignSelf: "center"
    }
});

export default CustomDropdown;
