import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, TouchableOpacity, Modal, Alert} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import Dropdown from "@atoms/dropdown";
import axios from "axios";
import EndorseToIcon from "@assets/svg/endorseTo";
import {SWAGGER_URL} from "../../../services/config";
import {RootStateOrAny, useSelector} from "react-redux";
import {FOREVALUATION} from "../../../reducers/activity/initialstate";
function Endorsed(props:any) {

    const user = useSelector((state: RootStateOrAny) => state.user);
    const [pickedEndorsed, setPickedEndorsed] = useState<any[]>()
    const [endorsed, setEndorsed] = useState()
    useEffect(()=>{
        axios.get(SWAGGER_URL + '/users' ,
            {
                headers: {
                    Authorization: "Bearer ".concat(user.sessionToken)
                }
            }).then((response)=>{
            const filterResponse = [...response.data].filter((item) =>{
                return (["director", 'evaluator'].indexOf(item?.role?.key) != -1)
            })

            const res = filterResponse.map((item) =>{
                return {value: item._id, label: item.firstName + " " + item.lastName}
            })

            setPickedEndorsed(res)
            if(res){
                setEndorsed(res[0]?.value)
            }

        })
    }, [])
    const onEndorseConfirm = () =>{
        const endorse = pickedEndorsed?.find(picked => {
            return picked.value == endorsed
        })

        Alert.alert(
            "Alert",
            "are you sure you want to endorse to " + endorse?.label ,
            [
                {
                    text: "OK",
                    onPress:  () => {
                         props.onChangeApplicationStatus(FOREVALUATION)
                        props.onDismissed()
                    } ,
                    style: "default"
                },

                {
                    text: "Cancel",
                    onPress: () => {

                    },
                    style: "destructive"
                },
            ]
        );
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}

            onRequestClose={() => {
            }}>
        <View style={styles.container}>
            <View style={styles.rectFiller}></View>
            <View style={styles.rect}>
                <View style={styles.iconColumn}>
                    <TouchableOpacity onPress={()=>{
                        props.onDismissed()
                    }}>
                        <Ionicons name="md-close" style={styles.icon}></Ionicons>
                    </TouchableOpacity>

                    <View style={styles.group}>
                        <View style={styles.icon2Row}>
                            <EndorseToIcon style={styles.icon2}/>
                            <Text style={styles.endorseTo}>Endorse to</Text>
                        </View>
                    </View>
                    <View  style={[styles.rect5]}>
                        <Dropdown value={endorsed} onChangeValue={(value: any) => {

                            setEndorsed(value)}
                        }
                                  placeholder={{}}
                                  items={pickedEndorsed}></Dropdown>
                    </View>

                </View>
                <View style={styles.iconColumnFiller}></View>
                <View style={styles.rect6}>
                    <TouchableOpacity onPress={() =>{
                        onEndorseConfirm()
                    }}>
                        <Text style={styles.confirm}>Confirm</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rectFiller: {
        flex: 1
    },
    rect: {
        height: 540,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 17
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 25,
        marginLeft: 4
    },
    group: {
        width: 138,
        height: 30,
        flexDirection: "row",
        marginTop: 17
    },
    icon2: {
        color: "rgba(128,128,128,1)",
        fontSize: 30
    },
    endorseTo: {

        color: "#121212",
        fontSize: 20,
        marginLeft: 12,
        marginTop: 3
    },
    icon2Row: {
        height: 30,
        flexDirection: "row",
        flex: 1
    },
    rect5: {
        width: 355,
        height: 50,
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(202,210,225,1)",
        borderRadius: 6,
        padding: 5,
        marginTop:  9,
    },
    iconColumn: {
        width: 337,
        marginTop: 13,
        marginLeft: 16
    },
    iconColumnFiller: {
        flex: 1
    },
    rect6: {
        height: 43,
        backgroundColor: "#2f5cfa",
        borderRadius: 6,
        marginBottom: 90,
        marginLeft: 23,
        marginRight: 23
    },
    confirm: {
        color: "rgba(255,255,255,1)",
        marginTop: 14,
        marginLeft: 140
    }
});

export default Endorsed;
