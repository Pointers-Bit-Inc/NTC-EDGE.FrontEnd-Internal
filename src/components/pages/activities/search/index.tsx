import React, {useCallback, useEffect, useState} from "react";
import {Alert, AsyncStorage, BackHandler, Text, TouchableOpacity, View} from "react-native";
import HistoryIcon from "@assets/svg/historyIcon";
import CloseIcon from "@assets/svg/close";

import _ from "lodash";
import {SearchActivity} from "@pages/activities/search/searchActivity";

import {styles} from '@pages/activities/search/styles'
import axios from "axios";
import {BASE_URL} from "../../../../services/config";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {CASHIER, CHECKER, DATE_ADDED, DIRECTOR, EVALUATOR} from "../../../../reducers/activity/initialstate";
import {formatDate, getFilter} from "@pages/activities/script";
import moment from "moment";
import Loader from "@pages/activities/bottomLoad";

function Search(props: any) {
    const {selectedChangeStatus} = useSelector((state: RootStateOrAny) => state.activity)
    const user = useSelector((state: RootStateOrAny) => state.user);

    const [page, setPage] = useState(0)
    const [size, setSize] = useState(0)
    const [total, setTotal] = useState(0)

    const [textInput, setTextInput] = useState("")
    const [searchHistory, setSearchHistory] = useState<[]>([])
    const [applications, setApplications] = useState([])
    const cashier = [CASHIER].indexOf(user?.role?.key) != -1;
    const director = [DIRECTOR].indexOf(user?.role?.key) != -1;
    const evaluator = [EVALUATOR].indexOf(user?.role?.key) != -1;
    const checker = [CHECKER].indexOf(user?.role?.key) != -1;
    const [infiniteLoad, setInfiniteLoad] = useState(false)
    const bottomLoader = () => {
        return infiniteLoad ? <Loader/> : null
    }
    const config = {
        headers: {
            Authorization: "Bearer ".concat(user?.sessionToken)
        }
    }
    const groupApplications = (app: any) => {
        const selectedClone = selectedChangeStatus?.filter((status: string) => {
            return status != DATE_ADDED
        })
        const list = getFilter(app, user, selectedClone, cashier, director, checker, evaluator);

                setTotal(list?.length)
        const groups = list?.reduce((groups: any, activity: any) => {

            if (!groups[formatDate(activity.createdAt)]) {
                groups[formatDate(activity.createdAt)] = [];
            }

            groups[formatDate(activity.createdAt)].push(activity);
            return groups;
        }, {});


        return Object.keys(groups).map((date) => {
            return {
                date,
                readableHuman: moment([date]).fromNow(),
                activity: groups[date],
            };
        });
    }
    useEffect(() => {
        let isCurrent = true;
        (async () => {
            if (isCurrent) await AsyncStorage.getItem('searchHistory').then((value) => setSearchHistory(JSON.parse(value) || []))
        })()
        return () => {
            isCurrent = false
        }
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
    const clearAllSearchHistory = async (index: number) => {
        setSearchHistory([])
        await AsyncStorage.setItem(
            'searchHistory',
            JSON.stringify([])
        )
    }
    const handler = useCallback(_.debounce((text: string) => setText(text), 1000), []);
    const handleLoad= async (text: string) => {
        let _page: number;
        if (!text.trim()) return
        try {

            setInfiniteLoad(true)
            if ((page * size) < total) {
                _page = page + 1
                axios.get(BASE_URL + `/applications`, {
                    ...config, params: {
                        keyword: text,
                        page: _page
                    }
                }).then(async (response) => {
                    setInfiniteLoad(false);
                    if (response?.data?.page) {
                        setPage(response?.data?.page)

                    } else {
                        setPage(0)
                    }
                   // response?.data?.total ? setTotal(response?.data?.total) : setTotal(0)
                    response?.data?.size ? setPage(response?.data?.size) : setPage(0)

                    setApplications(application => [...application , ...groupApplications(response?.data?.docs)])

                    await AsyncStorage.getItem('searchHistory').then(async (value) => {
                        value = JSON.parse(value) || []

                        let newArr = [...value, text];
                        await AsyncStorage.setItem(
                            'searchHistory',
                            JSON.stringify(newArr)
                        );

                        setSearchHistory(newArr)
                    }) .catch((e) =>{
                        Alert.alert('Alert', e?.message || 'Something went wrong.')
                    })
                }).catch(()=>{
                    setInfiniteLoad(false);
                })
            }else{
                _page = page + 1

                axios.get(BASE_URL + `/applications`, {
                    ...config, params: {
                        keyword: text,
                        page: _page
                    }
                }).then((response) => {
                    if (response?.data?.message) Alert.alert(response.data.message)
                    if (response?.data?.size) setSize(response?.data?.size)
                   // if (response?.data?.total) setTotal(response?.data?.total)
                    if (response?.data?.page) setPage(response?.data?.page)

                    setInfiniteLoad(false);
                }).catch((err) => {
                    setInfiniteLoad(false)
                    Alert.alert('Alert', err?.message || 'Something went wrong.')
                })
                setInfiniteLoad(false)
            }
        } catch (error) {
            setInfiniteLoad(false)
        }
    }
    const setText = async (text: string) => {
        if (!text.trim()) return
        try {
            setInfiniteLoad(true)
            axios.get(BASE_URL + `/applications`, {
                ...config, params: {
                    keyword: text
                }
            }).then(async (response) => {
                console.log(response?.data?.size, response?.data?.total, response?.data?.page)
                if(response?.data?.page){
                    setPage(response?.data?.page)

                } else{
                    setPage(0)
                }
               // response?.data?.total ? setTotal(response?.data?.total) : setTotal(0)
                response?.data?.size ? setPage(response?.data?.size) : setPage(0)
                setApplications(groupApplications(response?.data?.docs))
                setInfiniteLoad(false);
                await AsyncStorage.getItem('searchHistory').then(async (value) => {
                    value = JSON.parse(value) || []

                    let newArr = [...value, text];
                    await AsyncStorage.setItem(
                        'searchHistory',
                        JSON.stringify(newArr)
                    );

                    setSearchHistory(newArr)
                })
            }).catch((err)=>{
                Alert.alert('Alert', err?.message || 'Something went wrong.')
                setInfiniteLoad(false);
            })
        } catch (error) {
            
            setInfiniteLoad(false);
        }
    }

    function handleBackButtonClick() {
        props.navigation.goBack()
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);
    return (
        <SearchActivity
            clearAll={clearAllSearchHistory}
            loading={infiniteLoad}
            handleLoad={handleLoad}
            setText={setText}
            bottomLoader={bottomLoader}
            size={size}
            total={total}
            applications={applications}
            onPress={handleBackButtonClick}
            value={textInput}
            onEndEditing={() => {

            }}
            onChange={(event) => {
                handler(event.nativeEvent.text)
            }}
            onChangeText={(text) => {
                setTextInput(text)
            }}
            onPress1={() => {
                setTextInput("")

            }}
            translateX={props.initialMove} nevers={searchHistory} callbackfn={(search, index) => {

            return <View key={index} style={styles.group6}>
                <TouchableOpacity onPress={() => {
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
                    <CloseIcon width={12} height={12}></CloseIcon>
                </TouchableOpacity>

            </View>

        }}/>

    );
}

export default Search;
