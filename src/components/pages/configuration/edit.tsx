import React from "react";
import Header from "@molecules/header";
import {Image, TouchableOpacity, View} from "react-native";
import {text} from "@styles/color";
import Text from "@atoms/text";
import {styles} from "@pages/activities/styles";
import {UploadIcon} from "@atoms/icon";
import useConfiguration from "../../../hooks/useConfiguration";

const EditConfigurationScreen = (props) => {

    const {
        onPress,
        region,
        onClose,
    } = useConfiguration(props);
    return <View style={[{flex: 1, backgroundColor: "#fff",}]}>

        <Header size={24} title={"Region: " + region?.label || ""}>
            <TouchableOpacity onPress={onClose}>
                <Text>Close</Text>
            </TouchableOpacity>
        </Header>

        <View style={{
            flex: 1,
            flexDirection: "row"
        }}>
            <View style={{padding: 20, justifyContent: 'space-between', alignItems: 'center',}}>
                <TouchableOpacity onPress={() => onPress('director')}>
                    <View style={styles.border}>
                        <Image resizeMode={"contain"}
                               source={region?.configuration ? {
                                   uri: region?.configuration?.director?.signature,
                               } : require('@assets/avatar.png')}
                               style={{height: 200, width: 200}}/>
                    </View>

                    <View style={styles.uploadSignature}>
                        <UploadIcon color={text.info}/>
                        <Text>Director Signature</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{padding: 20, justifyContent: 'space-between', alignItems: 'center',}}>
                <TouchableOpacity onPress={() => onPress('commissioner')}>
                    <View style={styles.border}>
                        <Image resizeMode={"stretch"}
                               source={ region?.configuration ? {
                                   uri: region?.configuration?.commissioner?.signature,
                               } : require('@assets/avatar.png')}
                               style={{height: 200, width: 200, zIndex: 1}}/>
                    </View>
                    <View style={styles.uploadSignature}>
                        <UploadIcon color={text.info}/>
                        <Text>Commissioner Signature</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
        {/*  <View style={{alignItems: "center"}}>
                        <TouchableOpacity onPress={() => onUpdateCreateRegion('patch')} disabled={!updateValid}
                                          style={{
                                              backgroundColor: updateValid ? successColor : disabledColor,
                                              paddingVertical: 10,
                                              paddingHorizontal: 20,
                                              borderRadius: 10
                                          }}>


                        </TouchableOpacity>
                    </View>*/}


    </View>
}


export default EditConfigurationScreen
