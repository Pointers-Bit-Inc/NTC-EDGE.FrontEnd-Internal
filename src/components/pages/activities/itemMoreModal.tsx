import React, { Component } from "react";
import {StyleSheet, View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import PinToTopIcon from "@assets/svg/pintotop";
import BellMuteIcon from "@assets/svg/bellMute";
import ArchiveIcon from "@assets/svg/archive";
import DeleteIcon from "@assets/svg/delete";
import CloseIcon from "@assets/svg/close";

function ItemMoreModal(props:any) {
    const applicant = props?.details?.applicant?.user

    return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {

                }}>

                   <View style={styles.container}>
                       <TouchableWithoutFeedback onPressOut={props.onDismissed}>
                           <View style={[props.visible ? {
                               position: "absolute",
                               top: 0,
                               left: 0,
                               width: '100%',
                               height: '100%',
                               backgroundColor: "rgba(0, 0, 0, 0.5)",
                           }: {}]}>
                           </View>
                       </TouchableWithoutFeedback>
                       <View style={styles.rect}>
                           <View style={styles.group7}>

                               <View style={[styles.name]}>
                                  
                                   <View style={{flexDirection: "column" , justifyContent: "center", alignItems: "center"}}>
                                       <Text style={styles.centerName} >{`${applicant?.firstName} ${applicant?.lastName}`}</Text>
                                       <Text style={{fontSize: 14, color: "#626a7e", fontWeight: '400'}}>{props?.details?.applicationType}</Text>
                                   </View>



                               </View>


                               <View style={styles.group6}>
                                   <View style={styles.group5}>
                                       <TouchableOpacity>
                                           <View style={styles.group3}>
                                               <View style={styles.group4}>
                                                   <PinToTopIcon
                                                       style={styles.icon1}
                                                   />
                                                   <Text style={styles.pinToTop1}>Pin to top</Text>
                                               </View>
                                           </View>
                                       </TouchableOpacity>
                                       <TouchableOpacity>
                                           <View style={styles.group3}>
                                               <View style={styles.group4}>
                                                   <BellMuteIcon
                                                       style={styles.icon1}
                                                   />
                                                   <Text style={styles.pinToTop1}>Mute</Text>
                                               </View>
                                           </View>
                                       </TouchableOpacity>
                                       <TouchableOpacity>
                                           <View style={styles.group3}>

                                               <View style={styles.group4}>
                                                   <ArchiveIcon
                                                       style={styles.icon1}
                                                   />
                                                   <Text style={styles.pinToTop1}>Archive</Text>
                                               </View>
                                           </View>
                                       </TouchableOpacity>
                                       <TouchableOpacity>
                                           <View style={styles.group3}>

                                               <View style={[styles.group4, {borderBottomColor: undefined, borderBottomWidth: 0}]}>
                                                   <DeleteIcon
                                                       style={styles.icon1}
                                                   />
                                                   <Text style={[styles.pinToTop1, {color: '#CF0327'}]}>Delete</Text>
                                               </View>
                                           </View>
                                       </TouchableOpacity>

                                   </View>
                               </View>
                           </View>
                       </View>
                   </View>


            </Modal>

    );
}

const styles = StyleSheet.create({
    centerName:{
        color: "#1F2022",
        fontSize: 20,
           fontWeight: "600"
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    rect: {
        height: "45%",
        backgroundColor: "rgba(255,255,255,1)",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    group7: {
        padding: 20
    },
    name: {
       paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

    },
    group6: {
        height: 15,
        alignSelf: "stretch"
    },
    group5: {
        justifyContent: "flex-start"
    },
    group2: {
        height: 62,
        justifyContent: "space-between",
        marginRight: 0,
        marginLeft: 0,
        alignSelf: "stretch"
    },
    rect9: {
        height: 1,
        alignSelf: "stretch"
    },
    group: {
        width: 116,
        height: 25,

        flexDirection: "row",
        justifyContent: "flex-end"
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 25,
        width: 14,
        alignSelf: "center"
    },
    pinToTop: {

        color: "#121212",
        fontSize: 18
    },
    rect7: {
        height: 1,
        backgroundColor: "rgba(234,234,234,1)",
        alignSelf: "stretch"
    },
    group3: {
        justifyContent: "space-between",
        marginRight: 0,
        marginLeft: 0,
        alignSelf: "stretch"
    },
    rect10: {
        height: 1,
        alignSelf: "stretch"
    },
    group4: {
        borderBottomWidth: 1,
        borderBottomColor: "rgba(234,234,234,1)",
          paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    icon1: {
        color: "rgba(128,128,128,1)",
        fontSize: 25,
        marginRight: 21,
       
        alignSelf: "center"
    },
    pinToTop1: {

        color: "#121212",
        fontSize: 18
    },
});

export default ItemMoreModal;
