import React, {useCallback, useEffect, useState} from "react";
import {Alert, BackHandler, Text, TouchableOpacity, View} from "react-native";
import HistoryIcon from "@assets/svg/historyIcon";
import CloseIcon from "@assets/svg/close";
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from "lodash";
import {SearchActivity} from "@pages/activities/search/searchActivity";
import {styles} from '@pages/activities/search/styles'
import axios from "axios";
import {BASE_URL} from "../../../../services/config";
import {RootStateOrAny, useSelector} from "react-redux";
import {CASHIER, CHECKER, DATE_ADDED, DIRECTOR, EVALUATOR} from "../../../../reducers/activity/initialstate";
import {formatDate, getFilter} from "@pages/activities/script";
import moment from "moment";
import Loader from "@pages/activities/bottomLoad";
import {defaultSanitize} from "@pages/activities/search/utils";
import {useUserRole} from "@pages/activities/hooks/useUserRole";
import {RFValue} from "react-native-responsive-fontsize";

function Search(props: any) {
    const {selectedChangeStatus} = useSelector((state: RootStateOrAny) => state.activity)
    const user = useSelector((state: RootStateOrAny) => state.user);
     const [isHandleLoad, setIsHandleLoad] = useState(true)
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(0)
    const [total, setTotal] = useState(0)
    const [isRecentSearches, setIsRecentSearches] = useState(false)
    const [textInput, setTextInput] = useState("")
    const [searchHistory, setSearchHistory] = useState<[]>([])
    const [applications, setApplications] = useState([])
    const { cashier , director , evaluator , checker , accountant } = useUserRole();


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
        const list = getFilter({list : app, user : user, selectedClone : selectedClone, cashier : cashier, director : director, checker : checker, evaluator : evaluator, accountant : accountant});

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
            setIsRecentSearches(false)
            if (isCurrent) await AsyncStorage.getItem('searchHistory').then((value) => {
                setSearchHistory(JSON.parse(value) || [])
                setIsRecentSearches(true)
            })
        })()
        return () => {
            setInfiniteLoad(false)

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
    const handler = useCallback(_.debounce((text: string, callback: () => {}) => {
        setText(text, (bool) => {
            callback(false)
        })

    }, 1000), []);
    const handleLoad = async (text: string) => {

        let _page: number;
        if (!text.trim()) return
        try {

            setInfiniteLoad(true)
            if ((page * size) < total) {
                _page = page + 1
                setIsHandleLoad(false)
                await axios.get(BASE_URL + `/applications`, {
                    ...config, params: {
                        keyword: defaultSanitize(text),
                        page: _page
                    }
                }).then(async (response) => {

                    setIsHandleLoad(false)
                    setInfiniteLoad(false);
                    if (response?.data?.page && response?.data?.docs.length > 1) {
                        setPage(response?.data?.page)

                    } else {
                        setPage(0)
                    }
                    response?.data?.total ? setTotal(response?.data?.total) : setTotal(0)
                    response?.data?.size ? setSize(response?.data?.size) : setSize(0)

                    setApplications(application => [...application, ...groupApplications(response?.data?.docs)])
                    await AsyncStorage.getItem('searchHistory').then(async (value) => {
                        value = JSON.parse(value) || []

                        let newArr = [...value, text];
                        await AsyncStorage.setItem(
                            'searchHistory',
                            JSON.stringify(newArr)
                        );

                        setSearchHistory(newArr)
                    }).catch((e) => {
                        Alert.alert('Alert', e?.message || 'Something went wrong.')
                    })
                }).catch(() => {
                    setIsHandleLoad(false)
                    setInfiniteLoad(false);
                })
            } else {
                _page = page + 1
                setIsHandleLoad(true)
                await axios.get(BASE_URL + `/applications`, {
                    ...config, params: {
                        keyword: defaultSanitize(text),
                        page: _page
                    }
                }).then((response) => {
                    if (response?.data?.message) Alert.alert(response.data.message)
                    if (response?.data?.size) {
                        setSize(response?.data?.size)
                    } else {
                        setSize(0)
                    }
                    if (response?.data?.total) setTotal(response?.data?.total)
                    if (response?.data?.page && response?.data?.docs.length > 1) {
                        setPage(response?.data?.page)
                    }
                    setIsHandleLoad(false)
                    setInfiniteLoad(false);
                }).catch((err) => {
                    setIsHandleLoad(false)
                    setInfiniteLoad(false)
                    Alert.alert('Alert', err?.message || 'Something went wrong.')
                })

            }
        } catch (error) {
            setIsHandleLoad(false)
            setInfiniteLoad(false)
        }
    }
    const setText = async (text: string, callback: (bool) => void) => {
        setPage(1)
        if (!text.trim()) {
            callback(true)
            return
        }
        try {
            setIsHandleLoad(false)
            const _page = page + 1
            await axios.get(BASE_URL + `/applications`, {
                ...config, params: {
                    keyword: defaultSanitize(text)
                }
            }).then(async (response) => {
                setIsHandleLoad(true)
                if (response?.data?.page) {
                    setPage(response?.data?.page)

                } else {
                    setPage(0)
                }
                response?.data?.total ? setTotal(response?.data?.total) : setTotal(0)
                response?.data?.size ? setSize(response?.data?.size) : setSize(0)
                setApplications(groupApplications(response?.data?.docs))

                await AsyncStorage.getItem('searchHistory').then(async (value) => {
                    value = JSON.parse(value) || []

                    let newArr = [...value, text];
                    await AsyncStorage.setItem(
                        'searchHistory',
                        JSON.stringify(newArr)
                    );

                    setSearchHistory(newArr)
                })

                callback(true)
            }).catch((err) => {
                setIsHandleLoad(true)

                Alert.alert('Alert', err?.message || 'Something went wrong.')
                callback(false)
            })
        } catch (error) {
            setIsHandleLoad(true)

            setInfiniteLoad(false);
        }
    }

    const handleBackButtonClick = () => {
        props.navigation.goBack()
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);

    const onTextChange = (event) =>{
        setInfiniteLoad(true)
        handler(event, (bool) => {
            setInfiniteLoad(false)
        })
    }
    return (
        <SearchActivity
            isHandleLoad={isHandleLoad}
            isRecentSearches={isRecentSearches}
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
            onChange={(event) => onTextChange(event.nativeEvent.text)}
            onChangeText={(text) => setTextInput(text)}
            onPress1={() => setTextInput("")}
            translateX={props.initialMove}
            nevers={searchHistory}
            callbackfn={(search, index) => {

            return <View key={index} style={styles.group6}>
                <TouchableOpacity onPress={() => {
                    onTextChange(search)
                    setTextInput(search)
                }}>
                    <View style={styles.group5}>
                        <HistoryIcon height={RFValue(20)} width={RFValue(20)} style={ styles.icon3 }/>
                        <Text style={styles.loremIpsum}>{search}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    removeSearchHistory(index)
                }}>
                    <CloseIcon height={RFValue(16)} width={RFValue(16)}/>
                </TouchableOpacity>

            </View>

        }}/>

    );
}

export default Search;
