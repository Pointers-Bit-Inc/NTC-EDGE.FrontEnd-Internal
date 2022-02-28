import {Text, TouchableOpacity, View, Animated} from "react-native";
import {styles} from "@pages/activities/styles";
import SearchIcon from "@assets/svg/search";
import React , {useEffect , useState} from "react";
import {setTabBarHeight} from "../../../reducers/application/actions";
import {useComponentLayout} from "@pages/activities/hooks/useComponentLayout";
import {RFValue} from "react-native-responsive-fontsize";
import {Regular} from "@styles/font";

 export const FakeSearchBar = (props: { onSearchLayoutComponent,  animated,  onPress: () => void, searchVisible: boolean }) => {

     return <Animated.View onLayout={ props.onSearchLayoutComponent}  style={[styles.searcg, props.animated]}>
        <View style={[styles.rect26, {height: undefined, paddingHorizontal: 30, paddingVertical: 10}]}>
            <TouchableOpacity onPress={props.onPress}>
                {!props.searchVisible &&
                <View style={[styles.rect7, {marginTop: 0, width: "100%", marginLeft: 0}]}>
                    <View style={styles.iconRow}>

                        <SearchIcon height={RFValue(20)} width={RFValue(20)} style={styles.icon}></SearchIcon>

                        <View

                            style={styles.textInput}

                        >
                            <Text style={{fontFamily: Regular, fontSize: RFValue(12), color: "rgba(128,128,128,1)",}}>Search</Text>
                        </View>

                    </View>
                </View>
                }
            </TouchableOpacity>
        </View>
    </Animated.View>;
}