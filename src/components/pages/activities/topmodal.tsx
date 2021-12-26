import React, { Component } from "react";
import {StyleSheet, View, Text, Dimensions, TouchableOpacity} from "react-native";
import {Ionicons, Feather, EvilIcons, MaterialCommunityIcons} from '@expo/vector-icons'

import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setVisible, on_checked} from "../../../reducers/activity/actions";
import CalendarIcon from "@assets/svg/calendar";
import EvaluationIcon from "@assets/svg/evaluation";
import ApprovedIcon from "@assets/svg/approved";
import DeclineIcon from "@assets/svg/decline";

const window = Dimensions.get("window")

function TopModal(props:any) {
    const {visible, statusCode} = useSelector((state: RootStateOrAny) => state.activity)
    const dispatch = useDispatch()

    return (
        <View style={visible ? {
            position: "absolute",
            zIndex: 2,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        } : {}}>
            { <View style={styles.container}>
                <View style={styles.group}>
                    <View style={styles.rect2}>
                        <Text style={styles.sort}>Sort By</Text>
                    </View>
                </View>
                <View style={styles.header}>
                    <View style={styles.rect}>
                        <View style={styles.filterRow}>
                            <Text style={styles.filter}>FILTER</Text>
                            <TouchableOpacity onPress={() => {
                                dispatch(setVisible(false))
                            } }>
                                <Ionicons name="md-close" style={styles.icon}></Ionicons>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
                <View style={styles.group7}>
                    {statusCode.map((top: any, index: number)=> {
                        return<React.Fragment key={index}><View style={styles.group6}>

                            <View style={styles.group5}>
                                <View style={styles.icon4Row}>

                                    {top.iconBrand == "feather"?  <CalendarIcon width={20} height={20} fill={top.checked? "#003aa9" : "black" } />
                                        : top.iconBrand == "evil" ? <EvaluationIcon width={20} height={20} fill={top.checked? "#003aa9" : "black"}/>
                                            : top.iconBrand == "material-community" ? <ApprovedIcon width={20} height={20} fill={top.checked? "#003aa9" : "black"}/>
                                                : top.iconBrand == "ionicons" ? <DeclineIcon width={22} height={22} fill={top.checked? "#003aa9" : "black"}/>: <></>


                                    }

                                    <Text style={[styles.label, {color: top.checked ? "#003aa9" : "rgba(128,128,128,1)"}]}>{top.status}</Text>

                                </View>

                            </View>
                            <View style={styles.rect6}>
                                <View style={styles.icon6Filler}></View>
                                <TouchableOpacity onPress={() =>  dispatch(on_checked(top))}>
                                    <Ionicons
                                        name={top.checked  ? "md-radio-button-on" : "md-radio-button-off"}
                                        style={[styles.icon6, {color: top.checked ? "#003aa9" : "rgba(128,128,128,1)"}]}
                                    ></Ionicons>
                                </TouchableOpacity>

                            </View>

                        </View>
                            <View style={styles.rect7}></View>
                      </React.Fragment>
                    })}

                </View>
            </View>}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group: {
        height: 56,
        marginTop: 100
    },
    rect2: {
        height: 56,
        backgroundColor: "rgba(255,255,255,1)"
    },
    sort: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#121212",
        textAlign: "left",
        marginTop: 20,
        marginLeft: 18
    },
    header: {
        height: 100,
        marginTop: -156
    },
    rect: {
        height: 100,
        backgroundColor: "rgba(0,65,172,1)",
        flexDirection: "row"
    },
    filter: {
        fontWeight: "bold",
        color: "rgba(255,255,255,1)",
        fontSize: 16,
        marginTop: 5
    },
    icon: {
        color: "rgba(255,255,255,1)",
        fontSize: 25,
        marginLeft: 272
    },
    filterRow: {
        height: 29,
        justifyContent: "space-between",
        flexDirection: "row",
        flex: 1,
        marginRight: 20,
        marginLeft: 20,
        marginTop: 47
    },
    group7: {
        height: 58,
        marginTop: 56
    },
    group6: {
        height: 60,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row"
    },
    group5: {

        marginLeft: 18,
        alignSelf: "center"
    },
    icon4: {

        fontSize: 32
    },
    label: {
        fontWeight: "bold",
        color: "#121212",
        marginLeft: 7,
    },
    icon4Row: {
        height: 34,
        flexDirection: "row",
        marginTop: 5,
        marginRight: 7
    },
    rect7: {
        height: 2,
        backgroundColor: "#e2e2e2",
    },
    rect6: {
        height: 58,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row",
        flex: 1,
    },
    icon6Filler: {
        flex: 1,
        flexDirection: "row"
    },
    icon6: {

        color: "rgba(128,128,128,1)",
        fontSize: 25,
        marginRight: 21,
        marginTop: 15
    }
});


export default TopModal;
