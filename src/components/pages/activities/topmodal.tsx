import React, { Component } from "react";
import {StyleSheet, View, Text, Dimensions, TouchableOpacity} from "react-native";
import {Ionicons, Feather, EvilIcons, MaterialCommunityIcons} from '@expo/vector-icons'

import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setVisible, on_checked} from "../../../reducers/activity/actions";
import CalendarIcon from "@assets/svg/calendar";
import EvaluationIcon from "@assets/svg/evaluation";
import ApprovedIcon from "@assets/svg/approved";
import DeclineIcon from "@assets/svg/decline";
import lodash from 'lodash';

const window = Dimensions.get("window")

function TopModal(props:any) {
    const {visible, statusCode} = useSelector((state: RootStateOrAny) => state.activity)
    const dispatch = useDispatch()

    const renderIcon = (item) => {
        switch(item.iconBrand) {
            case 'feather': {
                return (
                    <CalendarIcon width={20} height={20} fill={item.checked? "#003aa9" : "black" } />
                );
            }
            case 'evil': {
                return (
                    <EvaluationIcon width={20} height={20} fill={item.checked? "#003aa9" : "black"}/>
                )
            }
            case 'material-community': {
                return(
                    <ApprovedIcon width={20} height={20} fill={item.checked? "#003aa9" : "black"}/>
                )
            }
            case 'ionicons': {
                return (
                    <DeclineIcon width={22} height={22} fill={item.checked? "#003aa9" : "black"}/>
                )
            }
            default: 
                return null
        }
    }

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
                <View style={styles.header1}>
                    <Text style={styles.filter1}>FILTER</Text>
                    <TouchableOpacity onPress={() => {
                        dispatch(setVisible(false))
                    } }>
                        <Ionicons name="md-close" style={styles.icon1}></Ionicons>
                    </TouchableOpacity>
                </View>
                <View style={styles.rect2_1}>
                    <Text style={styles.sort1}>Sort By</Text>
                </View>
                <View style={styles.group7_1}>
                    {statusCode.map((top: any, index: number)=> {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() =>  dispatch(on_checked(top))}
                            >
                                <View style={[
                                    styles.itemGroup,
                                    styles.item,
                                    lodash.size(statusCode) - 1 === index && {
                                        borderBottomWidth: 0,
                                    }
                                ]}>
                                    <View style={[styles.itemGroup, { paddingHorizontal: 0 }]}>
                                        {renderIcon(top)}
                                        <Text style={[styles.label1, {color: top.checked ? "#003aa9" : "rgba(128,128,128,1)"}]}>{top.status}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() =>  dispatch(on_checked(top))}>
                                        <Ionicons
                                            name={top.checked  ? "md-radio-button-on" : "md-radio-button-off"}
                                            style={[styles.icon6_1, {color: top.checked ? "#003aa9" : "rgba(128,128,128,1)"}]}
                                        ></Ionicons>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                            
                        )


                    //     return<React.Fragment key={index}><View style={styles.group6}>
                    //         <View style={styles.group5}>
                    //             <View style={styles.icon4Row}>

                    //                 {top.iconBrand == "feather"?  <CalendarIcon width={20} height={20} fill={top.checked? "#003aa9" : "black" } />
                    //                     : top.iconBrand == "evil" ? <EvaluationIcon width={20} height={20} fill={top.checked? "#003aa9" : "black"}/>
                    //                         : top.iconBrand == "material-community" ? <ApprovedIcon width={20} height={20} fill={top.checked? "#003aa9" : "black"}/>
                    //                             : top.iconBrand == "ionicons" ? <DeclineIcon width={22} height={22} fill={top.checked? "#003aa9" : "black"}/>: <></>


                    //                 }

                    //                 <Text style={[styles.label, {color: top.checked ? "#003aa9" : "rgba(128,128,128,1)"}]}>{top.status}</Text>

                    //             </View>

                    //         </View>

                    //         <View style={styles.rect6}>

                    //             <View style={styles.icon6Filler}></View>

                    //             <TouchableOpacity onPress={() =>  dispatch(on_checked(top))}>
                    //                 <Ionicons
                    //                     name={top.checked  ? "md-radio-button-on" : "md-radio-button-off"}
                    //                     style={[styles.icon6, {color: top.checked ? "#003aa9" : "rgba(128,128,128,1)"}]}
                    //                 ></Ionicons>
                    //             </TouchableOpacity>

                    //         </View>

                    //     </View>
                    //         <View style={styles.rect7}></View>
                    //   </React.Fragment>
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
    rect2_1: {
        backgroundColor: "rgba(255,255,255,1)",
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    sort: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#121212",
        textAlign: "left",
        marginTop: 20,
        marginLeft: 18
    },
    sort1: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#121212",
    },
    header: {
        height: 100,
        marginTop: -156
    },
    header1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 20,
        paddingTop: 35,
        backgroundColor: 'rgba(0,65,172,1)'
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
    filter1: {
        fontWeight: "bold",
        color: "rgba(255,255,255,1)",
        fontSize: 16,
    },
    icon: {
        color: "rgba(255,255,255,1)",
        fontSize: 25,
        marginLeft: 272
    },
    icon1: {
        color: "rgba(255,255,255,1)",
        fontSize: 25,
    },
    filterRow: {
        height: 29,
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
    group7_1: {
        backgroundColor: 'white'
    },
    group6: {
        height: 60,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row"
    },
    group5: {
        width: 110,

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
        marginTop: 5
    },
    label1: {
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
        marginLeft: 203
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
    },
    icon6_1: {
        color: "rgba(128,128,128,1)",
        fontSize: 25,
    },
    item: {
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomColor: 'rgba(128,128,128,1)',
        borderBottomWidth: 1,
        paddingHorizontal: 0,
        marginHorizontal: 15,
    },
    itemGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    itemContent: {

    },

});


export default TopModal;
