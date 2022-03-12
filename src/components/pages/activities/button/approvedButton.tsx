import {ActivityIndicator , StyleSheet , Text , TouchableOpacity , TouchableWithoutFeedback , View} from "react-native";
import {APPROVED , CASHIER} from "../../../../reducers/activity/initialstate";
import React , {useState} from "react";
import {Bold} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";
import {Hoverable} from "react-native-web-hooks";
import {getRole} from "@pages/activities/script";

export const ApprovedButton = (props: { currentLoading: string, allButton: boolean, onPress: () => void, user: any }) => {
    const [pressed, setPressed] = useState(false)
    return <Hoverable>
        { isHovered => (<View
        style={ { flex : 1 , paddingRight : 5 } }>
        <TouchableWithoutFeedback
            onPressIn={()=>setPressed(true)}
            onPressOut={()=>setPressed(false)}
            disabled={ props.currentLoading === APPROVED || props.allButton }
            onPress={ props.onPress }
        >
            <View style={ [styles.rect22 , {
                borderColor: (props.allButton || pressed) ? "transparent" :   isHovered && "#4DFBC5",
                 borderWidth:  isHovered ? 4 :  undefined,
                backgroundColor : (
                    props.allButton ? "#C4C4C4" : pressed ? "#097352" :  "rgba(0,171,118,1)") ,
                height : undefined ,
                paddingVertical : props.currentLoading === APPROVED ? fontValue(9) : isHovered ? fontValue(6.5)  : fontValue(10.5)
            }] }>
                {
                    props.currentLoading === APPROVED ? (
                        <ActivityIndicator color={ "white" } size={ "small" }/>
                    ) : (
                        <Text
                            style={ [styles.approved , {
                                fontFamily: Bold,
                                color : props.allButton ? "#FCFCFC" : "rgba(255,255,255,1)" ,
                            }] }>
                            {getRole(props.user , [CASHIER]) ? 'Confirm' : 'Approve'}
                        </Text>
                    )
                }
            </View>
        </TouchableWithoutFeedback>
    </View>) }
    </Hoverable>;
}
const styles = StyleSheet.create({
    rect22: {
        
        borderRadius: 24
    },
    approved: {
        textAlign: "center",
        alignSelf: "center"
    },
})
