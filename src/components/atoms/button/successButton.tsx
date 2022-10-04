import {StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import React, {useState} from "react";
import {Bold} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {Hoverable} from "react-native-web-hooks";

export const SuccessButton = (props: { onPress: () => void, name: string }) => {
    const [pressed, setPressed] = useState(false)
    return <Hoverable>
        {isHovered => (<View
            style={{ paddingRight: 5}}>
            <TouchableWithoutFeedback
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                onPress={props.onPress}
            >
                <View style={[styles.rect22, {
                    borderColor: (pressed) ? "transparent" : isHovered ? "#4DFBC5" : "transparent",
                    borderWidth: isHovered ? 4 : undefined,
                    backgroundColor: (pressed ? "#097352" : "rgba(0,171,118,1)"),
                    maxHeight: undefined,
                    paddingVertical: isHovered ? fontValue(6.5) : fontValue(10.5)
                }]}>
                    <Text
                        style={[styles.approved, {
                            fontFamily: Bold,
                            color: "rgba(255,255,255,1)",
                        }]}>
                        {props.name}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        </View>)}
    </Hoverable>;
}
const styles = StyleSheet.create({
    rect22: {

        borderRadius: fontValue(24)
    },
    approved: {
        fontSize: fontValue(12),
        textAlign: "center",
        alignSelf: "center"
    },
})
