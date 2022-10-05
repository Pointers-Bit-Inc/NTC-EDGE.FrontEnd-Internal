import {StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import React, {useState} from "react";
import {Bold} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {Hoverable} from "react-native-web-hooks";

export function DeclineButton(props: { onPress: () => void, name: string }) {
    const [pressed, setPressed] = useState(false)
    return <Hoverable>
        {isHovered => (
            <View style={{flex: 1, paddingHorizontal: 6}}>
                <TouchableWithoutFeedback
                    onPressIn={() => setPressed(true)}
                    onPressOut={() => setPressed(false)}

                    onPress={props.onPress}
                >
                    <View
                        style={[
                            styles.rect24,
                            {
                                backgroundColor: isHovered ? "#DE7C8D" : "#fff",
                                height: undefined,
                                borderWidth: 2,
                                borderColor: "rgba(194,0,0,1)",
                            }]
                        }>

                        (
                        <Text
                            style={[styles.endorse, {

                                fontFamily: Bold,
                                color: isHovered ? "#fff" : "rgba(194,0,0,1)",
                            }]}>{props.name}</Text>
                        )

                    </View>
                </TouchableWithoutFeedback>
            </View>)}
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
