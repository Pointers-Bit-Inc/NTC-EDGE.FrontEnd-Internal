import React, {useEffect, useRef} from "react";
import {Animated, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import BackSpaceIcon from "@assets/svg/backspace";
import CloseCircleIcon from "@assets/svg/closeCircle";
import SearchLoading from "@assets/svg/searchLoading";
import {styles} from "@pages/activities/search/styles";
const {height} = Dimensions.get('window');

export function SearchActivity(props: { onPress: () => void, value: string, onEndEditing: () => void, onChange: (event) => void, onChangeText: (text) => void, onPress1: () => void, translateX: any, nevers: [], callbackfn: (search, index) => JSX.Element }) {
    const inputRef = useRef(null);
    const onFocusHandler = () => {
        inputRef.current && inputRef.current.focus();
    }
    useEffect(() => {
        onFocusHandler();
    }, []);
    return <View style={styles.container}>
        <View style={styles.group9}>
            <View style={styles.group4}>
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
                                        <TouchableOpacity onPress={props.onPress1
                                        }>
                                            <CloseCircleIcon
                                                style={styles.icon2}
                                            ></CloseCircleIcon>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.rect4}>
                <Animated.View style={[{
                    transform: [
                        {
                            translateX: props.translateX
                        }
                    ]
                }]}>
                    <SearchLoading/>
                </Animated.View>
            </View>

            {props.value.length < 1 && <View style={styles.group8}>
                <View style={styles.rect3}>
                    <View style={styles.group7}>
                        <Text style={styles.recentSearches}>Recent Searched</Text>
                        <View style={{height: height - 115 - 5 - 30 - 30 - 30 - 20}}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {props.nevers.map(props.callbackfn)}
                            </ScrollView>
                        </View>


                    </View>
                </View>
            </View>}
        </View>
    </View>;
}
