import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {Animated, AsyncStorage, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import BackSpaceIcon from "@assets/svg/backspace";
import CloseCircleIcon from "@assets/svg/closeCircle";
import SearchLoading from "@assets/svg/searchLoading";
import {styles} from "@pages/activities/search/styles";
import {RootStateOrAny, useSelector} from "react-redux";
const {height} = Dimensions.get('screen');

export function SearchActivity(props: { onPress: () => void, value: string, onEndEditing: () => void, onChange: (event) => void, onChangeText: (text) => void, onPress1: () => void, translateX: any, nevers: [], callbackfn: (search, index) => JSX.Element }) {
    const inputRef = useRef(null);
    const {tabBarHeight} = useSelector((state: RootStateOrAny) => state.application)
    const onFocusHandler = () => {
        inputRef.current && inputRef.current.focus();
    }
      useEffect(() =>{
          onFocusHandler()
      }, [])
     const [height_, setHeight_] = useState(0)
    return <View style={styles.container}>
        <View   onLayout={(event)=>{
            console.log(event.nativeEvent.layout.height)
            if( height_ > 0 && height_ < 200){
                setHeight_(event.nativeEvent.layout.height)

            }

        }
        }    style={styles.group9}>
            <View  style={styles.group4}>
                <View style={styles.rect}>
                    <View style={styles.group2}>
                        <TouchableOpacity style={{paddingRight: 10}} onPress={props.onPress}>
                            <BackSpaceIcon
                                style={styles.icon}
                            ></BackSpaceIcon>
                        </TouchableOpacity>

                        <View style={styles.group}>
                            <View style={styles.rect2Stack}>
                                <View style={styles.rect2}></View>
                                <View style={styles.group3}>
                                    <View style={styles.textInputStack}>
                                        <TextInput
                                            ref={inputRef}
                                            value={props.value}
                                            onEndEditing={props.onEndEditing}
                                            onChange={props.onChange}
                                            onChangeText={props.onChangeText}
                                            placeholder="Search"
                                            style={styles.textInput}
                                        ></TextInput>
                                        {props.value.length ?  <TouchableOpacity onPress={props.onPress1
                                        }>
                                            <CloseCircleIcon
                                                style={styles.icon2}
                                            ></CloseCircleIcon>
                                        </TouchableOpacity> : <></>}

                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            {props.value.length > 0 && <View style={styles.rect4}>
                <Animated.View style={[{
                    transform: [
                        {
                            translateX: props.translateX
                        }
                    ]
                }]}>
                    <SearchLoading/>
                </Animated.View>
            </View>}


        </View>
        {props.value.length < 1 && <View style={styles.group8}>
            <View style={styles.rect3}>
                <View style={styles.group7}>
                    <Text style={styles.recentSearches}>{props.nevers.length ? "Recent Searches" : ""}</Text>
                    <View style={{justifyContent: "center",}}>
                        <ScrollView style={{maxHeight: height-40-120-tabBarHeight}}   showsVerticalScrollIndicator={false}>
                            {props.nevers.map(props.callbackfn)}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>}
    </View>;
}
