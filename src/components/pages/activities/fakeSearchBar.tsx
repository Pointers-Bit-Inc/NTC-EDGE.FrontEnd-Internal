import {Text , TouchableOpacity , View , Animated , useWindowDimensions} from "react-native";
import {styles} from "@pages/activities/styles";
import SearchIcon from "@assets/svg/search";
import React from "react";
import {Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";

 export const FakeSearchBar = (props: { onSearchLayoutComponent,  animated,  onPress: () => void, searchVisible: boolean }) => {
     const dimensions = useWindowDimensions();
     return <Animated.View onLayout={ props.onSearchLayoutComponent}  style={[styles.searcg, props.animated]}>
        <View style={[styles.rect26, {paddingVertical: isMobile || dimensions?.width < 800 ?  10 : undefined } ]}>
            <TouchableOpacity onPress={props.onPress}>
                {!props.searchVisible &&
                <View style={[styles.rect7, {marginTop: 0, width: "100%", marginLeft: 0}]}>
                    <View style={styles.iconRow}>

                        <SearchIcon height={fontValue(20)} width={fontValue(20)} style={styles.icon}></SearchIcon>

                        <View

                            style={styles.textInput}

                        >
                            <Text style={{fontFamily: Regular, fontSize: fontValue(12), color: "rgba(128,128,128,1)",}}>Search</Text>
                        </View>

                    </View>
                </View>
                }
            </TouchableOpacity>
        </View>
    </Animated.View>;
}