import {StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import React, {useState} from "react";
import {Bold} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {Hoverable} from "react-native-web-hooks";

export function SuccessButton(props: { onPress: () => void, name: string }) {
    const [pressed, setPressed] = useState(false)
    return <Hoverable>
        {isHovered => (

                <TouchableWithoutFeedback

                    onPressIn={() => setPressed(true)}
                    onPressOut={() => setPressed(false)}

                    onPress={props.onPress}
                >
                    <View
                        style={[
                            styles.rect24,
                            {
                                borderColor: (pressed) ? "transparent" : isHovered ?  "#4DFBC5" : "transparent",
                                padding: 15,
                                borderWidth:  isHovered ? 4 :  undefined,
                                backgroundColor : (pressed ? "#097352" :  "rgba(0,171,118,1)") ,
                            }]
                        }>

                        <Text
                            style={[styles.endorse, {

                                fontFamily: Bold,
                                color : "#FCFCFC"
                            }]}>{props.name}</Text>


                    </View>
                </TouchableWithoutFeedback>)}
    </Hoverable>;
}

const styles = StyleSheet.create({
    rect24: {
        borderRadius: fontValue(24)
    },
    endorse: {
        fontSize: fontValue(12),
        textAlign: "center",
    }
})
