import {ActivityIndicator , StyleSheet , Text , TouchableOpacity , TouchableWithoutFeedback , View} from "react-native";
import {FOREVALUATION} from "../../../../reducers/activity/initialstate";
import ForwardIcon from "@assets/svg/forward";
import React , {useEffect , useState} from "react";
import {Bold} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";
import {Hoverable} from "react-native-web-hooks";

export function EndorsedButton(props: { currentLoading: string, allButton: boolean, onPress: () => void }) {
   const [pressed, setPressed] = useState(false)

    return  <Hoverable>
        { isHovered => (<View style={{flex: 0.8,}}>
        <TouchableWithoutFeedback
            onPressIn={()=>setPressed(true)}
            onPressOut={()=>setPressed(false)}
            disabled={(props.currentLoading === FOREVALUATION || props.allButton)}
            onPress={props.onPress}
        >
            <View style={[{
                width: "85%",
                alignSelf: "flex-end",
                borderWidth: (props.allButton || isHovered) ? 2 :  1,
                borderRadius: fontValue(24),
                borderColor: props.allButton   ? "#c4c4c4" :  pressed ? "#041B6E" :  isHovered ? "#7792F3" : "#c4c4c4",
                backgroundColor:  props.allButton  ? "#fff" :  pressed ? "#041B6E" :  isHovered ? "#E0E7FE" : "#fff",
                height: undefined,
                paddingVertical: props.currentLoading === FOREVALUATION ? fontValue(8.5) : (props.allButton || isHovered) ?  fontValue(9) : fontValue(10)
            }]}>
                <View
                    style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    {
                        props.currentLoading === FOREVALUATION ? (
                            <ActivityIndicator color={"white"} size={"small"}/>
                        ) : (
                            <Text style={[styles.endorse, {
                                fontFamily: Bold,
                                color: (props.allButton) ? "#C4C4C4" : pressed ? "#fff" : "#031A6E",
                            }]}>Endorse</Text>

                        )
                    }
                    <ForwardIcon isdisable={props.allButton  } color={pressed && "#fff"} style={{marginLeft: 6}}/>
                </View>

            </View>
        </TouchableWithoutFeedback>
    </View>) }
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
    },
})
