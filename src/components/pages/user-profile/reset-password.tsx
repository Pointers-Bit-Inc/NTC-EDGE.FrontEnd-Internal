import React, { Component } from "react";
import {StyleSheet, View, Text, TextInput} from "react-native";
import Button from "@atoms/button";
import axios from "axios";
import {BASE_URL} from "../../../services/config";
import {RootStateOrAny, useSelector} from "react-redux";

function ResetPassword({navigation}) {
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [oldPassword, setOldPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const config = {
        headers: {
            Authorization: "Bearer ".concat(user?.sessionToken)
        }
    }
          const newPasswordFn = () =>{
              axios.patch(BASE_URL + "/user/profile/change-password", {
                  oldPassword,
                  newPassword
              } ,config).then((response) =>{
                  
              })
          }
    return (
        <View style={styles.container}>
            <View style={styles.group2}>
                <View style={styles.group}>
                    <View style={styles.rect}>
                        <Text onPress={() =>navigation.goBack()}  style={styles.close}>Close</Text>
                    </View>
                </View>
               <View >
                   <Text style={styles.resetPassword}>Reset Password</Text>

                   <TextInput
                       onChangeText={setOldPassword}
                       value={oldPassword}
                       placeholder="Old Password"
                       style={styles.textInput}
                       secureTextEntry

                   ></TextInput>
                   <TextInput
                       secureTextEntry
                       onChangeText={setNewPassword}
                       value={newPassword}
                       placeholder="New Password"
                       style={styles.textInput}
                   ></TextInput>

               </View>
                <View style={styles.bottomContainer}>
                    <Button onPress={()=>{
                        newPasswordFn()
                    }}  style={styles.button}>
                        <Text style={styles.buttonLabel}>Submit</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
   
    bottomContainer:{


    },
    buttonLabel: {
        color:'#F6F7F8'
    },
    button: {

        backgroundColor: '#0050FF',
        borderRadius: 4
    },
    container: {
        flex: 1,
          paddingLeft: 21,
        paddingRight: 22,
        backgroundColor: "#fff"
    },
    group2: {
        justifyContent: "space-between",
        marginTop: 62
    },
    group: {
        height: 35
    },
    rect: {
        justifyContent: "flex-end",
        flexDirection: "row"
    },
    close: {
        color: "#121212",
        textAlign: "left",
        fontSize: 18,
        width: 55,
        marginTop: 10
    },
    resetPassword: {
        marginTop: 21,

        color: "#121212",
        fontSize: 24,
        alignSelf: "stretch"
    },
    textInput: {
        backgroundColor: "#fff",
        height: 40,
        borderWidth: 1,
        borderColor: "#121212",
        borderRadius: 4,
        padding: 10,
        marginTop: 5,
        marginBottom: 5
    },
});

export default ResetPassword;
