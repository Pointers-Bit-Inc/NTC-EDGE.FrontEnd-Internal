import {ActivityIndicator , StyleSheet , Text , TouchableOpacity , TouchableWithoutFeedback , View} from "react-native";
import {DECLINED} from "../../../../reducers/activity/initialstate";
import React , {useState} from "react";
import {Bold} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";
import {Hoverable} from "react-native-web-hooks";

export function DeclineButton(props: { currentLoading: string, allButton: boolean, onPress: () => void }) {
    const [pressed, setPressed] = useState(false)
    return <Hoverable>
        { isHovered => (
            <View style={{flex: 1}}>
        <TouchableWithoutFeedback
            onPressIn={()=>setPressed(true)}
            onPressOut={()=>setPressed(false)}
            disabled={(props.currentLoading === DECLINED || props.allButton)}
            onPress={props.onPress}
        >
            <View
                style={[
                    styles.rect24,
                    {
                        backgroundColor:props.allButton ?  "#fff" :  isHovered ? "#DE7C8D" : "#fff" ,
                        height: undefined,
                        paddingVertical: props.currentLoading === DECLINED ? fontValue(8.5) : fontValue(9),
                        borderWidth: 2,
                        borderColor: (props.allButton) ? "#C4C4C4" : "rgba(194,0,0,1)",
                    }]
                }>

                {
                    props.currentLoading === DECLINED ? (
                        <ActivityIndicator color={"rgba(194,0,0,1)"} size={"small"}/>
                    ) : (
                        <Text
                            style={[styles.endorse, {
                                fontFamily: Bold,
                                color: (props.allButton) ? "#C4C4C4" : isHovered ? "#fff" : "rgba(194,0,0,1)",
                            }]}>Decline</Text>
                    )
                }
            </View>
        </TouchableWithoutFeedback>
    </View> ) }
    </Hoverable>;
}

const styles = StyleSheet.create({
    rect24: {
        height: 31,
        borderRadius: fontValue(24)
    },
    endorse: {
        fontSize: fontValue(12),
        textAlign: "center",
    }
})
