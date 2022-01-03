import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    AsyncStorage,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import HistoryIcon from "@assets/svg/historyIcon";
import CloseIcon from "@assets/svg/close";

import _ from "lodash";
import {SearchActivity} from "@pages/activities/search/searchActivity";

import {styles} from '@pages/activities/search/styles'

function Search(props: any) {


    const [textInput, setTextInput] = useState("")
    const [searchHistory, setSearchHistory] = useState<[]>([])


    useEffect(async () => {

        await AsyncStorage.getItem('searchHistory').then((value) => setSearchHistory(JSON.parse(value) || []))

    }, []);
    const removeSearchHistory = async (index: number) => {

        let newArr = [...searchHistory],
            removeIndexArray = [...newArr.slice(0, index), ...newArr.slice(index + 1)]
        setSearchHistory(removeIndexArray)

        await AsyncStorage.setItem(
            'searchHistory',
            JSON.stringify(removeIndexArray)
        )
    }
    const handler = useCallback(_.debounce((text: string) => setText(text), 1000), []);
    const setText = async (text: string) => {
        if (!text.trim()) return
        try {

            await AsyncStorage.getItem('searchHistory').then(async (value) => {
                value = JSON.parse(value) || []

                let newArr = [...value, text];
                await AsyncStorage.setItem(
                    'searchHistory',
                    JSON.stringify(newArr)
                );

                setSearchHistory(newArr)
                props.loadingAnimation(false)
                props.onSearch(text)


            })


        } catch (error) {
            // Error saving data
        }
    }
    return (
        <SearchActivity onPress={() => {
            props.onDismissed()
        }} value={textInput} onEndEditing={() => {
            props.loadingAnimation(true)
            props.animate()
        }} onChange={(event) => {
            handler(event.nativeEvent.text)

        }} onChangeText={(text) => {
            props.animate()
            setTextInput(text)
        }} onPress1={() => {

            setTextInput("")

        }} translateX={props.initialMove} nevers={searchHistory} callbackfn={(search, index) => {
            return <View key={index} style={styles.group6}>
                <TouchableOpacity onPress={() => {
                    props.loadingAnimation(true)
                    props.animate()

                    handler(search)
                    setTextInput(search)
                }}>
                    <View style={styles.group5}>
                        <HistoryIcon style={styles.icon3}></HistoryIcon>
                        <Text style={styles.loremIpsum}>{search}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {

                    removeSearchHistory(index)
                }}>
                    <CloseIcon width={12} height={12} style={styles.icon4}></CloseIcon>
                </TouchableOpacity>

            </View>

        }}/>

    );
}

export default Search;
